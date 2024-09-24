<?php 

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    // CREATE a new order
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'postalCode' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'status' => 'required|in:pending,processing,completed,cancelled',
            'paymentMethod' => 'required|string|max:100',
            'subTotal' => 'required|numeric|min:0',
            'delivery' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Create the order
        $order = Order::create($validated);

        // Save order items
        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity']
            ]);
        }

        // Fetch the order items with product details
        $orderItems = OrderItem::where('order_id', $order->id)
            ->with('product')
            ->get();

        // Include the items in the response
        return response()->json([
            'order_id' => $order->id,
            'order' => $order,
            'items' => $orderItems->map(function ($item) {
                return [
                    'quantity' => $item->quantity,
                    'product' => $item->product,
                ];
            }),
        ], 201);
    }

    // READ all orders
    public function index()
    {
        $orders = Order::with('orderItems.product')->get();
        return response()->json($orders);
    }

    // READ a single order by ID
    public function show($id)
    {
        $order = Order::findOrFail($id);

        return response()->json([
            'order' => $order,
            'items' => $order->orderItems()->with('product')->get()->map(function ($item) {
                return [
                    'quantity' => $item->quantity,
                    'product' => $item->product,
                ];
            }),
        ]);
    }

    // UPDATE an existing order
    public function update(Request $request, $id)
    {
        // Find the existing order
        $order = Order::findOrFail($id);
    
        // Validate the incoming request data
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'postalCode' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'status' => 'required|in:pending,processing,completed,cancelled',
            'paymentMethod' => 'required|string|max:100',
            'subTotal' => 'required|numeric|min:0',
            'delivery' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'items' => 'nullable|array',
            'items.*.product_id' => 'required_with:items|exists:products,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
        ]);
    
        // Update the order details
        $order->update($validated);
    
        // Check if there are any items to update
        if (isset($validated['items'])) {
            // Delete existing items for the order
            OrderItem::where('order_id', $order->id)->delete();
    
            // Create new order items based on the validated request
            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity']
                ]);
            }
        }
    
        // Fetch the updated order items with product details
        $orderItems = OrderItem::where('order_id', $order->id)
            ->with('product')
            ->get();
    
        // Return the response with updated order and items
        return response()->json([
            'order' => $order,
            'items' => $orderItems->map(function ($item) {
                return [
                    'quantity' => $item->quantity,
                    'product' => $item->product,
                ];
            }),
        ]);
    }
    
    // DELETE an order
    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }

    // GET all orders for a user by token
    public function getUserOrders(Request $request, $userId)
    {
        // Check if the user exists
        $user = User::find($userId);
    
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        // Fetch all orders for the specified user
        $orders = Order::where('user_id', $userId)->with('orderItems.product')->get();
    
        // Return structured JSON response
        return response()->json([
            'user_id' => $userId, // Include user ID in the response
            'orders' => $orders->map(function ($order) {
                return [
                    'order_id' => $order->id,
                    'status' => $order->status,
                    'total' => $order->total,
                    'items' => $order->orderItems->map(function ($item) {
                        return [
                            'product_id' => $item->product_id,
                            'quantity' => $item->quantity,
                            'product' => $item->product, // Assuming product relationship is defined
                        ];
                    }),
                ];
            }),
        ]);
    }
        
}

