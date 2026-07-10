<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    public function redirect()
    {
        if (empty(env('GOOGLE_CLIENT_ID'))) {
            // Simulated OAuth redirect if credentials are not configured
            return view('auth.google-mock');
        }

        return Socialite::driver('google')->redirect();
    }

    public function callback(Request $request)
    {
        try {
            if ($request->has('simulated')) {
                // Create a simulated Google user from mock interface
                $email = $request->input('email', 'google_user_' . rand(1000, 9999) . '@gmail.com');
                $name = $request->input('name', 'Google User');
            } else {
                $googleUser = Socialite::driver('google')->user();
                $email = $googleUser->getEmail();
                $name = $googleUser->getName();
            }
            
            $user = User::firstOrCreate([
                'email' => $email,
            ], [
                'name' => $name,
                'password' => bcrypt(Str::random(24)),
                'role' => ($email === 'tiucrs@gmail.com') ? 'admin' : 'user'
            ]);

            Auth::login($user);
            $user->is_online = true;
            $user->save();

            // Redirect back to frontend
            return redirect('http://localhost:3000/?login_name=' . urlencode($user->name) . '&login_email=' . urlencode($user->email));
            
        } catch (\Exception $e) {
            return redirect('http://localhost:3000/register?error=social_auth_failed');
        }
    }

    public function facebookRedirect()
    {
        if (empty(env('FACEBOOK_CLIENT_ID'))) {
            return view('auth.facebook-mock');
        }

        return Socialite::driver('facebook')->redirect();
    }

    public function facebookCallback(Request $request)
    {
        try {
            if ($request->has('simulated')) {
                $email = $request->input('email', 'fb_user_' . rand(1000, 9999) . '@facebook.com');
                $name = $request->input('name', 'Facebook User');
            } else {
                $facebookUser = Socialite::driver('facebook')->user();
                $email = $facebookUser->getEmail() ?? $facebookUser->getId() . '@facebook.com';
                $name = $facebookUser->getName();
            }
            
            $user = User::firstOrCreate([
                'email' => $email,
            ], [
                'name' => $name,
                'password' => bcrypt(Str::random(24)),
                'role' => ($email === 'tiucrs@gmail.com') ? 'admin' : 'user'
            ]);

            Auth::login($user);
            $user->is_online = true;
            $user->save();

            return redirect('http://localhost:3000/?login_name=' . urlencode($user->name) . '&login_email=' . urlencode($user->email));
            
        } catch (\Exception $e) {
            return redirect('http://localhost:3000/register?error=social_auth_failed');
        }
    }
}
