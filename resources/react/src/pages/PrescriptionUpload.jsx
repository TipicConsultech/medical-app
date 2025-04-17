import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PrescriptionUpload() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  let schedule_h =true;
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
      setFile(file);
    }
  };
  const navigate=useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-lg font-semibold text-center mb-4">Upload  Prescription</h1>

      <label className="w-full max-w-sm flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-50">
        <svg className="w-8 h-8 text-amber-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16v1a2 2 0 002 2h1m10-6a4 4 0 11-8 0 4 4 0 018 0zm1 6h1a2 2 0 002-2v-1m-4 4H8" />
        </svg>
        <span className="text-sm text-gray-600">Tap to open front camera or upload file</span>
        <input
          type="file"
          accept="image/*,.pdf"
          capture="user" 
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {preview && (
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 text-center">Preview:</p>
          <img src={preview} alt="Preview" className="mt-2 max-h-64 rounded-lg border shadow" />
        </div>
      )}

{preview && (
  <button
    onClick={() =>
      navigate('/address', {
        state: {
          file,
          schedule_h
        },
      })
    }
    className="mt-5 py-2 px-7 rounded-lg border border-amber-950"
  >
    Next
  </button>
)}
    </div>
  );
}

export default PrescriptionUpload;
