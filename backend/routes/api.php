<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SongController;
use App\Http\Controllers\Api\PlaylistController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\SocialController;
use App\Http\Controllers\Api\MessageController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/songs', [SongController::class, 'index']);
Route::post('/songs', [SongController::class, 'store']);
Route::put('/songs/{id}', [SongController::class, 'update']);
Route::delete('/songs/{id}', [SongController::class, 'destroy']);

Route::get('/playlists', [PlaylistController::class, 'index']);
Route::post('/playlists', [PlaylistController::class, 'store']);
Route::put('/playlists/{id}', [PlaylistController::class, 'update']);
Route::delete('/playlists/{id}', [PlaylistController::class, 'destroy']);
Route::post('/playlists/{playlistId}/songs', [PlaylistController::class, 'addSong']);
Route::delete('/playlists/{playlistId}/songs/{songId}', [PlaylistController::class, 'removeSong']);

Route::put('/user/settings', [UserController::class, 'updateSettings']);

Route::get('/social', [SocialController::class, 'index']);
Route::post('/social/follow', [SocialController::class, 'follow']);
Route::post('/social/unfollow', [SocialController::class, 'unfollow']);
Route::post('/social/status', [SocialController::class, 'updateStatus']);

Route::get('/messages/{userId}', [MessageController::class, 'getMessages']);
Route::post('/messages', [MessageController::class, 'sendMessage']);
Route::post('/messages/seen', [MessageController::class, 'markAsSeen']);

Route::get('/audio/{path}', function ($path) {
    $file = storage_path('app/public/' . $path);
    if (!file_exists($file)) abort(404);
    return response()->file($file, [
        'Access-Control-Allow-Origin' => '*',
        'Accept-Ranges' => 'bytes',
        'Content-Type' => mime_content_type($file)
    ]);
})->where('path', '.*');
