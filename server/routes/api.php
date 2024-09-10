<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProductController; 
use App\Http\Controllers\CategoryController;

Route::get('/products/count', [ProductController::class, 'getProductCount']);

Route::get('/products', [ProductController::class, 'index']);       // List all products here gi
Route::post('products', [ProductController::class, 'store']);      // Create a new product
Route::get('products/{id}', [ProductController::class, 'show']);   // Show a specific product
Route::put('products/{id}', [ProductController::class, 'update']); // Update a specific product
Route::delete('products/{id}', [ProductController::class, 'destroy']); // Delete a specific product
Route::get('/categories/{id}/products', [ProductController::class, 'getProductsByCategory']); // Get products by category
// Category routes
Route::get('/categories', [CategoryController::class, 'index']);       // List all categories
Route::post('/categories', [CategoryController::class, 'store']);      // Create a new category
Route::get('/categories/{id}', [CategoryController::class, 'show']);   // Show a specific category
Route::put('/categories/{id}', [CategoryController::class, 'update']); // Update a specific category
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']); // Delete a specific category






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
