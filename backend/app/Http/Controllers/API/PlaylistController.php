<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Playlist;
use App\Models\User;

class PlaylistController extends Controller
{
    public function index(Request $request)
    {
        $email = $request->query('email');
        if (!$email) return response()->json([]);

        $user = User::where('email', $email)->first();
        if (!$user) return response()->json([]);

        $playlists = Playlist::with('songs')->where('user_id', $user->id)->get()->map(function($p) use ($user) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'type' => 'Playlist',
                'creator' => $user->name,
                'songs' => $p->songs
            ];
        });

        return response()->json($playlists);
    }

    public function store(Request $request)
    {
        $email = $request->input('email');
        $name = $request->input('name');

        $user = User::where('email', $email)->first();
        if (!$user) return response()->json(['error' => 'User not found'], 404);

        $playlist = Playlist::create([
            'user_id' => $user->id,
            'name' => $name
        ]);

        return response()->json([
            'id' => $playlist->id,
            'name' => $playlist->name,
            'type' => 'Playlist',
            'creator' => $user->name,
            'songs' => []
        ]);
    }

    public function update(Request $request, $id)
    {
        $playlist = Playlist::find($id);
        if (!$playlist) return response()->json(['error' => 'Not found'], 404);

        if ($request->has('name')) {
            $playlist->name = $request->input('name');
            $playlist->save();
        }

        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $playlist = Playlist::find($id);
        if ($playlist) {
            $playlist->delete();
        }
        return response()->json(['success' => true]);
    }

    public function addSong(Request $request, $playlistId)
    {
        $playlist = Playlist::find($playlistId);
        if (!$playlist) return response()->json(['error' => 'Not found'], 404);

        $songId = $request->input('song_id');
        if (!$playlist->songs()->where('song_id', $songId)->exists()) {
            $playlist->songs()->attach($songId);
        }

        return response()->json(['success' => true, 'songs' => $playlist->songs]);
    }
}
