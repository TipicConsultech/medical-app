<?php

namespace App\Http\Controllers;
use App\Models\PreOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Address;
use App\Models\OrderItems;
use App\Models\Cart;
use Illuminate\Support\Facades\DB;
use App\Models\Product;


class preOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
     
     
    //  public function storeWithAddress(Request $request)
    //  {
    //      // Validate the incoming request
    //      $validator = Validator::make($request->all(), [
    //          'prescription'    => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
    //          'schedule_h'      => 'required|in:true,false,1,0,"1","0"',
    //          'customer_id'     => 'required|exists:users,id',
    //          'address_line1'   => 'required|string|max:255',
    //          'address_line2'   => 'nullable|string|max:255',
    //          'city'            => 'required|string|max:100',
    //          'state'           => 'required|string|max:100',
    //          'postal_code'     => 'required|string|max:20',
    //          'country'         => 'required|string|max:100',
    //          'landmark'        => 'nullable|string|max:255',
    //          'latitude'        => 'nullable|numeric',
    //          'longitude'       => 'nullable|numeric',
    //          'address_type'    => 'string',
    //          'status'          => 'nullable',
    //      ]);
     
    //      if ($validator->fails()) {
    //          return response()->json([
    //              'success' => false,
    //              'message' => $validator->errors()
    //          ], 422);
    //      }
     
    //      try {
    //          DB::beginTransaction();
     
    //          // Create the address
    //          $address = Address::create([
    //              'customer_id'   => $request->customer_id,
    //              'address_line1' => $request->address_line1,
    //              'address_line2' => $request->address_line2,
    //              'city'          => $request->city,
    //              'state'         => $request->state,
    //              'postal_code'   => $request->postal_code,
    //              'country'       => $request->country,
    //              'landmark'      => $request->landmark,
    //              'latitude'      => $request->latitude,
    //              'longitude'     => $request->longitude,
    //              'address_type'  => $request->address_type ?? 'home',
    //              'status'        => $request->status
    //          ]);
     
    //          // Handle prescription upload
    //          $prescriptionPath = null;
    //          if ($request->hasFile('prescription')) {
    //              $file = $request->file('prescription');
    //              $filename = time() . '-' . $file->getClientOriginalName();
    //              $destinationPath = public_path('uploads/prescriptions');
     
    //              if (!file_exists($destinationPath)) {
    //                  mkdir($destinationPath, 0777, true);
    //              }
     
    //              if ($file->move($destinationPath, $filename)) {
    //                  $prescriptionPath = asset('uploads/prescriptions/' . $filename);
    //              }
    //          }
     
    //          // Create the PreOrder
    //          $preOrder = PreOrder::create([
    //              'customer_id'       => $request->customer_id,
    //              'prescription_path' => $prescriptionPath,
    //              'schedule_h'        => $request->boolean('schedule_h'),
    //              'address_id'        => $address->id,
    //          ]);
     
    //          DB::commit();
     
    //          return response()->json([
    //              'success' => true,
    //              'message' => 'Pre-order created successfully',
    //              'pre_order' => $preOrder
    //          ], 201);
    //      } catch (\Exception $e) {
    //          DB::rollBack();
     
    //          return response()->json([
    //              'success' => false,
    //              'message' => 'Something went wrong.',
    //              'error' => $e->getMessage()
    //          ], 500);
    //      }
    //  }


public function storeWithAddress(Request $request) 
{
    $validator = Validator::make($request->all(), [
        'prescription'    => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        'schedule_h'      => 'required|in:true,false,1,0,"1","0"',
        'customer_id'     => 'required|exists:users,id',
        'address_line1'   => 'required|string|max:255',
        'address_line2'   => 'nullable|string|max:255',
        'city'            => 'required|string|max:100',
        'state'           => 'required|string|max:100',
        'postal_code'     => 'required|string|max:20',
        'country'         => 'required|string|max:100',
        'landmark'        => 'nullable|string|max:255',
        'latitude'        => 'nullable|numeric',
        'longitude'       => 'nullable|numeric',
        'address_type'    => 'string',
        'status'          => 'nullable',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors()
        ], 422);
    }

    try {
        DB::beginTransaction();

        $address = Address::create([
            'customer_id'   => $request->customer_id,
            'address_line1' => $request->address_line1,
            'address_line2' => $request->address_line2,
            'city'          => $request->city,
            'state'         => $request->state,
            'postal_code'   => $request->postal_code,
            'country'       => $request->country,
            'landmark'      => $request->landmark,
            'latitude'      => $request->latitude,
            'longitude'     => $request->longitude,
            'address_type'  => $request->address_type ?? 'home',
            'status'        => $request->status
        ]);

        $prescriptionPath = null;
        if ($request->hasFile('prescription')) {
            $file = $request->file('prescription');
            $filename = time() . '-' . $file->getClientOriginalName();
            $destinationPath = public_path('uploads/prescriptions');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }
            if ($file->move($destinationPath, $filename)) {
                $prescriptionPath = asset('uploads/prescriptions/' . $filename);
            }
        }

        $preOrder = PreOrder::create([
            'customer_id'       => $request->customer_id,
            'prescription_path' => $prescriptionPath,
            'schedule_h'        => $request->boolean('schedule_h'),
            'address_id'        => $address->id,
        ]);

        // ✅ Move cart data to order_items
        $cartItems = Cart::where('customer_id', $request->customer_id)->get();

        foreach ($cartItems as $item) {
            OrderItems::create([
                'customer_id' => $item->customer_id,
                'product_id'  => $item->product_id,
                'qty'         => $item->qty,
                'order_id'    => $preOrder->id,
                'status'      => 0,
            ]);
        }

        // Optionally clear cart
        Cart::where('customer_id', $request->customer_id)->delete();

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Pre-order created successfully',
            'pre_order' => $preOrder
        ], 201);
    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'success' => false,
            'message' => 'Something went wrong.',
            'error' => $e->getMessage()
        ], 500);
    }
}

     

// public function store(Request $request)
// {
//     // Validate the incoming request
//     $validator = Validator::make($request->all(), [
//         'customer_id'   => 'required|integer',
//         'prescription'  => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
//         'schedule_h'    => 'required|in:true,false,1,0,"1","0"',
//         'payment_type'  => 'required|numeric|min:0',
//         'address_id'    => 'required|exists:address,id',
//         'status'    => 'nullable|numeric|min:0',
//     ]);
//     // Return validation errors if any
//     if ($validator->fails()) {
//         return response()->json([
//             'success' => false,
//             'message' => $validator->errors()
//         ], 422);
//     }

//     // Initialize prescription path
//     $prescriptionPath = null;

//     // Handle file upload if present
//     if ($request->hasFile('prescription')) {
//         $file = $request->file('prescription');
//         $filename = time() . '-' . $file->getClientOriginalName();
//         $destinationPath = public_path('uploads/prescriptions');

//         // Create the directory if it doesn't exist
//         if (!file_exists($destinationPath)) {
//             mkdir($destinationPath, 0777, true);
//         }

//         // Move the file to the destination path
//         if ($file->move($destinationPath, $filename)) {
//             $prescriptionPath = asset('uploads/prescriptions/' . $filename);
//         }
//     }

//     // Create the PreOrder record
//     $preOrder = PreOrder::create([
//         'customer_id' => $request->input('customer_id'),
//         'prescription_path' => $prescriptionPath,
//         'schedule_h' => $request->boolean('schedule_h'),
//         'payment_type' => $request->input('payment_type'),
//         'address_id' => $request->input('address_id'),
//     ]);

//     // Return success response
//     return response()->json([
//         'success' => true,
//         'message' => 'Pre-order created successfully',
//         'pre_order' => $preOrder
//     ], 201);
// }

public function store(Request $request)
{
    // Validate the incoming request
    $validator = Validator::make($request->all(), [
        'customer_id'   => 'required|integer',
        'prescription'  => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        'schedule_h'    => 'required|in:true,false,1,0,"1","0"',
        'payment_type'  => 'required|numeric|min:0',
        'address_id'    => 'required|exists:address,id',
        'status'        => 'nullable|numeric|min:0',
    ]);

    // Return validation errors if any
    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors()
        ], 422);
    }

    DB::beginTransaction();

    try {
        // Initialize prescription path
        $prescriptionPath = null;

        // Handle file upload if present
        if ($request->hasFile('prescription')) {
            $file = $request->file('prescription');
            $filename = time() . '-' . $file->getClientOriginalName();
            $destinationPath = public_path('uploads/prescriptions');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }

            if ($file->move($destinationPath, $filename)) {
                $prescriptionPath = asset('uploads/prescriptions/' . $filename);
            }
        }

        // Create the PreOrder record
        $preOrder = PreOrder::create([
            'customer_id'      => $request->input('customer_id'),
            'prescription_path'=> $prescriptionPath,
            'schedule_h'       => $request->boolean('schedule_h'),
            'payment_type'     => $request->input('payment_type'),
            'address_id'       => $request->input('address_id'),
            'status'           => $request->input('status', 0), // Default to 0 if not provided
        ]);

        // Move items from Cart to OrderItems
        $cartItems = Cart::where('customer_id', $request->input('customer_id'))->get();

        foreach ($cartItems as $item) {
            OrderItems::create([
                'customer_id' => $item->customer_id,
                'product_id'  => $item->product_id,
                'qty'         => $item->qty,
                'order_id'    => $preOrder->id,
                'status'      => 0,
            ]);
          
        }

        // Optionally clear the cart after transfer
        Cart::where('customer_id', $request->input('customer_id'))->delete();

        DB::commit();

        return response()->json([
            'success'    => true,
            'message'    => 'Pre-order created and items moved to order_items',
            'pre_order'  => $preOrder
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'success' => false,
            'message' => 'Something went wrong.',
            'error'   => $e->getMessage()
        ], 500);
    }
}


public function getOrderDetailsByOrderId($order_id)
{
    $orderItems = OrderItems::with(['customer', 'product', 'order'])
        ->where('order_id', $order_id)
        ->get();

    if ($orderItems->isEmpty()) {
        return response()->json([
            'message' => 'No order items found for this order ID.'
        ], 404);
    }

    return response()->json([
        'data' => $orderItems
    ], 200);
}

    /**
     * Display the specified resource.
     */
    public function show(PreOrder $preOrder)
    {
        //
    }

    public function getPendingOrders()
    {
        $orders = PreOrder::with(['customer', 'address']) // eager load related models
                        ->where('status', 0)
                        ->get();
    
        return response()->json([
            'data' => $orders
        ], 200); // 200 is more appropriate for a successful GET
    }
    

public function getOrderById($order_id)
{
    

    $order = PreOrder::find($order_id);

    return response()->json([
        'data' => $order
    ], 200);
}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PreOrder $preOrder)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PreOrder $preOrder)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PreOrder $preOrder)
    {
        //
    }
}
