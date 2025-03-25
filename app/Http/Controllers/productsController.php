<?php 
namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\productImages;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;


class ProductsController extends Controller
{
    // Get All Products
    public function index()
    {
        $products = Products::paginate(2);

        return response()->json([
            'message' => 'Products retrieved successfully',
            'products' => $products
        ], Response::HTTP_OK);
        
    }

    // Get Single Product by ID
    public function show($id)
{
    $product = Products::find($id);
    
    if (!$product) {
        return response()->json(['message' => 'Product not found'], Response::HTTP_NOT_FOUND);
    }

    // Fetch related images from product_images table
    $productImages = productImages::where('product_id', $id)->pluck('src')->toArray();

    return response()->json([
        'success' => true,
        'product' => [
            'id' => $product->id,
            'title' => $product->title,
            'description' => $product->description,
            'price' => $product->price,
            'discount_percentage' => $product->discount_percentage,
            'cutting_status' => $product->cutting_status,
            'manufacturer' => $product->manufacturer,
            'schedule_h' => $product->schedule_h,
            'generic' => $product->generic ?? false,
            'available' => $product->available,
            'weight' => $product->weight,
            'weight_type' => $product->weight_type,
            'qty' => $product->qty,
            'mg' => $product->mg,
            'thumbnail' => $product->thumbnail ?? asset('img/default-product.jpg'),
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
            'images' => $productImages, // Add product images array
        ]
    ], Response::HTTP_OK);
}

    // Store a New Product
   
 
    
    // public function store(Request $request)
    // {
    //     // Validate request
    //     $validatedData = $request->validate([
    //         'title' => 'required|string|max:255',
    //         'description' => 'nullable|string',
    //         'price' => 'required|numeric|min:0',
    //         'discount_percentage' => 'nullable|numeric|min:0|max:100',
    //         'cutting_status' => 'required|in:cut,uncut',
    //         'manufacturer' => 'required|string|max:255',
    //         'schedule_h' => 'required|boolean',
    //         'available' => 'required|boolean',
    //         'weight' => 'required|numeric|min:0',
    //         'weight_type' => 'required|in:gm,ml',
    //         'thumbnail' => 'nullable|string',
    //         'qty' => 'required|integer|min:0',
    //         'mg' => 'nullable|integer|min:0',
    //     ]);
    
    //     // Create product with validated data
    //     $product = Products::create($validatedData);
    
    //     return response()->json([
    //         'message' => 'Product created successfully',
    //         'product' => $product
    //     ],  Response::HTTP_CREATED);
    // }

    public function store(Request $request)
{
    // Validate request
    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric|min:0',
        'discount_percentage' => 'nullable|numeric|min:0|max:100',
        'cutting_status' => 'required|in:cut,uncut',
        'manufacturer' => 'required|string|max:255',
        'schedule_h' => 'required|boolean',
        'available' => 'required|boolean',
        'weight' => 'required|numeric|min:0',
        'weight_type' => 'required|in:gm,ml',
        'thumbnail' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        'qty' => 'required|integer|min:0',
        'mg' => 'nullable|integer|min:0',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors()
        ], Response::HTTP_BAD_REQUEST);
    }

    // Handle file upload for thumbnail
    $thumbnailPath = null;
    if ($request->hasFile('thumbnail')) {
        $file = $request->file('thumbnail');
        $filename = time() . '-' . $file->getClientOriginalName();
        $destinationPath = public_path('img/thumbnails');

        // Ensure directory exists
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0777, true);
        }

        if ($file->move($destinationPath, $filename)) {
            $thumbnailPath = asset('img/thumbnails/' . $filename);
        }
    }

    // Create product with validated data and thumbnail path
    $product = Products::create(array_merge($validator->validated(), [
        'thumbnail' => $thumbnailPath
    ]));

    return response()->json([
        'message' => 'Product created successfully',
        'product' => $product
    ], Response::HTTP_CREATED);
}
    
    // Update Product
    
public function update(Request $request, $id)
{
    $product = Products::find($id);
    if (!$product) {
        return response()->json(['message' => 'Product not found'], Response::HTTP_NOT_FOUND);
    }

    $validator = Validator::make($request->all(), [
        'title' => 'sometimes|string|max:255',
        'description' => 'nullable|string',
        'price' => 'sometimes|numeric|min:0',
        'discount_percentage' => 'nullable|numeric|min:0|max:100',
        'cutting_status' => 'sometimes|in:cut,uncut',
        'manufacturer' => 'nullable|string|max:255',
        'schedule_h' => 'sometimes|boolean',
        'available' => 'sometimes|boolean',
        'weight' => 'sometimes|numeric|min:0',
        'weight_type' => 'sometimes|in:kg,g,lb,oz',
        'qty' => 'sometimes|integer|min:0',
        'thumbnail' => 'sometimes|file|mimes:jpg,jpeg,png|max:2048',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors()
        ], Response::HTTP_BAD_REQUEST);
    }

    // Handle file upload for thumbnail
    if ($request->hasFile('thumbnail')) {
        $file = $request->file('thumbnail');
        $filename = time() . '-' . $file->getClientOriginalName();
        $destinationPath = public_path('img/thumbnails');

        // Ensure the directory exists
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0777, true);
        }

        // Delete old thumbnail if exists
        if ($product->thumbnail) {
            $oldImagePath = public_path(parse_url($product->thumbnail, PHP_URL_PATH));
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }
        }

        if ($file->move($destinationPath, $filename)) {
            $thumbnailPath = asset('img/thumbnails/' . $filename);
            $product->thumbnail = $thumbnailPath;
        }
    }

    // Update product details
    $product->update($validator->validated());

    return response()->json([
        'message' => 'Product updated successfully',
        'product' => $product
    ], Response::HTTP_OK);
}


    // Delete Product
    public function destroy($id)
    {
        $product = Products::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], Response::HTTP_OK);
    }

    public function search(Request $request)
    {
        $query = $request->q ;// Get search keyword
    
        if (!$query) {
            return response()->json(['message' => 'Search query is required'], 400);
        }
    
        $products = Products::where('title', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->paginate(10); // Add pagination
        

    
        return response()->json($products);
    }
}
