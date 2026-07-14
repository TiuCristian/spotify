<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\User;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $email = $request->query('email');
        $targetId = $request->query('target_id');

        if (!$email || !$targetId) return response()->json([]);

        $user = User::where('email', $email)->first();
        if (!$user) return response()->json([]);

        // Mark incoming messages from target_id as read
        Message::where('sender_id', $targetId)
               ->where('receiver_id', $user->id)
               ->where('is_read', false)
               ->update(['is_read' => true]);

        $messages = Message::where(function($q) use ($user, $targetId) {
            $q->where('sender_id', $user->id)
              ->where('receiver_id', $targetId);
        })->orWhere(function($q) use ($user, $targetId) {
            $q->where('sender_id', $targetId)
              ->where('receiver_id', $user->id);
        })->orderBy('created_at', 'asc')->get();

        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'target_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000'
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user) return response()->json(['error' => 'User not found'], 404);

        $message = Message::create([
            'sender_id' => $user->id,
            'receiver_id' => $request->target_id,
            'message' => $request->message
        ]);

        return response()->json($message);
    }

    public function unread(Request $request)
    {
        $email = $request->query('email');
        if (!$email) return response()->json([]);
        
        $user = User::where('email', $email)->first();
        if (!$user) return response()->json([]);

        $unread = Message::where('receiver_id', $user->id)
            ->where('is_read', false)
            ->with('sender:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($unread);
    }
}
