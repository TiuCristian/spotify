<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Playlist Details - Stainify Admin</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="{{ asset('admin-assets/assets/libs/fontawesome/css/all.min.css') }}">
  <style>
    body {
        background-color: #121212;
        color: #fff;
        font-family: 'Inter', sans-serif;
        margin: 0;
    }
    .spotify-header {
        background-color: #000;
        padding: 16px 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .spotify-header a {
        color: #fff;
        text-decoration: none;
        font-weight: bold;
    }
    .container {
        max-width: 1000px;
        margin: 40px auto;
        padding: 0 20px;
    }
    .playlist-header {
        margin-bottom: 30px;
    }
    .playlist-header h1 {
        font-size: 36px;
        margin-bottom: 5px;
    }
    .playlist-header p {
        color: #b3b3b3;
        font-size: 16px;
        margin-top: 0;
    }
    .song-list {
        background: #181818;
        border-radius: 8px;
        padding: 30px;
    }
    .song-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid #282828;
    }
    .song-item:last-child {
        border-bottom: none;
    }
    .song-title {
        font-size: 16px;
        font-weight: bold;
        color: #fff;
    }
    .song-artist {
        font-size: 14px;
        color: #b3b3b3;
        margin-top: 5px;
    }
    .song-duration {
        color: #b3b3b3;
        font-size: 14px;
    }
    
    /* Pagination Styles */
    .pagination-wrapper {
        margin-top: 30px;
        display: flex;
        justify-content: center;
    }
    .pagination-wrapper .pagination {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0;
        gap: 5px;
    }
    .pagination-wrapper .page-item .page-link {
        padding: 8px 12px;
        background: #282828;
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
        font-size: 14px;
        border: 1px solid #333;
        display: block;
    }
    .pagination-wrapper .page-item:not(.disabled) .page-link:hover {
        background: #3e3e3e;
    }
    .pagination-wrapper .page-item.active .page-link {
        background: #1db954;
        color: #000;
        font-weight: bold;
        border-color: #1db954;
    }
    .pagination-wrapper .page-item.disabled .page-link {
        color: #727272;
        cursor: not-allowed;
    }
  </style>
</head>
<body>

  <div class="spotify-header">
    <div>
        <a href="{{ route('admin.users.edit', $user->id) }}"><i class="fas fa-arrow-left"></i> Back to User Profile</a>
    </div>
    <div>
        <span>{{ auth()->user()->name }} (Admin)</span>
    </div>
  </div>

  <div class="container">
    <div class="playlist-header">
        <h1>{{ $playlist->name }}</h1>
        <p>Created by {{ $user->name }} &bull; {{ $displaySongs->total() }} songs total</p>
    </div>

    <div class="song-list">
        @if($displaySongs->count() > 0)
            @foreach($displaySongs as $song)
                <div class="song-item">
                    <div>
                        <div class="song-title">{{ $song->title }}</div>
                        <div class="song-artist">{{ $song->artist }}</div>
                    </div>
                    <div class="song-duration">
                        {{ $song->duration ?? '2:21' }}
                    </div>
                </div>
            @endforeach
        @else
            <div style="color: #b3b3b3; font-style: italic; text-align: center; padding: 20px 0;">
                No songs in this playlist.
            </div>
        @endif
    </div>

    @if($displaySongs->hasPages())
        <div class="pagination-wrapper">
            {{ $displaySongs->links('pagination::bootstrap-4') }}
        </div>
    @endif
  </div>

</body>
</html>
