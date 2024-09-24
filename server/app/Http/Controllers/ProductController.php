<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category; 
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('images', 'reviews.user', 'category')
            ->paginate(12);
    
   
        $transformedProducts = $products->getCollection()->map(function ($product) {
            return $this->transformProduct($product);
        });
    
        return response()->json([
            'products' => $transformedProducts,
            'currentPage' => $products->currentPage(),
            'lastPage' => $products->lastPage(),
            'perPage' => $products->perPage(),
            'total' => $products->total(),
        ]);
    }
    
    public function show($id)
    {
        $product = Product::with('images', 'reviews.user', 'category')->findOrFail($id);
        return response()->json($this->transformProduct($product));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'discounted_price' => 'nullable|numeric',
            'in_stock' => 'required|boolean',
            'in_stock_quantity' => 'required|integer|min:0',
            'category_id' => 'nullable|exists:categories,id', 
            'images' => 'nullable|array',
            'images.*' => 'nullable|string',
        ]);

        $product = Product::create($validated);

        if ($request->has('images')) {
            foreach ($request->images as $imageName) {
                $product->images()->create(['image_path' => $imageName]);
            }
        }

        $product = $product->fresh(['images', 'reviews.user', 'category']);

        return response()->json($this->transformProduct($product), 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'discounted_price' => 'sometimes|numeric',
            'in_stock' => 'sometimes|boolean',
            'in_stock_quantity' => 'sometimes|integer|min:0',
            'category_id' => 'sometimes|exists:categories,id', 
            'images' => 'sometimes|array',
            'images.*' => 'sometimes|string',
        ]);

        $product->update($validated);

        if ($request->has('images')) {
            $product->images()->delete();
            foreach ($request->images as $imageName) {
                $product->images()->create(['image_path' => $imageName]);
            }
        }

        $product = $product->fresh(['images', 'reviews.user', 'category']);

        return response()->json($this->transformProduct($product));
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->images()->delete();
        $product->delete();

        return response()->json(null, 204);
    }

    public function getProductsByCategory($categoryId)
    {
        $category = Category::findOrFail($categoryId);
        $products = $category->products()->with('images', 'reviews.user')
            ->paginate(12);
    
        $transformedProducts = $products->getCollection()->map(function ($product) {
            return $this->transformProduct($product);
        });
    
        return response()->json([
            'products' => $transformedProducts,
            'currentPage' => $products->currentPage(),
            'lastPage' => $products->lastPage(),
            'perPage' => $products->perPage(),
            'total' => $products->total(),
        ]);
    }
    
    private function transformProduct($product)
    {
        return [
            'id' => $product->id,
            'title' => $product->title,
            'description' => $product->description,
            'price' => $product->price,
            'discountedPrice' => $product->discounted_price,
            'inStock' => $product->in_stock,
            'inStockQuantity' => $product->in_stock_quantity,
            'category' => optional($product->category)->name,
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
            'images' => $product->images->pluck('image_path'),
            'reviews' => $product->reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'productId' => $review->product_id,
                    'title'=> $review->title,
                    'reviewerName' => $review->reviewer_name,
                    'review' => $review->review,
                    'rating' => $review->rating,
                    'createdAt' => $review->created_at,
                    'updatedAt' => $review->updated_at,
                    'userEmail' => $review->user->email,
                ];
            }),
        ];
    }



    /**
     * Get the count of all products in the database.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProductCount()
    {
        $productCount = Product::count();
        return response()->json(['count' => $productCount]);
    }


    public function search(Request $request)
{
    $searchTerm = $request->input('query');

    $products = Product::where('title', 'LIKE', '%' . $searchTerm . '%')
        ->orWhere('description', 'LIKE', '%' . $searchTerm . '%')
        ->with('images', 'reviews.user', 'category')
        ->paginate(12); 

    $transformedProducts = $products->getCollection()->map(function ($product) {
        return $this->transformProduct($product);
    });

    return response()->json([
        'products' => $transformedProducts,
        'currentPage' => $products->currentPage(),
        'lastPage' => $products->lastPage(),
        'perPage' => $products->perPage(),
        'total' => $products->total(),
    ]);
}

}

