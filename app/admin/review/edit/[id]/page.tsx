'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

// Define constants for hard skills, soft skills, and productivity
export const HARD_SKILLS = {
  H1: "Keahlian Teknis",
  H2: "Kemampuan Problem Solving",
  H3: "Penguasaan Tools",
};

export const SOFT_SKILLS = {
  S1: "Komunikasi",
  S2: "Kerjasama",
  S3: "Disipilin",
  S4: "Kreativitas",
  S5: "Adaptasi",
};

export const PRODUCTIVITY = {
  P1: "Tepat waktu",
  P2: "Kualitas",
  P3: "Kemandirian",
};

const UpdateReviewPage = () => {
  const router = useRouter();
  const { id } = useParams();  // Get review ID from URL parameters

  // Initialize formData state with the correct types for hardSkills, softSkills, and productivity
  const [formData, setFormData] = useState({
    rating: '',
    reviewText: '',
    hardSkills: { H1: 1, H2: 1, H3: 1 },
    softSkills: { S1: 1, S2: 1, S3: 1, S4: 1, S5: 1 },
    productivity: { P1: 1, P2: 1, P3: 1 },
  });

  const [senderOptions, setSenderOptions] = useState([]);  // Options for "Review From" (Companies)
  const [receiverOptions, setReceiverOptions] = useState([]);  // Options for "Review For" (Alumni)
  const [selectedSender, setSelectedSender] = useState('');
  const [selectedReceiver, setSelectedReceiver] = useState('');

  useEffect(() => {
    if (!id) {
      return;
    }

    // Fetch review data by ID
    const fetchReviewData = async () => {
      try {
        const response = await fetch(`/api/admin/review/${id}`);
        const data = await response.json();
        setFormData({
          rating: data.reviews.rating,
          reviewText: data.reviews.reviewText,
          hardSkills: {
            H1: data.review_details.hardSkillsH1,
            H2: data.review_details.hardSkillsH2,
            H3: data.review_details.hardSkillsH3,
          },
          softSkills: {
            S1: data.review_details.softSkillsS1,
            S2: data.review_details.softSkillsS2,
            S3: data.review_details.softSkillsS3,
            S4: data.review_details.softSkillsS4,
            S5: data.review_details.softSkillsS5,
          },
          productivity: {
            P1: data.review_details.productivityP1,
            P2: data.review_details.productivityP2,
            P3: data.review_details.productivityP3,
          },
        });
        setSelectedSender(data.reviews.companyId);  // Company is the sender
        setSelectedReceiver(data.reviews.alumniId);  // Alumni is the receiver
      } catch (error) {
        console.error('Error fetching review data:', error);
      }
    };

    fetchReviewData();

    // Fetch sender and receiver options
    const fetchDropdownOptions = async () => {
      const response = await fetch('/api/admin/review/dropdown-options');
      if (response.ok) {
        const data = await response.json();
        setSenderOptions(data.filter((option) => option.type === 'company'));  // Companies as sender
        setReceiverOptions(data.filter((option) => option.type === 'alumni'));  // Alumni as receiver
      } else {
        console.error('Failed to fetch dropdown options');
      }
    };

    fetchDropdownOptions();
  }, [id]);

  const handleInputChange = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    });
  };

  const handleSelectChange = (e, fieldName) => {
    if (fieldName === 'sender') {
      setSelectedSender(e.target.value);
    } else {
      setSelectedReceiver(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/admin/review/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating: formData.rating,
        reviewText: formData.reviewText,
        hardSkills: formData.hardSkills,
        softSkills: formData.softSkills,
        productivity: formData.productivity,
        alumniId: selectedReceiver,  // Alumni as the receiver
        companyId: selectedSender,  // Company as the sender
      }),
    });

    if (response.ok) {
      const result = await response.json();
      alert('Review updated successfully');
      router.push('/admin/review');
    } else {
      const error = await response.json();
      console.error('Error updating review:', error);
    }
  };

  const renderSelect = (skillKey: string, label: string, value: number, onChange: (e: React.ChangeEvent<HTMLSelectElement>, key: string) => void) => (
    <div key={skillKey}>
      <label className="block font-medium mb-1 text-black">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e, skillKey)}
        className="p-2 rounded-lg border border-gray-300 w-full text-black"
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="p-10 bg-white rounded-2xl shadow-md w-full mx-auto text-black relative">
      <h1 className="text-2xl font-semibold text-center mb-6 text-black">Update Company Review</h1>

      {/* Sender Dropdown (Company) */}
      <div className="mb-6">
        <label className="block font-semibold mb-1 text-black">Review From</label>
        <select
          value={selectedSender}
          onChange={(e) => handleSelectChange(e, 'sender')}
          className="p-2 rounded-lg border border-gray-300 w-full text-black"
        >
          <option value="">Select Sender</option>
          {senderOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {/* Receiver Dropdown (Alumni) */}
      <div className="mb-6">
        <label className="block font-semibold mb-1 text-black">Review For</label>
        <select
          value={selectedReceiver}
          onChange={(e) => handleSelectChange(e, 'receiver')}
          className="p-2 rounded-lg border border-gray-300 w-full text-black"
        >
          <option value="">Select Receiver</option>
          {receiverOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {/* Hard Skills */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-black">Hard Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(HARD_SKILLS).map(([key, label]) =>
            renderSelect(key, label, formData.hardSkills[key], (e, k) => setFormData({
              ...formData,
              hardSkills: { ...formData.hardSkills, [k]: parseInt(e.target.value) }
            }))
          )}
        </div>
      </div>

      {/* Soft Skills */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-black">Soft Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(SOFT_SKILLS).map(([key, label]) =>
            renderSelect(key, label, formData.softSkills[key], (e, k) => setFormData({
              ...formData,
              softSkills: { ...formData.softSkills, [k]: parseInt(e.target.value) }
            }))
          )}
        </div>
      </div>

      {/* Productivity */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-black">Productivity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(PRODUCTIVITY).map(([key, label]) =>
            renderSelect(key, label, formData.productivity[key], (e, k) => setFormData({
              ...formData,
              productivity: { ...formData.productivity, [k]: parseInt(e.target.value) }
            }))
          )}
        </div>
      </div>

      {/* Review Text */}
      <div className="mb-6">
        <label className="block font-semibold mb-1 text-black">Review for Alumni</label>
        <textarea
          value={formData.reviewText}
          onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
          rows={4}
          placeholder="Write your review here..."
          className="w-full p-3 border rounded-lg text-black"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl mt-6"
        //   disabled={isSubmitting || submitted}
        >
          {/* {submitted ? 'Review Submitted' : isSubmitting ? 'Submitting...' : 'Submit Review'} */}
          Submit
        </button>
      </div>
    </div>
  );
};

export default UpdateReviewPage;
