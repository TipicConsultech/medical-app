import React, { useState, useEffect } from 'react';
import { getAPICall } from '../util/api.js';

const DoctorCards = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDoctors = async (page = 1) => {
    try {
      const response = await getAPICall(`/api/doctors?page=${page}`);
      if (response && response.doctors && Array.isArray(response.doctors.data)) {
        setDoctors(response.doctors.data);
        setFilteredDoctors(response.doctors.data);
        setCurrentPage(response.doctors.current_page);
        setTotalPages(response.doctors.last_page);
      } else {
        console.error('Invalid response structure:', response);
        setDoctors([]);
        setFilteredDoctors([]);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
      setFilteredDoctors([]);
    }
  };

  useEffect(() => {
    fetchDoctors(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      fetchDoctors(pageNumber);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(
        doctors.filter((doctor) =>
          doctor.speciality.toLowerCase().includes(event.target.value.toLowerCase()) ||
          doctor.clinic_name.toLowerCase().includes(event.target.value.toLowerCase())
        )
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Doctor List</h2>
        <input
          type="text"
          placeholder="Search by Speciality or Clinic Name"
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded-lg w-full max-w-md"
          style={{ marginTop: '10px' }}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-400 p-6 rounded-lg"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-2">{doctor.clinic_name}</h2>
              <div className="relative h-40 overflow-hidden bg-gray-50 flex justify-center items-center">
                {doctor.thumbnail ? (
                  <img
                    src={doctor.thumbnail}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
              </div>
              <div className="py-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">{doctor.name}</h2>
                <p className="text-sm text-gray-500 mb-2">Speciality: {doctor.speciality} MD</p>
                <p className="text-sm text-gray-500">Education: {doctor.education}</p>
                <p className="text-sm text-gray-500">Mobile: {doctor.mobile}</p>
                <p className="text-sm text-gray-500">Address: {doctor.address}</p>
                <p className="text-sm text-gray-500">Morning: {doctor.morning_time}</p>
                <p className="text-sm text-gray-500">Evening: {doctor.evening_time}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No doctors found.</p>
        )}
      </div>

      <div className="flex items-center justify-center mt-6 mb-10">
        <button
          className={`px-3 py-2 mx-1 rounded-md text-white ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-3 py-2 mx-1 rounded-md ${currentPage === page ? 'bg-blue-700 text-white font-bold' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className={`px-3 py-2 mx-1 rounded-md text-white ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default DoctorCards;