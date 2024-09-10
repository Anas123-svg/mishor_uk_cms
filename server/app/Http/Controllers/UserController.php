<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of all users.
     */
    public function index()
    {
        $users = User::all();
        return response()->json($users, 200);
    }

    /**
     * Register a new user and return an access token.
     */
    public function register(Request $request)

    {
        \Log::info('Register method called');

        // Validate request
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'address' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'city' => 'nullable|string',
            'country' => 'nullable|string',
            'mobile_phone_number' => 'nullable|string',
            'bank_details' => 'nullable|string',
        ]);
    
        // Create user
        $user = User::create([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'address' => $validatedData['address'] ?? null,
            'postal_code' => $validatedData['postal_code'] ?? null,
            'city' => $validatedData['city'] ?? null,
            'country' => $validatedData['country'] ?? null,
            'mobile_phone_number' => $validatedData['mobile_phone_number'] ?? null,
            'bank_details' => $validatedData['bank_details'] ?? null,
        ]);
    
        // Generate token
        $token = $user->createToken('authToken')->plainTextToken;
    
        // Return user details along with the token
        return response()->json([
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'address' => $user->address,
                'postal_code' => $user->postal_code,
                'city' => $user->city,
                'country' => $user->country,
                'mobile_phone_number' => $user->mobile_phone_number,
                'bank_details' => $user->bank_details,
            ],
            'token' => $token
        ], 201);
    }
    
    /**
     * Login user and return an access token.
     */
    public function login(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
    
        // Attempt login
        if (!Auth::attempt($validatedData)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    
        // Get authenticated user
        $user = Auth::user();
        $token = $user->createToken('authToken')->plainTextToken;
    
        // Return user details along with the token
        return response()->json([
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'address' => $user->address,
                'postal_code' => $user->postal_code,
                'city' => $user->city,
                'country' => $user->country,
                'mobile_phone_number' => $user->mobile_phone_number,
                'bank_details' => $user->bank_details,
                // Add more user details as needed
            ],
            'token' => $token
        ], 200);
    }
    
    /**
     * Logout user (destroy token).
     */
    public function logout(Request $request)
    {
        // Revoke the current user's token
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    /**
     * Display the specified user by token (authenticated user).
     */
    public function showByToken()
    {
        $user = Auth::user();
        return response()->json($user, 200);
    }

    /**
     * Update the specified user by ID.
     */
    public function updateById(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Validate request
        $validatedData = $request->validate([
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'address' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'city' => 'nullable|string',
            'country' => 'nullable|string',
            'mobile_phone_number' => 'nullable|string',
            'bank_details' => 'nullable|string',
        ]);

        // Update user
        $user->update($validatedData);

        return response()->json($user, 200);
    }

    /**
     * Update the specified user by token (authenticated user).
     */
    public function updateByToken(Request $request)
    {
        $user = Auth::user();

        // Validate request
        $validatedData = $request->validate([
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'address' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'city' => 'nullable|string',
            'country' => 'nullable|string',
            'mobile_phone_number' => 'nullable|string',
            'bank_details' => 'nullable|string',
        ]);

        $user->update($validatedData);

        return response()->json($user, 200);
    }

    /**
     * Remove the specified user by ID.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}
