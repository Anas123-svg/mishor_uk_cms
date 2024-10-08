<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;

use App\Models\Product;
use App\Models\Category; 
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $minPrice = $request->query('min_price');
        $maxPrice = $request->query('max_price');
    
        $query = Product::with('images', 'reviews.user', 'category');
    
        if ($minPrice !== null) {
            $query->where(function ($q) use ($minPrice) {
                $q->where('discounted_price', '>=', $minPrice)
                    ->orWhere(function ($q) use ($minPrice) {
                        $q->whereNull('discounted_price')
                          ->where('price', '>=', $minPrice);
                    });
            });
        }
    
        if ($maxPrice !== null) {
            $query->where(function ($q) use ($maxPrice) {
                $q->where('discounted_price', '<=', $maxPrice)
                    ->orWhere(function ($q) use ($maxPrice) {
                        $q->whereNull('discounted_price')
                          ->where('price', '<=', $maxPrice);
                    });
            });
        }
    
        $priceRangeQuery = clone $query;
    
        $priceStats = $priceRangeQuery->selectRaw('
            MIN(COALESCE(discounted_price, price)) as min_price,
            MAX(COALESCE(discounted_price, price)) as max_price
        ')->first();
    
    
        $products = $query->paginate(12);
    
        $transformedProducts = $products->getCollection()->map(function ($product) {
            return $this->transformProduct($product);
        });
    
        return response()->json([
            'products' => $transformedProducts,
            'currentPage' => $products->currentPage(),
            'lastPage' => $products->lastPage(),
            'perPage' => $products->perPage(),
            'total' => $products->total(),
            'minPrice' => $minPrice !== null ? $minPrice : $priceStats->min_price,
            'maxPrice' => $maxPrice !== null ? $maxPrice : $priceStats->max_price,
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

    public function getProductsByCategory(Request $request)
    {
        $categoryName = $request->query('category_name');
    
        if (!$categoryName) {
            return response()->json(['message' => 'Category name is required'], 400);
        }
    
        $category = Category::where('name', '=', $categoryName)->first();
    
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
    
      
        $productQuery = Product::where('category_id', $category->id)
            ->with('images', 'reviews.user');
    

        $minPrice = $request->query('min_price');
        $maxPrice = $request->query('max_price');
    
        if ($minPrice !== null) {
            $productQuery->where(function ($q) use ($minPrice) {
                $q->where('discounted_price', '>=', $minPrice)
                    ->orWhere(function ($q) use ($minPrice) {
                        $q->whereNull('discounted_price')
                          ->where('price', '>=', $minPrice);
                    });
            });
        }
    
        if ($maxPrice !== null) {
            $productQuery->where(function ($q) use ($maxPrice) {
                $q->where('discounted_price', '<=', $maxPrice)
                    ->orWhere(function ($q) use ($maxPrice) {
                        $q->whereNull('discounted_price')
                          ->where('price', '<=', $maxPrice);
                    });
            });
        }
    
        $products = $productQuery->paginate(12);
    
        $priceRangeQuery = Product::where('category_id', $category->id);
        
        $priceStats = $priceRangeQuery->selectRaw('
            MIN(COALESCE(discounted_price, price)) as min_price,
            MAX(COALESCE(discounted_price, price)) as max_price
        ')->first();
    
        $transformedProducts = $products->getCollection()->map(function ($product) {
            return $this->transformProduct($product);
        });
    
        return response()->json([
            'products' => $transformedProducts,
            'currentPage' => $products->currentPage(),
            'lastPage' => $products->lastPage(),
            'perPage' => $products->perPage(),
            'total' => $products->total(),
            'minPrice' => $minPrice !== null ? $minPrice : $priceStats->min_price,
            'maxPrice' => $maxPrice !== null ? $maxPrice : $priceStats->max_price,
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