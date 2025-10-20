<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\CategoryController;

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::apiResource('events', EventController::class);
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $request) => $request->user());
    Route::apiResource('events', EventController::class);
    Route::post('/events/{id}/users', [EventController::class, 'addUser']);
    Route::delete('/events/{id}/users/{user_id}', [EventController::class, 'removeUser']);
    Route::get('/events/{id}/users', [EventController::class, 'getUsers']);
    Route::patch('/events/{event_id}/users/update-status', [EventController::class, 'updateUserStatus']);
    

});
Route::middleware('auth:sanctum')->get('/user/events', [EventController::class, 'getUserEvents']);
Route::middleware('auth:sanctum')->post('/events', [EventController::class, 'store']);
Route::get('/my-events', [EventController::class, 'myEvents']);
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);
Route::post('/change-password', [App\Http\Controllers\UserController::class, 'changePassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});

