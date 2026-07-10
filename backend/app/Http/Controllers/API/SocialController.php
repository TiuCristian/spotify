<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SocialController extends Controller
{
    public function getSocialData(Request $request)
    {
        $email = $request->query('email');
        if (!$email) return response()->json(['error' => 'Email required'], 400);

        $currentUser = User::where('email', $email)->first();
        if (!$currentUser) return response()->json(['error' => 'User not found'], 404);

        // 1. Suggestions: Users I'm not following, haven't sent a request to, and aren't me
        $existingFollowIds = DB::table('follows')
            ->where('follower_id', $currentUser->id)
            ->pluck('followed_id');

        $suggestions = User::where('id', '!=', $currentUser->id)
            ->whereNotIn('id', $existingFollowIds)
            ->get(['id', 'name', 'email']);

        // 2. Pending Requests: Users who want to follow me
        $pendingRequests = User::whereHas('following', function($q) use ($currentUser) {
            $q->where('followed_id', $currentUser->id)->where('status', 'pending');
        })->get(['id', 'name', 'email']);

        // 3. Friends Activity: Users I follow AND who accepted me
        // Spotify friend activity usually shows people you follow. We can show people we follow who accepted.
        $friends = User::whereHas('followers', function($q) use ($currentUser) {
            $q->where('follower_id', $currentUser->id)->where('status', 'accepted');
        })->with('currentSong')->get(['id', 'name', 'email', 'is_online', 'current_song_id']);

        return response()->json([
            'suggestions' => $suggestions,
            'pendingRequests' => $pendingRequests,
            'friends' => $friends
        ]);
    }

    public function sendRequest(Request $request)
    {
        $email = $request->input('email');
        $targetId = $request->input('target_id');
        
        $currentUser = User::where('email', $email)->first();
        if (!$currentUser) return response()->json(['error' => 'User not found'], 404);

        $currentUser->following()->syncWithoutDetaching([
            $targetId => ['status' => 'pending']
        ]);

        return response()->json(['success' => true]);
    }

    public function acceptRequest(Request $request)
    {
        $email = $request->input('email');
        $followerId = $request->input('follower_id');

        $currentUser = User::where('email', $email)->first();
        if (!$currentUser) return response()->json(['error' => 'User not found'], 404);

        DB::table('follows')
            ->where('follower_id', $followerId)
            ->where('followed_id', $currentUser->id)
            ->update(['status' => 'accepted']);

        return response()->json(['success' => true]);
    }

    public function declineRequest(Request $request)
    {
        $email = $request->input('email');
        $followerId = $request->input('follower_id');

        $currentUser = User::where('email', $email)->first();
        if (!$currentUser) return response()->json(['error' => 'User not found'], 404);

        DB::table('follows')
            ->where('follower_id', $followerId)
            ->where('followed_id', $currentUser->id)
            ->delete();

        return response()->json(['success' => true]);
    }

    public function updateCurrentSong(Request $request)
    {
        $email = $request->input('email');
        $songId = $request->input('song_id');

        $currentUser = User::where('email', $email)->first();
        if ($currentUser) {
            $currentUser->current_song_id = $songId;
            $currentUser->save();
        }

        return response()->json(['success' => true]);
    }
}
