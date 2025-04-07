<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; 
use App\Http\Middleware\Authorization;
use App\Http\Controllers\FileUpload;
use App\Http\Controllers\CsvUploadController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\productImagesController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\CategoryController;

// Public APIs
Route::post('/register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('/mobileLogin', [AuthController::class, 'mobileLogin']);
Route::post('/upload-csv', [CsvUploadController::class, 'uploadCsv']);
//New Public API
Route::apiResource('products', ProductsController::class);
Route::post('/products/search', [ProductsController::class, 'search']);
//
Route::post('/fileUpload', [FileUpload::class, 'fileUpload']);
Route::post('/multiFileUpload', [FileUpload::class, 'filesUpload']);
Route::post('/deleteFile', [FileUpload::class, 'deleteFile']);
Route::post('/productImageUpload', [productImagesController::class, 'productImageUpload']);


// Doctors 
Route::apiResource('doctors', DoctorController::class);
Route::get('doctors/search', [DoctorController::class, 'search']);

//Category
Route::apiResource('categories', CategoryController::class);


// Secured APIs
Route::group(['middleware' => ['auth:sanctum']], function() {
    Route::post('/changePassword', [AuthController::class, 'changePassword']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/registerUser', [AuthController::class, 'registerUser']);
    Route::put('/appUsers', [AuthController::class, 'update']);
    Route::get('/appUsers', [AuthController::class, 'allUsers']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
     // Admin-specific routes can be added here 
});

Route::middleware(['auth:sanctum', 'role:user'])->group(function () {
    // User-specific routes can be added here
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
   