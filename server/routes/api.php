<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProductController; 
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;









Route::post('register', [UserController::class, 'register']);
Route::post('login', [UserController::class, 'login']);
Route::middleware('auth:sanctum')->post('logout', [UserController::class, 'logout']);
Route::middleware('auth:sanctum')->get('user', [UserController::class, 'showByToken']);
Route::middleware('auth:sanctum')->put('user/update', [UserController::class, 'updateByToken']);
Route::middleware('auth:sanctum')->get('users', [UserController::class, 'index']);
Route::middleware('auth:sanctum')->put('user/{id}', [UserController::class, 'updateById']);
Route::middleware('auth:sanctum')->delete('user/{id}', [UserController::class, 'destroy']);

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

//orders
Route::get('orders', [OrderController::class, 'index']);
Route::post('orders', [OrderController::class, 'store']);
Route::get('orders/{id}', [OrderController::class, 'show']);
Route::put('orders/{id}', [OrderController::class, 'update']);
Route::delete('orders/{id}', [OrderController::class, 'destroy']);
Route::get('orders', [OrderController::class, 'index']);

Route::get('orders/count', [OrderController::class, 'getOrderCount']);




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
