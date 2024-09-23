<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with('product', 'user')->get()->map(function ($review) {
            return $this->transformReview($review);
        });

        return response()->json($reviews);
    }

    public function show($id)
    {
        $review = Review::with('product', 'user')->findOrFail($id);
        return response()->json($this->transformReview($review));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'title' => 'required|string|max:255',
            'reviewer_name' => 'required|string|max:255',
            'review' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $userId = auth()->id();
        $validated['user_id'] = $userId;

        $review = Review::create($validated);
        $review->load(['product', 'user']); // Load relationships

        return response()->json($this->transformReview($review), 201);
    }

    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'reviewer_name' => 'sometimes|string|max:255',
            'review' => 'sometimes|string',
            'rating' => 'sometimes|integer|min:1|max:5',
        ]);

        $review->update(array_filter($validated)); // Only update the fields present in the request

        $review->load(['product', 'user']); // Load relationships

        return response()->json($this->transformReview($review));
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json(null, 204);
    }

    private function transformReview($review)
    {
        return [
            'id' => $review->id,
            'product_id' => $review->product_id,
            'user_id' => $review->user_id,
            'title' => $review->title,
            'reviewer_name' => $review->reviewer_name,
            'review' => $review->review,
            'rating' => $review->rating,
            'created_at' => $review->created_at,
            'updated_at' => $review->updated_at,
            'user_email' => $review->user->email,
        ];
    }
}
