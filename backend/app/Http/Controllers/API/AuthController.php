<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);

        $user = User::create([
            'name' => explode('@', $request->email)[0],
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user',
            'is_online' => true
        ]);

        return response()->json(['message' => 'User registered successfully', 'user' => $user]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $user->is_online = true;
            $user->save();
            return response()->json(['message' => 'Login successful', 'user' => $user]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function logout(Request $request)
    {
        $email = $request->input('email');
        if ($email) {
            $user = User::where('email', $email)->first();
            if ($user) {
                $user->is_online = false;
                $user->save();
            }
        }
        Auth::logout();
        return response()->json(['message' => 'Logged out']);
    }

    public function ping(Request $request)
    {
        $email = $request->input('email');
        if ($email) {
            $user = User::where('email', $email)->first();
            if ($user) {
                $user->is_online = true;
                $user->save();
                return response()->json(['status' => 'ok']);
            }
        }
        return response()->json(['status' => 'not found'], 404);
    }

    public function updateSettings(Request $request)
    {
        $email = $request->input('email');
        $user = User::where('email', $email)->first();
        if (!$user) return response()->json(['error' => 'User not found'], 404);

        if ($request->has('name') && $request->input('name')) {
            $user->name = $request->input('name');
        }
        if ($request->has('password') && strlen($request->input('password')) >= 8) {
            $user->password = Hash::make($request->input('password'));
        }
        $user->save();

        return response()->json(['success' => true, 'user' => clone $user]);
    }
}
