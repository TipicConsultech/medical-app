<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class FileUpload extends Controller
{

  //File Upload Function
  public function fileUpload(Request $request){
    $request->validate([
        'file' => 'required|mimes:jpg,jpeg,png|max:2048',
        'dest' => 'required'
    ]);

    // Get file and destination folder
    $file = $request->file('file');
    $destinationPath = public_path('img/' . $request->input('dest'));

    //  Check if folder exists, if not, create it
    if (!file_exists($destinationPath)) {
        mkdir($destinationPath, 0777, true); // Creates directory with permissions
    }

    // Generate unique filename
    $filename = time() . '-' . $file->getClientOriginalName();
    $filePath = 'img/' . $request->input('dest') . '/' . $filename;

    //  Move file to destination folder
    $file->move($destinationPath, $filename);

    return response()->json([
        "success" => true,
        "message" => "Image Uploaded Successfully",
        "filePath" => asset($filePath) // Return public URL
    ]);
}



public function filesUpload(Request $request){
    $request->validate([
        'file.*' => 'required|mimes:jpg,jpeg,png|max:2048',
        'dest' => 'required|string'
    ]);

    $destinationPath = public_path('img/' . $request->input('dest'));

    //  Ensure folder exists
    if (!file_exists($destinationPath)) {
        mkdir($destinationPath, 0777, true);
    }

    $files = $request->file('file');
    $uploadedFiles = [];

    if (!is_array($files)) {
        $files = [$files]; // Convert single file to array
    }

    foreach ($files as $file) {
        $filename = time() . '-' . $file->getClientOriginalName();
        $filePath = 'img/' . $request->input('dest') . '/' . $filename;

        //  Check if move works
        if (!$file->move($destinationPath, $filename)) {
            return response()->json([
                "success" => false,
                "message" => "File move failed: " . $filename
            ], 500);
        }

        $uploadedFiles[] = asset($filePath);
    }

    return response()->json([
        "success" => true,
        "message" => "Images Uploaded Successfully",
        "files" => $uploadedFiles
    ]);
}



public function deleteFile(Request $request)
{
    $request->validate([
        'file_path' => 'required|string'
    ]);

    // Get file path from request
    $filePath = str_replace(url('/'), public_path(), $request->input('file_path'));

    // Check if file exists
    if (File::exists($filePath)) {
        File::delete($filePath);

        return response()->json([
            "success" => true,
            "message" => "File deleted successfully"
        ]);
    }

    return response()->json([
        "success" => false,
        "message" => "File not found"
    ], 404);
}



}


