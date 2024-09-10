<?php
// app/Http/Middleware/AdminAuth.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;
use App\Models\Admin; 

class AdminAuth
{
    public function handle($request, Closure $next)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $accessToken = PersonalAccessToken::findToken($token);
        if (!$accessToken || $accessToken->name !== 'admin-token') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $admin = Admin::find($accessToken->tokenable_id);
        if (!$admin) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        Auth::guard('admin')->setUser($admin);
        return $next($request);
    }
}
