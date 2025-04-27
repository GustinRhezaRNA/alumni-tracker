'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

// Define initial form data structure
const initialFormData = {
  industry: '',
  address: '',
  contact: '',
  companyDescription: '',
  hrdContact: '',
};

const CompanyPage = () => {
  const [formData, setFormData] = useState(initialFormData);
  const router = useRouter();

  // Update formData state when the user interacts with the form
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
    const response = await fetch('/api/admin/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const result = await response.json();
      setFormData(initialFormData);  // Reset form data
      alert('Company added successfully');
      router.push("/admin/companies");  // Redirect to company list page
    } else {
      const error = await response.json();
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Company Data Form */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-6">Add New Company</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fixed Fields for Industry, Address, etc. */}
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <input
                type="text"
                id="industry"
                className="w-full p-3 border border-gray-200 rounded-md"
                placeholder="Enter industry"
                value={formData.industry}
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
                placeholder="Enter address"
                value={formData.address}
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
                placeholder="Enter contact information"
                value={formData.contact}
                onChange={(e) => handleInputChange(e, 'contact')}
              />
            </div>

            <div>
              <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Company Description
              </label>
              <textarea
                id="companyDescription"
                className="w-full p-3 border border-gray-200 rounded-md"
                placeholder="Enter company description"
                value={formData.companyDescription}
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
                placeholder="Enter HRD contact information"
                value={formData.hrdContact}
                onChange={(e) => handleInputChange(e, 'hrdContact')}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#0008f1] text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Company
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
