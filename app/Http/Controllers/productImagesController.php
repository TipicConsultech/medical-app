<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\productImages;
use Illuminate\Support\Facades\Validator;

class productImagesController extends Controller
{


public function productImageUpload(Request $request)
{
    $validator = Validator::make($request->all(), [
        'file.*' => 'required|mimes:jpg,jpeg,png|max:2048',
        'dest' => 'required|string',
        'product_id' => 'required|integer|exists:products,id'
    ]);

    if ($validator->fails()) {
        return response()->json([
            "success" => false,
            "message" => $validator->errors()
        ], 400);
    }

    $destinationPath = public_path('img/' . $request->input('dest'));

    // Ensure folder exists
    if (!file_exists($destinationPath)) {
        mkdir($destinationPath, 0777, true);
    }

    $files = $request->file('file');
    if (!is_array($files)) {
        $files = [$files]; // Convert single file to array
    }

    $uploadedFiles = [];
    foreach ($files as $file) {
        $filename = time() . '-' . $file->getClientOriginalName();
        $filePath = 'img/' . $request->input('dest') . '/' . $filename;

        // Move file to destination
        if ($file->move($destinationPath, $filename)) {
            $finalPath = asset($filePath);

            // Store in database
            productImages::create([
                'product_id' => $request->input('product_id'),
                'src' => $finalPath
            ]);

            $uploadedFiles[] = $finalPath;
        } else {
            return response()->json([
                "success" => false,
                "message" => "File move failed: " . $filename
            ], 500);
        }
    }

    return response()->json([
        "success" => true,
        "message" => "Images Uploaded and Stored Successfully"
    ]);
}

}
