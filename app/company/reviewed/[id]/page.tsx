"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HARD_SKILLS, SOFT_SKILLS, PRODUCTIVITY } from "@/constants/review";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

const ReviewDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [review, setReview] = useState<any>(null);

  useEffect(() => {
    const fetchReview = async () => {
      const res = await fetch(`/api/review/${id}`);
      const data = await res.json();
      setReview(data);
    };
    fetchReview();
  }, [id]);

  if (!review)
    return <p className="text-center mt-10 text-white">Loading...</p>;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#001E80] py-10 px-6 text-black">
      <div className="mb-4">
        <Button
          onClick={() => router.back()}
          className="bg-white text-[#001E80] hover:bg-gray-100"
        >
          ← Back
        </Button>
      </div>

      <div className="flex justify-center">
        <Card className="p-6 w-full max-w-3xl bg-white rounded-2xl shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold">Detail Review Alumni</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 rounded-full border border-gray-300 p-0"
                  aria-label="Bantuan"
                >
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="text-sm max-w-36">
                Detail Nilai:
                <br />
                1: sangat buruk
                <br />
                2: buruk
                <br />
                3: cukup
                <br />
                4: baik
                <br />
                5: sangat baik
              </PopoverContent>
            </Popover>
          </div>

          <p className="mb-2">
            <strong>Rating Total:</strong> {review.rating}
          </p>
          <p className="mb-2">
            <strong>Review Text:</strong> {review.reviewText}
          </p>
          <p className="mb-6">
            <strong>Reviewed On:</strong> {formatDate(review.reviewDate)}
          </p>

          <section className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Hard Skills</h3>
            <ul className="list-disc ml-6">
              <li>
                {HARD_SKILLS.H1}: {review.hardSkillsH1}
              </li>
              <li>
                {HARD_SKILLS.H2}: {review.hardSkillsH2}
              </li>
              <li>
                {HARD_SKILLS.H3}: {review.hardSkillsH3}
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Soft Skills</h3>
            <ul className="list-disc ml-6">
              <li>
                {SOFT_SKILLS.S1}: {review.softSkillsS1}
              </li>
              <li>
                {SOFT_SKILLS.S2}: {review.softSkillsS2}
              </li>
              <li>
                {SOFT_SKILLS.S3}: {review.softSkillsS3}
              </li>
              <li>
                {SOFT_SKILLS.S4}: {review.softSkillsS4}
              </li>
              <li>
                {SOFT_SKILLS.S5}: {review.softSkillsS5}
              </li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">Produktivitas</h3>
            <ul className="list-disc ml-6">
              <li>
                {PRODUCTIVITY.P1}: {review.productivityP1}
              </li>
              <li>
                {PRODUCTIVITY.P2}: {review.productivityP2}
              </li>
              <li>
                {PRODUCTIVITY.P3}: {review.productivityP3}
              </li>
            </ul>
          </section>
        </Card>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
