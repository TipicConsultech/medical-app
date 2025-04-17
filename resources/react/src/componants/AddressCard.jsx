import React from 'react';

function AddressCard({ address ,submit }) {
    console.log(address);
    
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-4 border border-gray-200">
      <div className="text-sm text-gray-700 mb-1 font-semibold">{address.address_type.toUpperCase()}</div>

      <div className="text-base font-medium text-gray-900">
        {address.address_line1}
      </div>
      {address.address_line2 && (
        <div className="text-sm text-gray-600">{address.address_line2}</div>
      )}

      <div className="text-sm text-gray-600 mt-1">
        {address.landmark && <span>{address.landmark}, </span>}
        {address.city}, {address.state} - {address.postal_code}
      </div>

      <div className="text-sm text-gray-500">{address.country}</div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-400">
          Added on {new Date(address.created_at).toLocaleDateString()}
        </span>
        <button  onClick={submit} className="bg-blue-600 text-white text-sm px-3 py-1 rounded-lg shadow-sm hover:bg-blue-700">
          Deliver Here
        </button>
      </div>
    </div>
  );
}

export default AddressCard;
