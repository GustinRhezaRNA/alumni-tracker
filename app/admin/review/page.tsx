'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HARD_SKILLS, SOFT_SKILLS, PRODUCTIVITY } from '@/constants/review';
import { useRouter } from 'next/navigation';

interface Review {
  reviews: {
    id: string;
    companyId: string;
    alumniId: string;
    rating: string;
    reviewText: string;
    reviewDate: string;
  };
  review_details: {
    id: string;
    reviewId: string;
    hardSkillsH1: number;
    hardSkillsH2: number;
    hardSkillsH3: number;
    softSkillsS1: number;
    softSkillsS2: number;
    softSkillsS3: number;
    softSkillsS4: number;
    softSkillsS5: number;
    productivityP1: number;
    productivityP2: number;
    productivityP3: number;
  };
  companies: {
    id: string;
    industry: string;
    address: string;
    contact: string;
    companyDescription: string;
    hrdContact: string;
    userId: string;
  };
  users: {
    id: string;
    fullName: string;
    email: string;
    pictureUrl: string;
    role: string;
  };
  company_users: {
    id: string;
    fullName: string;
    email: string;
    pictureUrl: string;
    role: string;
  };
}

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
   const Router = useRouter();
  

  // Fetch reviews data from the API
  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/admin/review");
      const data = await response.json();
      setReviews(data);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(); // Fetch reviews when the component mounts
  }, []);

  // Handle add review action
  const handleAddReview = () => {
    Router.push("/admin/review/new"); 
  };

  // Handle delete action
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/review/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setReviews(reviews.filter((review) => review.reviews.id !== id)); // Remove the deleted review from the list
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Handle update action
  const handleUpdate = (id: string) => {
    Router.push(`/admin/review/edit/${id}`); // Redirect to the update page with the review ID
  };

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Review Data</h2>
        <Button onClick={handleAddReview} className="bg-green-500 hover:bg-green-600 text-white">Add Review</Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        reviews.map((reviewData) => (
          <div key={reviewData.reviews.id} className="p-6 rounded-lg mb-4 shadow-md bg-white ">
            <div className="flex justify-between items-start ">
              <div>
                {/* Review Information */}
                <h3 className="text-2xl font-bold mb-4">
                  Review From {reviewData.company_users.fullName} 
                </h3>

                {/* Company Information */}
                <div className="space-y-1 mt-4">
                  <p>
                    <span className="font-medium">Company: </span>
                    {reviewData.companies.industry} - {reviewData.companies.companyDescription}
                  </p>
                  <p>
                    <span className="font-medium">Contact: </span>
                    {reviewData.companies.contact}
                  </p>
                </div>

                {/* Alumni Information */}
                <div className="space-y-1">
                  <p>
                    <span className="font-medium"><br />for Alumni: </span>
                    {reviewData.users.fullName} ({reviewData.users.email})
                  </p>
                  <p>
                    <span className="font-medium">Rating: </span>
                    {reviewData.reviews.rating}
                  </p>
                  <p>
                    <span className="font-medium">Review: </span>
                    {reviewData.reviews.reviewText}
                  </p>
                </div>

                {/* Review Details */}
                <div className="space-y-1 mt-4">
                  {/* Hard Skills */}
                  <p>
                    <span className="font-medium">Hard Skills: <br /></span>
                    {HARD_SKILLS.H1}: {reviewData.review_details.hardSkillsH1}, 
                    {HARD_SKILLS.H2}: {reviewData.review_details.hardSkillsH2}, 
                    {HARD_SKILLS.H3}: {reviewData.review_details.hardSkillsH3}
                  </p>

                  {/* Soft Skills */}
                  <p>
                    <span className="font-medium">Soft Skills: <br /> </span>
                    {SOFT_SKILLS.S1}: {reviewData.review_details.softSkillsS1}, 
                    {SOFT_SKILLS.S2}: {reviewData.review_details.softSkillsS2}, 
                    {SOFT_SKILLS.S3}: {reviewData.review_details.softSkillsS3},
                    {SOFT_SKILLS.S4}: {reviewData.review_details.softSkillsS4},
                    {SOFT_SKILLS.S5}: {reviewData.review_details.softSkillsS5}
                  </p>

                  {/* Productivity */}
                  <p>
                    <span className="font-medium">Productivity: <br /></span>
                    {PRODUCTIVITY.P1}: {reviewData.review_details.productivityP1}, 
                    {PRODUCTIVITY.P2}: {reviewData.review_details.productivityP2}, 
                    {PRODUCTIVITY.P3}: {reviewData.review_details.productivityP3}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={() => handleUpdate(reviewData.reviews.id)}
                >
                  Update
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => handleDelete(reviewData.reviews.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewsPage;
