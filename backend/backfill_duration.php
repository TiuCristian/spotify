<?php
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Song;

$getID3 = new getID3();

$songs = Song::whereNull('duration')->get();
echo "Found " . $songs->count() . " songs without duration.\n";

foreach ($songs as $song) {
    $filePath = storage_path('app/public/' . $song->audio_file_path);
    if (file_exists($filePath)) {
        $fileInfo = $getID3->analyze($filePath);
        if (isset($fileInfo['playtime_string'])) {
            $song->duration = $fileInfo['playtime_string'];
            $song->save();
            echo "Updated " . $song->title . " to " . $song->duration . "\n";
        } else {
            echo "Could not get duration for " . $song->title . "\n";
        }
    } else {
        echo "File not found: " . $filePath . "\n";
    }
}
echo "Done.\n";
