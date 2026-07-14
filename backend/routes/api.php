<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\SongController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/songs', [SongController::class, 'index']);
Route::post('/songs', [SongController::class, 'store']);
Route::put('/songs/{id}', [SongController::class, 'update']);

Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
Route::post('/ping', [\App\Http\Controllers\Api\AuthController::class, 'ping']);
Route::put('/user/settings', [\App\Http\Controllers\Api\AuthController::class, 'updateSettings']);

Route::get('/playlists', [\App\Http\Controllers\Api\PlaylistController::class, 'index']);
Route::post('/playlists', [\App\Http\Controllers\Api\PlaylistController::class, 'store']);
Route::put('/playlists/{id}', [\App\Http\Controllers\Api\PlaylistController::class, 'update']);
Route::delete('/playlists/{id}', [\App\Http\Controllers\Api\PlaylistController::class, 'destroy']);
Route::post('/playlists/{playlistId}/songs', [\App\Http\Controllers\Api\PlaylistController::class, 'addSong']);

Route::get('/social', [\App\Http\Controllers\Api\SocialController::class, 'getSocialData']);
Route::post('/social/follow', [\App\Http\Controllers\Api\SocialController::class, 'sendRequest']);
Route::post('/social/accept', [\App\Http\Controllers\Api\SocialController::class, 'acceptRequest']);
Route::post('/social/decline', [\App\Http\Controllers\Api\SocialController::class, 'declineRequest']);
Route::post('/social/current-song', [\App\Http\Controllers\Api\SocialController::class, 'updateCurrentSong']);

Route::get('/chat/messages', [\App\Http\Controllers\Api\MessageController::class, 'index']);
Route::post('/chat/messages', [\App\Http\Controllers\Api\MessageController::class, 'store']);
Route::get('/chat/unread', [\App\Http\Controllers\Api\MessageController::class, 'unread']);
