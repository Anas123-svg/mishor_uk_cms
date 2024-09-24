<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wishlist; 
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Controller as BaseController;

class UserController extends BaseController
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:15',
            'address' => 'required|string|max:255',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'phone' => $validatedData['phone'],
            'address' => $validatedData['address'],
            'password' => Hash::make($validatedData['password']),
        ]);

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'user' => $user->load(['wishlists.product', 'carts.product']), 
            'token' => $token,
        ], 201);
    }

    public function show()
    {
        $user = Auth::user()->load(['wishlists.product', 'carts.product']);
        return response()->json($user);
    }

    public function showById($id)
    {
        $user = User::with(['wishlists.product', 'carts.product'])->findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
    
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string',
            'address' => 'sometimes|string',
            'password' => 'sometimes|string|min:8|nullable',
        ]);
    
        $user->update($request->only(['name', 'email', 'phone', 'address']));
    
        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($request->password)]);
        }
    
        return response()->json($user->load(['wishlists.product', 'carts.product']), 200); // Load products
    }
    
    public function updateById(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string',
            'address' => 'sometimes|string',
            'password' => 'sometimes|string|min:8|nullable',
        ]);
    
        $user->update($request->only(['name', 'email', 'phone', 'address']));
    
        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($request->password)]);
        }
    
        return response()->json(['message' => 'User updated successfully', 'user' => $user->load(['wishlists.product', 'carts.product'])], 200); // Load products
    }
    
    public function destroy()
    {
        $user = Auth::user();
        $user->delete();

        return response()->json(['message' => 'User deleted'], 200);
    }

    public function logout()
    {
        Auth::user()->tokens()->delete();

        return response()->json(['message' => 'Logged out'], 200);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user && Hash::check($request->password, $user->password)) {
            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user->load(['wishlists.product', 'carts.product']), 
            ], 200);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    public function index()
    {
        $users = User::with(['wishlists.product', 'carts.product'])->get();
        return response()->json($users);
    }
}
