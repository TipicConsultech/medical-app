<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::all(), 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|string|max:255'
        ]);

        $category = Category::create(['category' => $request->category]);

        return response()->json($category, 201);
    }

    public function show($id)
    {
        $category = Category::find($id);
        if (!$category) return response()->json(['error' => 'Not Found'], 404);

        return response()->json($category, 200);
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) return response()->json(['error' => 'Not Found'], 404);

        $request->validate([
            'category' => 'required|string|max:255'
        ]);

        $category->update(['category' => $request->category]);

        return response()->json($category, 200);
    }

    public function destroy($id)
    {
        $category = Category::find($id);
        if (!$category) return response()->json(['error' => 'Not Found'], 404);

        $category->delete();

        return response()->json(['message' => 'Deleted'], 200);
    }
}
