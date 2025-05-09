'use client';

import React, { useState } from 'react';
import { alumniFields } from '@/constants/roles';
import { redirect } from 'next/navigation';

const Page = () => {
  // Initialize formData with all required fields including fixed ones
  const initialFormData = {
    fullName: '',
    email: '',
    nim: '',
    phone: '',
    address: '',
    major: '',
    jobStatus: '',
    currentCompany: '',
    jobPosition: '',
    jobWaitTime: '',
    firstSalary: '',
    jobMatchWithMajor: '',
    curriculumFeedback: '',
    universityName: '',
    studyProgram: '',
    fundingSource: '',
    scholarshipSource: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  // Update formData state when user interacts with the form
  const handleInputChange = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send formData to backend API
    const response = await fetch('/api/admin/alumni', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
  
    if (response.ok) {
      const result = await response.json();
      setFormData(initialFormData);  
      alert('Alumni added successfully');
      redirect("/admin/alumni"); 
    } else {
      const error = await response.json();
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Alumni Data Form */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-6">Alumni Data</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fixed Fields for Full Name and Email */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                className="w-full p-3 border border-gray-200 rounded-md"
                placeholder="Masukkan nama lengkap"
                value={formData.fullName}
                onChange={(e) => handleInputChange(e, 'fullName')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-200 rounded-md"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={(e) => handleInputChange(e, 'email')}
              />
            </div>

            {/* Dynamic Fields from alumniFields */}
            {alumniFields.map((field, index) => {
              // Conditionally render fields based on `jobStatus` and `fundingSource`
              if (
                (field.condition && field.condition !== formData.jobStatus) ||
                (field.dependentCondition && field.dependentCondition !== formData.fundingSource)
              ) {
                return null; // Skip rendering if conditions are not met
              }

              return (
                <div key={index}>
                  <label htmlFor={field.fieldName} className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      id={field.fieldName}
                      className="w-full p-3 border border-gray-200 rounded-md"
                      value={formData[field.fieldName] || ''}
                      onChange={(e) => handleInputChange(e, field.fieldName)}
                    >
                      {field.options.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      id={field.fieldName}
                      className="w-full p-3 border border-gray-200 rounded-md"
                      placeholder={field.placeholder}
                      value={formData[field.fieldName] || ''}
                      onChange={(e) => handleInputChange(e, field.fieldName)}
                    />
                  )}
                </div>
              );
            })}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#0008f1] text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Add New Alumni
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
