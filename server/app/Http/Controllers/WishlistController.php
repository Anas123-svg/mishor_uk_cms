<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlists = Wishlist::with('product')->where('user_id', Auth::id())->get();
        return response()->json($wishlists);
    }

    public function show($id)
    {
        $wishlist = Wishlist::with('product')->where('user_id', Auth::id())->findOrFail($id);
        return response()->json($wishlist);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $validated['user_id'] = Auth::id();
        $wishlist = Wishlist::create($validated);
        return response()->json($wishlist, 201);
    }

    public function update(Request $request, $id)
    {
        $wishlist = Wishlist::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $wishlist->update($validated);
        return response()->json($wishlist);
    }

    public function destroy($id)
    {
        $wishlist = Wishlist::where('user_id', Auth::id())->findOrFail($id);
        $wishlist->delete();

        return response()->json(null, 204);
    }
}
