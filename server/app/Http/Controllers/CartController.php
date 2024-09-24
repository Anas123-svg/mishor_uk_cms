<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        // Get the authenticated user
        $user = Auth::user();
        $carts = Cart::with('product')->where('user_id', $user->id)->get();
        return response()->json($carts);
    }

    public function show($id)
    {
        $user = Auth::user();
        $cart = Cart::with('product')->where('id', $id)->where('user_id', $user->id)->firstOrFail();
        return response()->json($cart);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1', // Include quantity validation
        ]);

        $user = Auth::user(); // Get the authenticated user
        $validated['user_id'] = $user->id; // Set user_id

        $cart = Cart::create($validated);
        return response()->json($cart, 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $cart = Cart::where('id', $id)->where('user_id', $user->id)->firstOrFail();

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1', // Include quantity validation
        ]);

        $cart->update($validated);
        return response()->json($cart);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $cart = Cart::where('id', $id)->where('user_id', $user->id)->firstOrFail();
        $cart->delete();

        return response()->json(null, 204);
    }
}
