<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SongController extends Controller
{
    public function index()
    {
        $songs = Song::latest()->get();
        return response()->json($songs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'artist' => 'required|string|max:255',
            'audio_file' => 'required|mimes:mp3,wav|max:20480', // max 20MB
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // max 5MB
            'duration' => 'nullable|string'
        ]);

        $audioPath = $request->file('audio_file')->store('songs/audio', 'public');
        
        $coverPath = null;
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('songs/covers', 'public');
        }

        $song = Song::create([
            'title' => $request->title,
            'artist' => $request->artist,
            'audio_file_path' => $audioPath,
            'cover_image_path' => $coverPath,
            'duration' => $request->duration,
        ]);

        if ($request->has('playlist_id') && $request->playlist_id !== 'null') {
            $playlist = \App\Models\Playlist::find($request->playlist_id);
            if ($playlist) {
                $playlist->songs()->attach($song->id);
            }
        }

        return response()->json([
            'message' => 'Song uploaded successfully',
            'song' => $song
        ], 201);
    }
}
