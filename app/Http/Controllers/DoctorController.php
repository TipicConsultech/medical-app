<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class DoctorController extends Controller
{
    
    public function index()
    {
        $doctors = Doctor::paginate(10);

        return response()->json([
            'message' => 'Doctors retrieved successfully',
            'doctors' => $doctors
        ], Response::HTTP_OK);
    }

    
    public function show($id)
    {
        $doctor = Doctor::find($id);

        if (!$doctor) {
            return response()->json(['message' => 'Doctor not found'], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'doctor' => $doctor
        ], Response::HTTP_OK);
    }

    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'clinic_name' => 'required|string|max:255',
            'speciality' => 'required|string|max:255',
            'education' => 'required|string|max:255',
            'mobile' => 'required|string|max:15',
            'address' => 'required|string',
            'morning_time' => 'required|string',
            'evening_time' => 'required|string',
            'thumbnail' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], Response::HTTP_BAD_REQUEST);
        }

        // Handle thumbnail upload
        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');
            $filename = time() . '-' . $file->getClientOriginalName();
            $destinationPath = public_path('img/doctors');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }

            if ($file->move($destinationPath, $filename)) {
                $thumbnailPath = asset('img/doctors/' . $filename);
            }
        }

        // Create doctor record
        $doctor = Doctor::create(array_merge($validator->validated(), [
            'thumbnail' => $thumbnailPath
        ]));

        return response()->json([
            'message' => 'Doctor added successfully',
            'doctor' => $doctor
        ], Response::HTTP_CREATED);
    }

    // Update an existing doctor
    public function update(Request $request, $id)
    {
        $doctor = Doctor::find($id);
        if (!$doctor) {
            return response()->json(['message' => 'Doctor not found'], Response::HTTP_NOT_FOUND);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'clinic_name' => 'sometimes|string|max:255',
            'speciality' => 'sometimes|string|max:255',
            'education' => 'sometimes|string|max:255',
            'mobile' => 'sometimes|string|max:15',
            'address' => 'sometimes|string',
            'morning_time' => 'sometimes|string',
            'evening_time' => 'sometimes|string',
            'thumbnail' => 'sometimes|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], Response::HTTP_BAD_REQUEST);
        }

        // Handle new thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');
            $filename = time() . '-' . $file->getClientOriginalName();
            $destinationPath = public_path('img/doctors');

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0777, true);
            }

            // Delete old thumbnail if exists
            if ($doctor->thumbnail) {
                $oldImagePath = public_path(parse_url($doctor->thumbnail, PHP_URL_PATH));
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            if ($file->move($destinationPath, $filename)) {
                $thumbnailPath = asset('img/doctors/' . $filename);
                $doctor->thumbnail = $thumbnailPath;
            }
        }

        // Update doctor details
        $doctor->update($validator->validated());

        return response()->json([
            'message' => 'Doctor updated successfully',
            'doctor' => $doctor
        ], Response::HTTP_OK);
    }

    // Delete a doctor
    public function destroy($id)
    {
        $doctor = Doctor::find($id);
        if (!$doctor) {
            return response()->json(['message' => 'Doctor not found'], Response::HTTP_NOT_FOUND);
        }

        // Delete the thumbnail file
        if ($doctor->thumbnail) {
            $oldImagePath = public_path(parse_url($doctor->thumbnail, PHP_URL_PATH));
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }
        }

        $doctor->delete();

        return response()->json(['message' => 'Doctor deleted successfully'], Response::HTTP_OK);
    }

    // Search doctors by name, clinic, or speciality
    public function search(Request $request)
    {
        $query = $request->q;

        if (!$query) {
            return response()->json(['message' => 'Search query is required'], Response::HTTP_BAD_REQUEST);
        }

        $doctors = Doctor::where('name', 'LIKE', "%{$query}%")
            ->orWhere('clinic_name', 'LIKE', "%{$query}%")
            ->orWhere('speciality', 'LIKE', "%{$query}%")
            ->paginate(10);

        return response()->json($doctors);
    }
}

