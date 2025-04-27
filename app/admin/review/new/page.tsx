'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { HARD_SKILLS, SOFT_SKILLS, PRODUCTIVITY } from '@/constants/review';
import { useRouter } from 'next/navigation';

const AddCompanyReviewPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [senderOptions, setSenderOptions] = useState([]);
  const [receiverOptions, setReceiverOptions] = useState([]);
  const [selectedSender, setSelectedSender] = useState('');
  const [selectedReceiver, setSelectedReceiver] = useState('');
  const [hardSkills, setHardSkills] = useState({ H1: 1, H2: 1, H3: 1 });
  const [softSkills, setSoftSkills] = useState({ S1: 1, S2: 1, S3: 1, S4: 1, S5: 1 });
  const [productivity, setProductivity] = useState({ P1: 1, P2: 1, P3: 1 });
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/admin/review/dropdown-options');
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSenderOptions(data.filter((option) => option.type === 'company')); // Company sends review
        setReceiverOptions(data.filter((option) => option.type === 'alumni')); // Alumni receives review
      } else {
        console.error('Failed to fetch dropdown options');
      }
    };
    fetchData();
  }, [session]);

  const submitReview = async () => {
    if (!selectedSender || !selectedReceiver) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: selectedSender, // Sender: Company
          alumniId: selectedReceiver, // Receiver: Alumni
          reviewText,
          hardSkills,
          softSkills,
          productivity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setSubmitted(true);
      alert('Review submitted successfully!');
      router.push('/admin/review');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const renderSelect = (
    skillKey: string,
    label: string,
    value: number,
    onChange: (e: React.ChangeEvent<HTMLSelectElement>, key: string) => void
  ) => (
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
      <h1 className="text-2xl font-semibold text-center mb-6 text-black">Company Rating Form</h1>

      {/* Receiver Dropdown - Review For */}
      <div className="mb-6">
        <label className="block font-semibold mb-1 text-black">Review For</label>
        <select
          value={selectedReceiver}
          onChange={(e) => setSelectedReceiver(e.target.value)}
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

      {/* Sender Dropdown - Review From */}
      <div className="mb-6">
        <label className="block font-semibold mb-1 text-black">Review From</label>
        <select
          value={selectedSender}
          onChange={(e) => setSelectedSender(e.target.value)}
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

      {/* Hard Skills */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-black">Hard Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(HARD_SKILLS).map(([key, label]) =>
            renderSelect(key, label, hardSkills[key as keyof typeof hardSkills], (e, k) =>
              setHardSkills((prev) => ({ ...prev, [k]: parseInt(e.target.value) }))
            )
          )}
        </div>
      </div>

      {/* Soft Skills */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-black">Soft Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(SOFT_SKILLS).map(([key, label]) =>
            renderSelect(key, label, softSkills[key as keyof typeof softSkills], (e, k) =>
              setSoftSkills((prev) => ({ ...prev, [k]: parseInt(e.target.value) }))
            )
          )}
        </div>
      </div>

      {/* Productivity */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-black">Productivity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(PRODUCTIVITY).map(([key, label]) =>
            renderSelect(key, label, productivity[key as keyof typeof productivity], (e, k) =>
              setProductivity((prev) => ({ ...prev, [k]: parseInt(e.target.value) }))
            )
          )}
        </div>
      </div>

      {/* Review Text */}
      <div className="mb-6">
        <label className="block font-semibold mb-1 text-black">Review for Alumni</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          placeholder="Write your review here..."
          className="w-full p-3 border rounded-lg text-black"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={submitReview}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl mt-6"
          disabled={isSubmitting || submitted}
        >
          {submitted ? 'Review Submitted' : isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

export default AddCompanyReviewPage;
