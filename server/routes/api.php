<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
Route::get('/test', function () {
    return response()->json(['message' => 'Test route is accessible'], 200);
});

Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminController::class, 'login'])->name('admin.login');
    Route::middleware('admin.auth')->group(function () {
        Route::get('admins', [AdminController::class, 'index'])->name('admin.index');
        Route::post('admins', [AdminController::class, 'store'])->name('admin.store');
        Route::put('update', [AdminController::class, 'selfUpdate'])->name('admin.selfUpdate');
        Route::put('admins/{id}', [AdminController::class, 'update'])->name('admin.update');
        Route::delete('admins/{id}', [AdminController::class, 'destroy'])->name('admin.destroy');
        Route::post('logout', [AdminController::class, 'logout'])->name('admin.logout');
        Route::get('admin', [AdminController::class, 'getAdminData'])->name('admin.index');
        
    });
});
