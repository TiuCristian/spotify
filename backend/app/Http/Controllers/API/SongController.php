<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SongController extends Controller
{
    public function index(Request $request)
    {
        $email = $request->query('email');
        if (!$email) return response()->json([]);

        $user = \App\Models\User::where('email', $email)->first();
        if (!$user) return response()->json([]);

        $songs = Song::where('user_id', $user->id)->latest()->get();
        return response()->json($songs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'artist' => 'nullable|string|max:255',
            'audio_file' => 'required|mimes:mp3,wav|max:20480', // max 20MB
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // max 5MB
            'duration' => 'nullable|string'
        ]);

        $audioPath = $request->file('audio_file')->store('songs/audio', 'public');
        
        $coverPath = null;
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('songs/covers', 'public');
        } else {
            $term = trim($request->title . ' ' . ($request->artist ?: ''));
            $albumCoverUrl = 'https://itunes.apple.com/search?entity=musicTrack&term=' . urlencode($term) . '&limit=1';
            try {
                $imageContent = @file_get_contents($albumCoverUrl);
                if ($imageContent) {
                    $imageResult = json_decode($imageContent, true);
                    if (!empty($imageResult['results'])) {
                        $imageURL = str_replace("100x100", "600x600", $imageResult['results'][0]['artworkUrl100']);
                        $img = @file_get_contents($imageURL);
                        if ($img) {
                            $filename = 'songs/covers/itunes_' . time() . '_' . uniqid() . '.jpg';
                            \Illuminate\Support\Facades\Storage::disk('public')->put($filename, $img);
                            $coverPath = $filename;
                        }
                    }
                }
            } catch (\Exception $e) {}

            // Fallback to YouTube
            if (!$coverPath) {
                try {
                    $ytUrl = "https://www.youtube.com/results?search_query=" . urlencode($term);
                    $html = @file_get_contents($ytUrl);
                    if ($html) {
                        preg_match('/"videoId":"(.*?)"/', $html, $matches);
                        if (isset($matches[1])) {
                            $videoId = $matches[1];
                            $imageURL = "https://i.ytimg.com/vi/{$videoId}/hqdefault.jpg";
                            $img = @file_get_contents($imageURL);
                            if ($img) {
                                $filename = 'songs/covers/yt_' . time() . '_' . uniqid() . '.jpg';
                                \Illuminate\Support\Facades\Storage::disk('public')->put($filename, $img);
                                $coverPath = $filename;
                            }
                        }
                    }
                    
                    // Secondary fallback: just title
                    if (!$coverPath) {
                        $ytUrl = "https://www.youtube.com/results?search_query=" . urlencode(trim($request->title));
                        $html = @file_get_contents($ytUrl);
                        if ($html) {
                            preg_match('/"videoId":"(.*?)"/', $html, $matches);
                            if (isset($matches[1])) {
                                $videoId = $matches[1];
                                $imageURL = "https://i.ytimg.com/vi/{$videoId}/hqdefault.jpg";
                                $img = @file_get_contents($imageURL);
                                if ($img) {
                                    $filename = 'songs/covers/yt_' . time() . '_' . uniqid() . '.jpg';
                                    \Illuminate\Support\Facades\Storage::disk('public')->put($filename, $img);
                                    $coverPath = $filename;
                                }
                            }
                        }
                    }
                } catch (\Exception $e) {}
            }
        }

        $user = \App\Models\User::where('email', $request->input('email'))->first();
        if (!$user) return response()->json(['error' => 'User not found'], 404);

        $song = Song::create([
            'title' => $request->title,
            'artist' => $request->artist ?: 'Unknown Artist',
            'audio_file_path' => $audioPath,
            'cover_image_path' => $coverPath,
            'duration' => $request->duration,
            'user_id' => $user->id,
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

    public function update(Request $request, $id)
    {
        $song = Song::find($id);
        if (!$song) {
            return response()->json(['error' => 'Song not found'], 404);
        }

        $request->validate([
            'title' => 'required|string|max:255'
        ]);

        $song->title = $request->title;
        $song->save();

        return response()->json([
            'message' => 'Song updated successfully',
            'song' => $song
        ]);
    }
}
