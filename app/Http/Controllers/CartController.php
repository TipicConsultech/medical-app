<?php

namespace App\Http\Controllers;

use App\Models\cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
{
    $customerId = $request->query('customer_id');

    if (!$customerId) {
        return response()->json(['message' => 'Customer ID is required'], 400);
    }

    $cartItems = Cart::with('product')
        ->where('customer_id', $customerId)
        ->get();

    return response()->json($cartItems);
}

    // Add new item to cart
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
        ]);

        $cartItem = Cart::create($request->only('customer_id', 'product_id', 'qty'));
        return response()->json([
            'message' => 'Item added to cart',
            'data' => $cartItem->load('product'),
        ], 201);
    }

    // Show specific cart item
    public function show($id)
    {
        $cartItem = Cart::with('product')->find($id);
        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        return response()->json($cartItem);
    }

    // Update cart item (quantity)
    public function update(Request $request, $id)
    {
        $request->validate([
            'qty' => 'required|integer|min:1',
        ]);

        $cartItem = Cart::find($id);
        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $cartItem->qty = $request->qty;
        $cartItem->save();

        return response()->json([
            'message' => 'Cart item updated',
            'data' => $cartItem->load('product'),
        ]);
    }

    // Delete cart item
    public function destroy($id)
    {
        $cartItem = Cart::find($id);
        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Cart item deleted']);
    }
}
