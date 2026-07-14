<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = User::withCount('playlists')->paginate(10);
        return view('admin.users.index', compact('users'));
    }

    public function edit(User $user)
    {
        $user->load('playlists.songs');
        return view('admin.users.edit', compact('user'));
    }

    public function showPlaylist(User $user, \App\Models\Playlist $playlist)
    {
        if ($playlist->user_id !== $user->id) {
            abort(404);
        }

        if (strtolower($playlist->name) === 'work') {
            $displaySongs = \App\Models\Song::paginate(10);
        } else {
            $displaySongs = $playlist->songs()->paginate(10);
        }

        return view('admin.users.playlist', compact('user', 'playlist', 'displaySongs'));
    }

    public function currentSong(User $user)
    {
        if ($user->current_song_id && $user->currentSong) {
            $song = $user->currentSong;
            return response()->json([
                'is_playing' => true,
                'title' => $song->title,
                'artist' => $song->artist,
                'cover_url' => $song->cover_image_path ? asset('storage/' . $song->cover_image_path) : null
            ]);
        }
        return response()->json(['is_playing' => false]);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,user',
            'password' => 'nullable|string|min:8',
        ]);

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        return back()->with('success', 'User info updated successfully');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Cannot delete yourself.');
        }
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
