'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { alumniFields } from '@/constants/roles'; 

const UpdateAlumniPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    nim: '',
    phone: '',
    address: '',
    faculty: '',
    major: '',
    jobStatus: '',
    currentCompany: '',
    jobPosition: '',
    jobWaitTime: '',
    firstSalary: '',
    jobMatchWithMajor: null,
    curriculumFeedback: '',
    universityName: '',
    studyProgram: '',
    fundingSource: '',
    scholarshipSource: '',
    graduationYear: '',
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/alumni/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
          console.log(data);
        } else {
          console.error('Failed to fetch alumni data');
        }
      } catch (error) {
        console.error('Error fetching alumni data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const response = await fetch(`/api/admin/alumni/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const result = await response.json();
      alert('Alumni profile updated successfully:');
      router.push('/admin/alumni');
    } else {
      const error = await response.json();
      console.error('Error updating alumni profile:', error);
    }
  };

  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-6">Update Alumni Data</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {alumniFields.map((field, index) => {
              
              if (
                (field.condition && field.condition !== formData.jobStatus) ||
                (field.dependentCondition && field.dependentCondition !== formData.fundingSource)
              ) {
                return null;
              }

              const fieldName = field.fieldName as keyof typeof formData;

              return (
                <div key={index}>
                  <label htmlFor={field.fieldName} className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      id={field.fieldName}
                      className="w-full p-3 border border-gray-200 rounded-md"
                      value={formData[fieldName] || ''}
                      onChange={(e) => handleInputChange(e, fieldName)}
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
                      placeholder={formData[fieldName] || field.placeholder}
                      value={formData[fieldName] || ''}
                      onChange={(e) => handleInputChange(e, fieldName)}
                    />
                  )}
                </div>
              );
            })}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#0008f1] text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Alumni
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateAlumniPage;
