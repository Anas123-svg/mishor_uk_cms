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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'postalCode' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'status' => 'nullable|in:pending,processing,completed,cancelled',
            'paymentMethod' => 'required|string|max:100',
            'subTotal' => 'required|numeric|min:0',
            'delivery' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $order = Order::create($validated);

        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity']
            ]);
        }

        $orderItems = OrderItem::where('order_id', $order->id)
            ->with('product')
            ->get();

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

    public function index()
    {
        $orders = Order::with('orderItems.product')->get();
        return response()->json($orders);
    }

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

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
    
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
    
        $order->update($validated);
    
        if (isset($validated['items'])) {
            OrderItem::where('order_id', $order->id)->delete();
    
            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity']
                ]);
            }
        }
    
        $orderItems = OrderItem::where('order_id', $order->id)
            ->with('product')
            ->get();
    
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
    
    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }

    public function getUserOrders(Request $request, $userId)
    {
        $user = User::find($userId);
    
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        $orders = Order::where('user_id', $userId)->with('orderItems.product')->get();
    
        return response()->json([
            'user_id' => $userId, 
            'orders' => $orders->map(function ($order) {
                return [
                    'order_id' => $order->id,
                    'status' => $order->status,
                    'total' => $order->total,
                    'items' => $order->orderItems->map(function ($item) {
                        return [
                            'product_id' => $item->product_id,
                            'quantity' => $item->quantity,
                            'product' => $item->product, 
                        ];
                    }),
                ];
            }),
        ]);
    }
        
}

