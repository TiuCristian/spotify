<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$songs = \App\Models\Song::whereNull('cover_image_path')->get();
foreach($songs as $song) {
    $term = trim($song->title . ' ' . $song->artist);
    echo "Fetching cover for: $term\n";
    $coverPath = null;
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
                    echo "-> Saved iTunes cover: $filename\n";
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
                        echo "-> Saved YouTube cover (full query): $filename\n";
                    }
                }
            }
            // Secondary fallback
            if (!$coverPath) {
                $ytUrl = "https://www.youtube.com/results?search_query=" . urlencode(trim($song->title));
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
                            echo "-> Saved YouTube cover (title only): $filename\n";
                        }
                    }
                }
            }
        } catch (\Exception $e) {
             echo "Error YT: " . $e->getMessage() . "\n";
        }
    }

    if ($coverPath) {
        $song->cover_image_path = $coverPath;
        $song->save();
    } else {
        echo "-> Failed to find cover anywhere.\n";
    }
}
echo "Done.\n";
