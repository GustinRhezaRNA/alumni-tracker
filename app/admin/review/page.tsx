"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Define types for the response from the API
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
  alumni_profiles: {
    id: string;
    userId: string;
    nim: string;
    graduationYear: number;
    faculty: string;
    major: string;
    phone: string;
    address: string;
    jobStatus: string;
    currentCompany: string;
    jobPosition: string;
    jobWaitTime: string;
    firstSalary: string;
    jobMatchWithMajor: number | null;
    curriculumFeedback: string;
    universityName: string;
    studyProgram: string;
    fundingSource: string;
    scholarshipSource: string;
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

  // Fetch reviews data from the API
  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/admin/review");
      const data = await response.json();
      setReviews(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(); // Fetch reviews when the component mounts
  }, []);

  // Handle delete action
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/reviews?id=${id}`, {
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
    // Implement update functionality (e.g., open a modal or navigate to an edit page)
    console.log("Update review with ID:", id);
  };

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Review Data</h2>
        <Button className="bg-[#2bff00] hover:bg-[#25d900] text-black">Add Review</Button>
      </div>

      {loading ? (
        <div>Loading...</div> // Show loading state
      ) : (
        reviews.map((reviewData) => (
          <Card key={reviewData.reviews.id} className="p-6 border rounded-lg mb-4">
            <div className="flex justify-between items-start">
              <div>
                {/* Review Information */}
                <h3 className="text-2xl font-bold mb-4">
                  Review for {reviewData.companies.industry}
                </h3>
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Alumni: </span>
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

                {/* Review Details */}
                <div className="space-y-1 mt-4">
                  <p>
                    <span className="font-medium">Hard Skills: </span>
                    {reviewData.review_details.hardSkillsH1}, {reviewData.review_details.hardSkillsH2}, {reviewData.review_details.hardSkillsH3}
                  </p>
                  <p>
                    <span className="font-medium">Soft Skills: </span>
                    {reviewData.review_details.softSkillsS1}, {reviewData.review_details.softSkillsS2}, {reviewData.review_details.softSkillsS3}
                  </p>
                  <p>
                    <span className="font-medium">Productivity: </span>
                    {reviewData.review_details.productivityP1}, {reviewData.review_details.productivityP2}, {reviewData.review_details.productivityP3}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  className="bg-[#ffe500] hover:bg-[#e6cf00] text-black"
                  onClick={() => handleUpdate(reviewData.reviews.id)}
                >
                  Update
                </Button>
                <Button
                  className="bg-[#ff0000] hover:bg-[#cc0000] text-white"
                  onClick={() => handleDelete(reviewData.reviews.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default ReviewsPage;
