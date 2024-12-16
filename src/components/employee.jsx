import React, { useState } from 'react';
import axios from 'axios';

const Frontend = () => {
  const [formData, setFormData] = useState({
    EmployeeID: '',
    Name: '',
    Email: '',
    PhoneNumber: '',
    Department: '',
    DateOfJoining: '',
    Role: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.EmployeeID || formData.EmployeeID.length > 10)
      newErrors.EmployeeID = 'Employee ID must be <= 10 characters';
    if (!formData.Email.includes('@')) newErrors.Email = 'Valid Email is required';
    if (formData.PhoneNumber.length !== 10)
      newErrors.PhoneNumber = 'Phone number must be 10 digits';
    if (!formData.Department) newErrors.Department = 'Department is required';
    if (!formData.DateOfJoining || new Date(formData.DateOfJoining) > new Date())
      newErrors.DateOfJoining = 'Date cannot be in the future';
    if (!formData.Role) newErrors.Role = 'Role is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const res = await axios.post('http://localhost:5000/employees', formData);
        setMessage(res.data.message);
        setErrors({});
        setFormData({
          EmployeeID: '',
          Name: '',
          Email: '',
          PhoneNumber: '',
          Department: '',
          DateOfJoining: '',
          Role: '',
        });
      } catch (err) {
        setMessage(err.response?.data?.message || 'Submission failed');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-bl from-gray-100 via-gray-200 to-gray-300 p-6">
      <div className="w-full max-w-lg bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-3xl p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6 tracking-wide">
          Add Employee
        </h1>
        {message && (
          <div
            className={`p-4 mb-6 text-center text-sm rounded-lg shadow-md ${
              message.includes('failed')
                ? 'bg-red-100 text-red-600 border border-red-300'
                : 'bg-green-100 text-green-600 border border-green-300'
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { id: 'EmployeeID', label: 'Employee ID' },
            { id: 'Name', label: 'Name' },
            { id: 'Email', label: 'Email' },
            { id: 'PhoneNumber', label: 'Phone Number' },
            { id: 'Department', label: 'Department' },
            { id: 'DateOfJoining', label: 'Date of Joining', type: 'date' },
            { id: 'Role', label: 'Role' },
          ].map(({ id, label, type = 'text' }) => (
            <div key={id} className="relative">
              <input
                id={id}
                type={type}
                placeholder=" "
                value={formData[id]}
                onChange={(e) =>
                  setFormData({ ...formData, [id]: e.target.value })
                }
                className={`peer w-full px-4 py-3 text-gray-900 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                  errors[id]
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-gray-300 focus:ring-blue-300'
                }`}
              />
              <label
                htmlFor={id}
                className="absolute text-gray-500 text-sm transition-all transform -translate-y-4 scale-90 top-2 left-4 bg-white px-1 peer-placeholder-shown:translate-y-3 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-90"
              >
                {label}
              </label>
              {errors[id] && (
                <p className="mt-1 text-xs text-red-500">{errors[id]}</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg transform transition-transform hover:scale-105"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Frontend;

