'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';





const CompanyReviewsPage = () => {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      if (!session) return;

      try {
        const response = await fetch('/api/company/reviewed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: session?.user?.email, // Send the email in the body
          }),
        });
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [session]);



  return (
    <div className="bg-[#001E80] min-h-screen py-12 flex flex-col items-center justify-center relative">
      <Button onClick={() => router.back()} className="absolute top-6 left-6 bg-white text-[#001E80] hover:bg-gray-100">
        ← Back
      </Button>

      <Card className="min-w-8/12 max-w-3xl p-6 bg-white rounded-2xl shadow-md mb-6">
        <h1 className="text-3xl font-semibold text-center text-[#333] mb-4">Company Reviews</h1>

        {loading ? (
          <p className="text-center">Loading reviews...</p>
        ) : (
          reviews.length === 0 ? (
            <p className="text-center">No reviews found for your company.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="mb-4 p-4 bg-white rounded-lg shadow-md border">
                <h3 className="text-xl font-semibold">{review.alumniName} -  <Star className="w-5 h-5 fill-yellow-500 stroke-yellow-500 inline" />
                  {review.rating}</h3>
                <p className="text-gray-600">Description <br />{review.reviewText}</p>
                <div className="text-sm text-gray-500">Reviewed on: {new Date(review.reviewDate).toLocaleDateString()}</div>
              </div>
            ))
          )
        )}
      </Card>
    </div>
  );
};

export default CompanyReviewsPage;
