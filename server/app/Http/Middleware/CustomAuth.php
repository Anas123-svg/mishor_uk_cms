<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Auth;

class CustomAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $accessToken = PersonalAccessToken::findToken($token);
        if (!$accessToken || $accessToken->name !== 'authToken') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = User::find($accessToken->tokenable_id);
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        Auth::guard('api')->setUser($user);
        return $next($request);
    }
}
