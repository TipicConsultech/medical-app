import React, { useState } from 'react';
import { postFormData } from '../util/api';
import { useNavigate } from 'react-router-dom';

function AddressForm({ customerId,file,schedule }) {
  const [formData, setFormData] = useState({
    customer_id: customerId,
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    landmark: '',
    address_type: 'home',
  });
const navigate=useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNewAddess =async (e) =>{
    e.preventDefault();
    setLoading(true);
    setMsg('');
    const data = new FormData();
    // Append all formData fields
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    // Append additional fields manually
    data.append('prescription', file);        // assuming you have a `file` object
    data.append('schedule_h', schedule); 
    console.log(data);
    try{
        const res=await postFormData(`/api/newAddressPreorder`,data);
        if(res){
            navigate('/')
        }
    }
    catch(e){
console.log(e);

    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleNewAddess}
      className="w-full max-w-sm mx-auto p-5 bg-white shadow-md rounded-2xl space-y-4 mt-6"
    >
      <h1 className="text-center text-lg font-bold text-gray-700">
        📍 Add Delivery Address
      </h1>

      {[
        { name: 'address_line1', placeholder: 'Flat / House / Building *' },
        { name: 'address_line2', placeholder: 'Street / Area / Colony' },
        { name: 'landmark', placeholder: 'Landmark (optional)' },
        { name: 'city', placeholder: 'City *' },
        { name: 'state', placeholder: 'State *' },
        { name: 'postal_code', placeholder: 'Postal Code *' },
        { name: 'country', placeholder: 'Country *' },
        // { name: 'latitude', placeholder: 'Latitude (optional)' },
        // { name: 'longitude', placeholder: 'Longitude (optional)' },
      ].map(({ name, placeholder }) => (
        <input
          key={name}
          type="text"
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-600"
          required={placeholder.includes('*')}
        />
      ))}

      <select
        name="address_type"
        value={formData.address_type}
        onChange={handleChange}
        className="w-full px-4 py-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-600"
      >
        <option value="home">🏠 Home</option>
        <option value="office">🏢 Office</option>
      </select>

      {msg && <p className="text-center text-sm text-amber-700">{msg}</p>}

      <button
        type="submit"
        className="w-full bg-amber-600 text-white text-sm py-3 rounded-xl font-semibold tracking-wide hover:bg-amber-700"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Address and Order'}
      </button>
    </form>
  );
}

export default AddressForm;
