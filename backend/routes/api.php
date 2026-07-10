<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\SongController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/songs', [SongController::class, 'index']);
Route::post('/songs', [SongController::class, 'store']);

Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);

Route::get('/playlists', [\App\Http\Controllers\Api\PlaylistController::class, 'index']);
Route::post('/playlists', [\App\Http\Controllers\Api\PlaylistController::class, 'store']);
Route::put('/playlists/{id}', [\App\Http\Controllers\Api\PlaylistController::class, 'update']);
Route::delete('/playlists/{id}', [\App\Http\Controllers\Api\PlaylistController::class, 'destroy']);
Route::post('/playlists/{playlistId}/songs', [\App\Http\Controllers\Api\PlaylistController::class, 'addSong']);
