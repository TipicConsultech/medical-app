<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class addressController extends Controller
{
    // Get all addresses
    public function index()
    {
        $addresses = Address::all();
        return response()->json($addresses, Response::HTTP_OK);
    }

    // Get addresses by customer_id
    public function getByCustomerId($customer_id)
    {
        $addresses = Address::where('customer_id', $customer_id)->get()->toArray();
    
        return response()->json([
            'success' => true,
            'data' => $addresses
        ], Response::HTTP_OK);
    }

    // Store new address (no validator)
  public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'customer_id'    => 'required|exists:users,id',
        'address_line1'  => 'required|string|max:255',
        'address_line2'  => 'nullable|string|max:255',
        'city'           => 'required|string|max:100',
        'state'          => 'required|string|max:100',
        'postal_code'    => 'required|string|max:20',
        'country'        => 'required|string|max:100',
        'landmark'       => 'nullable|string|max:255',
        'latitude'       => 'nullable|numeric',
        'longitude'      => 'nullable|numeric',
        'address_type'     => 'string',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors()
        ], 422);
    }

    $address = Address::create($request->all());

    return response()->json([
        'success' => true,
        'message' => 'Address created successfully',
        'data' => $address
    ], 201);
}
}
