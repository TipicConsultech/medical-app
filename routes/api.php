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
use App\Http\Controllers\CustomerLogin;
use App\Http\Controllers\CartController;
use App\Http\Controllers\preOrderController;
use App\Http\Controllers\addressController;
Route::get('address/{customer_id}',[addressController::class,'getByCustomerId']);
Route::post('address',[addressController::class,'store']);
Route::post('newAddressPreorder',[preOrderController::class,'storeWithAddress']);
Route::get('getOrderById/{order_id}',[preOrderController::class,'getOrderById']);
Route::get('/orders/details/{order_id}',[preOrderController::class,'getOrderDetailsByOrderId']);
Route::get('/preorders/pending',[preOrderController::class,'getPendingOrders']);

Route::apiResource('cart', CartController::class);
Route::apiResource('preorder', preOrderController::class);
// Route::get('proceedToPay',[CartController::class,'hasScheduleH']);
Route::middleware('auth:sanctum')->get('/proceedToPay', [CartController::class, 'hasScheduleH']);

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

//customer login
Route::post('/customerLogin', [CustomerLogin::class, 'customerLogin']);

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
   