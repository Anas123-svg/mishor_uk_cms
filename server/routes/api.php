<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProductController; 
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReviewController;

use App\Http\Controllers\CartController;
use App\Http\Controllers\WishlistController;




Route::get('users', [UserController::class, 'index']);

Route::middleware('custom.auth')->group(function () {
    Route::put('user/update', [UserController::class, 'update']);
    Route::post('logout', [UserController::class, 'logout']);
    Route::get('user', [UserController::class, 'show']);
    Route::delete('user/delete', [UserController::class, 'destroy']);
   // Route::get('users', action: [UserController::class, 'index']);
    Route::put('/user/{id}', [UserController::class, 'updateById']);
    Route::get('user/{id}', [UserController::class, 'showById']);
    //reviews
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::get('/reviews/{id}', [ReviewController::class, 'show']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    //cart
    Route::get('/carts', [CartController::class, 'index']); 
    Route::get('/carts/{id}', [CartController::class, 'show']); 
    Route::post('/carts', [CartController::class, 'store']); 
    Route::put('/carts/{id}', [CartController::class, 'update']);
    Route::delete('/carts/{id}', [CartController::class, 'destroy']);
    //Wishlists 
    Route::get('/wishlists', [WishlistController::class, 'index']);
    Route::get('/wishlists/{id}', [WishlistController::class, 'show']);
    Route::post('/wishlists', [WishlistController::class, 'store']);
    Route::put('/wishlists/{id}', [WishlistController::class, 'update']);
    Route::delete('/wishlists/{id}', [WishlistController::class, 'destroy']);
    //orders by user
    //Route::get('/user/orders', [OrderController::class, 'getUserOrders']);

});
//order
Route::get('/user/{userId}/orders', [OrderController::class, 'getUserOrders']);

Route::prefix('orders')->group(function () {
    Route::post('/', [OrderController::class, 'store']);
    Route::get('/', [OrderController::class, 'index']); 
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::put('/{id}', [OrderController::class, 'update']);
    Route::delete('/{id}', [OrderController::class, 'destroy']); 
});


Route::post('register', [UserController::class, 'store']);
Route::post('login', [UserController::class, 'login']);

///Route::put('user/update', [UserController::class, 'update']);


Route::get('/products/filter-by-price', [ProductController::class, 'filterByPrice']);
Route::get('/products/count', action: [ProductController::class, 'getProductCount']);
Route::get('products/search', [ProductController::class, 'search']);

Route::get('/products', [ProductController::class, 'index']);       // List all products here gi
Route::post('products', [ProductController::class, 'store']);      // Create a new product
Route::get('products/{id}', [ProductController::class, 'show']);   // Show a specific product
Route::put('products/{id}', [ProductController::class, 'update']); // Update a specific product
Route::delete('products/{id}', [ProductController::class, 'destroy']); // Delete a specific product
//Route::get('/categories/{id}/products', [ProductController::class, 'getProductsByCategory']); // Get products by category
Route::get('/products-by-category', [ProductController::class, 'getProductsByCategory']);

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



Route::post('/forgot-password', [UserController::class, 'forgotPassword']);
Route::post('/reset-password', [UserController::class, 'resetPassword']);
