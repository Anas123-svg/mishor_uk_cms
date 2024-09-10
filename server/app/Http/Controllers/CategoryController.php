<?php
namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')->get();

        $categories = $categories->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'created_at' => $category->created_at,
                'updated_at' => $category->updated_at,
                'products_count' => $category->products_count
            ];
        });

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    public function show($id)
    {
        $category = Category::with(['products.images', 'products.reviews.user'])->findOrFail($id);

        $category->products = $category->products->map(function ($product) {
            return [
                'id' => $product->id,
                'title' => $product->title,
                'description' => $product->description,
                'price' => $product->price,
                'discounted_price' => $product->discounted_price,
                'in_stock' => $product->in_stock,
                'in_stock_quantity' => $product->in_stock_quantity,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
                'images' => $product->images->pluck('image_path'),
                'reviews' => $product->reviews->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'product_id' => $review->product_id,
                        'reviewer_name' => $review->reviewer_name,
                        'review' => $review->review,
                        'rating' => $review->rating,
                        'created_at' => $review->created_at,
                        'updated_at' => $review->updated_at,
                        'user_email' => $review->user->email,
                    ];
                }),
                'category' => $product->category ? $product->category->name : null,
            ];
        });

        return response()->json([
            'id' => $category->id,
            'name' => $category->name,
            'created_at' => $category->created_at,
            'updated_at' => $category->updated_at,
            'products' => $category->products,
        ]);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category->update($validated);
        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(null, 204);
    }
}
