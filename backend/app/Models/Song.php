<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    protected $fillable = [
        'title',
        'artist',
        'album',
        'cover_image_path',
        'audio_file_path',
        'duration',
    ];

    public function playlists()
    {
        return $this->belongsToMany(Playlist::class);
    }
}
