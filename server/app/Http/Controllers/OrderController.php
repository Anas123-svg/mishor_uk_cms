<?php
namespace App\Http\Controllers;

use App\Models\Orders;
use App\Models\OrderItem;
use App\Models\Product; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Orders::with('user', 'items.product')->get();
        $orders = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'payment_method' => $order->payment_method,
                'shipping_address_line1' => $order->shipping_address_line1,
                'shipping_address_line2' => $order->shipping_address_line2,
                'shipping_city' => $order->shipping_city,
                'shipping_state' => $order->shipping_state,
                'shipping_postal_code' => $order->shipping_postal_code,
                'shipping_country' => $order->shipping_country,
                'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                'name' => $order->user->first_name . ' ' . $order->user->last_name,
                'email' => $order->user->email,
                'phone' => $order->user->mobile_phone_number,
                'items' => $order->items->map(function ($item) {
                    return [
                        'product' => $item->product, 
                        'quantity' => $item->quantity,
//                        'size' => $item->size,
                    ];
                }),
            ];
        });
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'total_amount' => 'required|numeric',
            'payment_method' => 'required|string',
            'shipping_address_line1' => 'required|string',
            'shipping_address_line2' => 'nullable|string',
            'shipping_city' => 'required|string',
            'shipping_state' => 'required|string',
            'shipping_postal_code' => 'required|string',
            'shipping_country' => 'required|string',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer',
            'items.*.size' => 'nullable|string',
        ]);

        $user = Auth::user();
        $orderNumber = 'ORD' . strtoupper(uniqid());

        $orderData = array_merge($request->all(), [
            'user_id' => $user->id,
            'order_number' => $orderNumber,
            'status' => 'pending',
        ]);

        $order = Orders::create($orderData);

        foreach ($request->input('items') as $itemData) {
            $itemData['order_id'] = $order->id;
            OrderItem::create($itemData);
        }

        $response = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'total_amount' => $order->total_amount,
            'status' => $order->status,
            'payment_method' => $order->payment_method,
            'shipping_address_line1' => $order->shipping_address_line1,
            'shipping_address_line2' => $order->shipping_address_line2,
            'shipping_city' => $order->shipping_city,
            'shipping_state' => $order->shipping_state,
            'shipping_postal_code' => $order->shipping_postal_code,
            'shipping_country' => $order->shipping_country,
            'created_at' => $order->created_at->format('Y-m-d H:i:s'),
            'name' => $user->first_name . ' ' . $user->last_name,
            'email' => $user->email,
            'phone' => $user->mobile_phone_number,
            'items' => $order->items->map(function ($item) {
                return [
                    'product' => $item->product, 
                    'quantity' => $item->quantity,
                  //  'size' => $item->size,
                ];
            }),
        ];

        return response()->json($response, 201);
    }

    public function show($id)
    {
        $order = Orders::with('user', 'items.product')->find($id);

        if (is_null($order)) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'total_amount' => $order->total_amount,
            'status' => $order->status,
            'payment_method' => $order->payment_method,
            'shipping_address_line1' => $order->shipping_address_line1,
            'shipping_address_line2' => $order->shipping_address_line2,
            'shipping_city' => $order->shipping_city,
            'shipping_state' => $order->shipping_state,
            'shipping_postal_code' => $order->shipping_postal_code,
            'shipping_country' => $order->shipping_country,
            'created_at' => $order->created_at->format('Y-m-d H:i:s'),
            'name' => $order->user->first_name . ' ' . $order->user->last_name,
            'email' => $order->user->email,
            'phone' => $order->user->mobile_phone_number,
            'items' => $order->items->map(function ($item) {
                return [
                    'product' => $item->product, 
                    'quantity' => $item->quantity,
                   // 'size' => $item->size,
                ];
            }),
        ];

        return response()->json($order);
    }

    public function update(Request $request, $id)
    {
        $order = Orders::find($id);

        if (is_null($order)) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $request->validate([
            'total_amount' => 'sometimes|numeric',
            'payment_method' => 'sometimes|string',
            'shipping_address_line1' => 'sometimes|string',
            'shipping_address_line2' => 'sometimes|string',
            'shipping_city' => 'sometimes|string',
            'shipping_state' => 'sometimes|string',
            'shipping_postal_code' => 'sometimes|string',
            'shipping_country' => 'sometimes|string',
            'status' => 'sometimes|in:pending,processing,completed,cancelled',
            'items' => 'sometimes|array',
            'items.*.product_id' => 'sometimes|exists:products,id',
            'items.*.quantity' => 'sometimes|integer',
            'items.*.size' => 'nullable|string',
        ]);

        $order->update($request->only([
            'total_amount',
            'payment_method',
            'shipping_address_line1',
            'shipping_address_line2',
            'shipping_city',
            'shipping_state',
            'shipping_postal_code',
            'shipping_country',
            'status',
        ]));
        $order->items()->delete();

        foreach ($request->input('items', []) as $itemData) {
            $itemData['order_id'] = $order->id;
            OrderItem::create($itemData);
        }
    
        return response()->json($order->load('items.product'));
        }

    public function destroy($id)
    {
        $order = Orders::find($id);

        if (is_null($order)) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->items()->delete();
        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }

    /**
     * Get the count of all orders in the database.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOrderCount()
    {
        $orderCount = Orders::count(); 
        return response()->json(['count' => $orderCount]);
    }
}
