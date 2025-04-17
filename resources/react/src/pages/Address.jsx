import React, { useEffect, useState } from 'react';
import { getAPICall, post, postFormData } from '../util/api';
import { getUser } from '../util/session';
import { useLocation, useNavigate } from 'react-router-dom';
import AddressCard from '../componants/AddressCard';
import AddressForm from '../componants/AddressForm ';

function Address() {
  const [selectedOption, setSelectedOption] = useState('existing');
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [finalAddress, setFinalAddress] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
console.log(finalAddress);


const navigate=useNavigate();
  const location = useLocation();
  const { file, schedule_h } = location.state || {};
//   const shouldRender = file || schedule_h;
  useEffect(() => {
    if (file) {
      console.log('Received file:', file);
    }
    if (schedule_h) {
      console.log('Received schedule:', schedule_h);
    }
  }, [file, schedule_h]);

  const user = getUser();

  

//   useEffect(() => {
//     const u = getUser();
//     setUser(u);
//   }, []);

  useEffect(() => {
async function addFetch(){
    if (selectedOption === 'existing') {
        try{
            const res=await getAPICall(`/api/address/${user.id}`)
    
            if (Array.isArray(res.data)) {
              setAddresses(res.data);
            } else {
              setAddresses([]);
            }
      
        }
        catch(e){
            err => console.error(e)
        };
    }
}
addFetch();
   
  }, [selectedOption]);
  

  const handleDropdownChange = (e) => {
    const selectedId = e.target.value;
    setSelectedAddressId(selectedId)
    const addressObj = addresses.find(addr => addr.id.toString() === selectedId);
    if (addressObj) {
      setSelectedAddress(selectedId);
      setFinalAddress(addressObj);
    } else {
      setSelectedAddress('');
      setFinalAddress([]);
    }
  };

 
  const handleSubmit = async () => {
    if (user.id ===0 || selectedAddressId ===0) {
      console.error('User or address is missing');
      return;
    }
  
    // const fd = new FormData();
    // fd.append('customer_id', user.id);
    // fd.append('schedule_h', false); // or use actual boolean logic
    // fd.append('payment_type', 0);
    // fd.append('prescription',file? file:null );
    // fd.append('address_id', selectedAddressId);

    const data={'customer_id':user.id,
     'schedule_h':0,
     'payment_type':0,
     'address_id':selectedAddressId,
     'prescription':null
    }
  
    try {
      const response = await post('/api/preorder', data);
      console.log('Submitted successfully', response);
      if(response.success==true){
        navigate('/')
      }
    } catch (e) {
      console.error('Submission failed', e);
    }
  };
  

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-lg font-semibold mb-4">Select Address</h2>

      <div className="flex items-center mb-4">
        <input
          type="radio"
          name="addressType"
          value="existing"
          checked={selectedOption === 'existing'}
          onChange={() => setSelectedOption('existing')}
          className="mr-2"
        />
        <label>Existing Address</label>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="radio"
          name="addressType"
          value="new"
          checked={selectedOption === 'new'}
          onChange={() => setSelectedOption('new')}
          className="mr-2"
        />
        <label>New Address</label>
      </div>

      {selectedOption === 'existing' && (
        <select
          className="w-full p-2 border rounded mb-4"
          value={selectedAddress}
          onChange={handleDropdownChange}
        >
          <option value="">Select an address</option>
          {addresses.map((addr, index) => (
            <option key={index} value={addr.id}>
              {addr.address_line1},{addr.city},{addr.state},{addr.postal_code}
            </option>
          ))}
        </select>
      )}

      {/* {selectedOption === 'new' && (
        <div>
          <input
            type="text"
            placeholder="Enter new address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Submit
          </button>
        </div>
      )} */}

      {finalAddress !== null && selectedOption === "existing"  && (
       <AddressCard address={finalAddress} submit={handleSubmit}/>
      )}
      {
        selectedOption === 'new' && ( <AddressForm customerId={user?.id} file={file} schedule={schedule_h}/>)
      }

      {/* {finalAddress !== null && selectedOption === "new"  &&(
        <div className='flex justify-center'>
        <button className='border rounded-xl mt-4 px-5 py-2' onClick={handleSubmit}>Submit</button>
        </div>
      )} */}
    </div>
  );
}

export default Address;
