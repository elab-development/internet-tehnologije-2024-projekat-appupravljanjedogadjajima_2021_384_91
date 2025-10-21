<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::all());
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Nemate dozvolu da dodajete kategorije.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:20',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Kategorija uspešno dodata!',
            'category' => $category,
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Nemate dozvolu da brišete kategorije.'], 403);
        }

        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Kategorija nije pronađena.'], 404);
        }

        $category->delete();
        return response()->json(['message' => 'Kategorija uspešno obrisana.']);
    }
}
