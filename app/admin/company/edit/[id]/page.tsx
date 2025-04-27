'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const UpdateCompanyPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    industry: '',
    address: '',
    contact: '',
    companyDescription: '',
    hrdContact: '',
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/company/${id}`);
        if (response.ok) {
          const data = await response.json();
          // Ensure data is not undefined or null, fallback to empty string if missing
          setFormData({
            industry: data.industry || '',
            address: data.address || '',
            contact: data.contact || '',
            companyDescription: data.companyDescription || '',
            hrdContact: data.hrdContact || '',
          });
        } else {
          console.error('Failed to fetch company data');
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
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
    const response = await fetch(`/api/admin/company/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const result = await response.json();
      alert('Company profile updated successfully');
      router.push('/admin/company');
    } else {
      const error = await response.json();
      console.error('Error updating company profile:', error);
    }
  };

  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-6">Update Company Data</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <input
                type="text"
                id="industry"
                className="w-full p-3 border border-gray-200 rounded-md"
                placeholder="Enter industry"
                value={formData.industry || ''}  
                onChange={(e) => handleInputChange(e, 'industry')}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                className="w-full p-3 border border-gray-200 rounded-md"
                placeholder="Enter company address"
                value={formData.address || ''}  
                onChange={(e) => handleInputChange(e, 'address')}
              />
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                Contact
              </label>
              <input
                type="text"
                id="contact"
                className="w-full p-3 border border-gray-200 rounded-md"
                placeholder="Enter contact number"
                value={formData.contact || ''}  
                onChange={(e) => handleInputChange(e, 'contact')}
              />
            </div>

            <div>
              <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Company Description
              </label>
              <input
                type="text"
                id="companyDescription"
                className="w-full p-3 border border-gray-200 rounded-md"
                placeholder="Enter company description"
                value={formData.companyDescription || ''} 
                onChange={(e) => handleInputChange(e, 'companyDescription')}
              />
            </div>

            <div>
              <label htmlFor="hrdContact" className="block text-sm font-medium text-gray-700 mb-1">
                HRD Contact
              </label>
              <input
                type="text"
                id="hrdContact"
                className="w-full p-3 border border-gray-200 rounded-md"
                placeholder="Enter HRD contact info"
                value={formData.hrdContact || ''} 
                onChange={(e) => handleInputChange(e, 'hrdContact')}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#0008f1] text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Company
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCompanyPage;
