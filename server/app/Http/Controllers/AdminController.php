<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    /**
     * Handle the admin login request.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        Log::info('Admin login attempt:', $request->only('email'));
    
        $credentials = $request->only('email', 'password');
        
        $admin = Admin::where('email', $credentials['email'])->first();
        
        if ($admin && Hash::check($credentials['password'], $admin->password)) {
            $token = $admin->createToken('admin-token')->plainTextToken;
            
            Log::info('Admin logged in successfully:', ['email' => $admin->email]);
            
            return response()->json([
                'token' => $token,
                'admin' => [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'role' => $admin->role,
                    'profile_pic' => $admin->profile_pic,
                    'permissions' => $admin->permissions
                ]
            ], 200);
        }
    
        // Log failed login attempt
        Log::warning('Admin login failed:', ['email' => $credentials['email']]);
        
        return response()->json(['message' => 'Email or password are incorrect'], 401);
    }
    


    /**
     * List all admins.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $admins = Admin::all();
        Log::info('Listing all admins.', ['admin_count' => $admins->count()]);
        return response()->json($admins);
    }

    /**
     * Create a new admin.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string',
            'permissions' => 'required|array',
            'profile_pic' => 'sometimes|string',
        ]);

        $data['password'] = Hash::make($data['password']);

        $admin = Admin::create($data);

        Log::info('Admin created successfully.', ['admin_id' => $admin->id, 'email' => $admin->email]);

        return response()->json(['message' => 'success', 'admin' => $admin], 201);
    }

    /**
     * Update an existing admin.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function selfUpdate(Request $request)
    {
        $admin = Auth::guard('admin')->user();
    
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:admins,email,' . $admin->id,
            'old_password' => 'sometimes|required_if:password,present|string|min:8',
            'password' => 'sometimes|required_if:old_password,present|string|min:8|confirmed',
            'role' => 'sometimes|required|string',
            'permissions' => 'sometimes|required|array',
            'profile_pic' => 'sometimes|string',
        ]);
    
        if (isset($data['old_password']) && isset($data['password'])) {
            if (!Hash::check($data['old_password'], $admin->password)) {
                return response()->json(['message' => 'The old password is incorrect.'], 400);
            }
    
            $data['password'] = Hash::make($data['password']);
        } elseif (isset($data['password'])) {
            return response()->json(['message' => 'Old password is required to update the password.'], 400);
        }
    
        $admin->update($data);
    
        Log::info('Admin updated successfully.', ['admin_id' => $admin->id, 'email' => $admin->email]);
    
        return response()->json(['message' => 'Admin updated successfully', 'admin' => $admin]);
    }
    


    public function update($id, Request $request)
    {
        $admin = Admin::findOrFail($id);
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:admins,email,' . $admin->id,
            'old_password' => 'sometimes|required_if:password,present|string|min:8',
            'password' => 'sometimes|required_if:old_password,present|string|min:8|confirmed',
            'role' => 'sometimes|required|string',
            'permissions' => 'sometimes|required|array',
            'profile_pic' => 'sometimes|string',
        ]);
    
        if (isset($data['old_password']) && isset($data['password'])) {
            if (!Hash::check($data['old_password'], $admin->password)) {
                return response()->json(['message' => 'The old password is incorrect.'], 400);
            }
    
            $data['password'] = Hash::make($data['password']);
        } elseif (isset($data['password'])) {
            return response()->json(['message' => 'Old password is required to update the password.'], 400);
        }
    
        $admin->update($data);
    
        Log::info('Admin updated successfully.', ['admin_id' => $admin->id, 'email' => $admin->email]);
    
        return response()->json(['message' => 'Admin updated successfully', 'admin' => $admin]);
    }

    /**
     * Delete an admin.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $admin = Admin::findOrFail($id);
        $admin->delete();

        Log::info('Admin deleted successfully.', ['admin_id' => $admin->id, 'email' => $admin->email]);

        return response()->json(['message' => 'Admin deleted successfully']);
    }

    

    /**
     * Log out the current admin.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        $admin = Auth::guard('admin')->user(); // Use Auth guard to get the authenticated admin
        
        if ($admin) {
            // Revoke all tokens...
            $admin->tokens()->delete(); // This deletes all tokens for the current admin

            Log::info('Admin logged out successfully.', ['email' => $admin->email]);

            return response()->json(['message' => 'Logged out successfully'], 200);
        }

        Log::warning('Admin logout failed. No authenticated admin found.');

        return response()->json(['message' => 'Logout failed'], 401);
    }

    /**
     * Return the currently authenticated admin's data.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAdminData(Request $request)
    {
        $admin = Auth::guard('admin')->user(); 
    
        if ($admin) {
            $token = $request->bearerToken();
    
            Log::info('Returning current admin data.', ['admin_id' => $admin->id, 'email' => $admin->email]);
    
            return response()->json([
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
                'profile_pic' => $admin->profile_pic,
                'permissions' => $admin->permissions,
                'token' => $token 
            ], 200);
        }
    
        Log::warning('Failed to retrieve admin data. No authenticated admin found.');
    
        return response()->json(['message' => 'Admin not found or unauthorized'], 401);
    }
    

}
