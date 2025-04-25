import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { reviews, reviewDetails } from "@/database/schema";

export async function POST(req: Request) {
  const body = await req.json();
  const { companyId, alumniId, reviewText, hardSkills, softSkills, productivity } = body;

  // Calculate average rating
  const calculateAverage = () => {
    const allValues = [
      ...Object.values(hardSkills),
      ...Object.values(softSkills),
      ...Object.values(productivity),
    ];
    const total = allValues.reduce((acc, val) => acc + val, 0);
    return total / allValues.length;
  };

  const averageRating = parseFloat(calculateAverage().toFixed(2)); // Ensure it's a number

  console.log("Review Data:", { companyId, alumniId, rating: averageRating, reviewText });

  try {
    // Insert into reviews table and get the review ID
    const reviewResult = await db.insert(reviews).values({
      companyId,
      alumniId,
      rating: averageRating, 
      reviewText,
    }).returning({ id: reviews.id });

    const reviewId = reviewResult[0].id; // Directly use the UUID

    // Ensure no undefined or null values are passed for hardSkills, softSkills, and productivity
    const sanitizedHardSkills = {
      H1: hardSkills.H1 ?? 0,
      H2: hardSkills.H2 ?? 0,
      H3: hardSkills.H3 ?? 0,
    };
    const sanitizedSoftSkills = {
      S1: softSkills.S1 ?? 0,
      S2: softSkills.S2 ?? 0,
      S3: softSkills.S3 ?? 0,
      S4: softSkills.S4 ?? 0,
      S5: softSkills.S5 ?? 0,
    };
    const sanitizedProductivity = {
      P1: productivity.P1 ?? 0,
      P2: productivity.P2 ?? 0,
      P3: productivity.P3 ?? 0,
    };

    console.log("ReviewDetails Data:", {
      reviewId,
      reviewText,
      ...sanitizedHardSkills,
      ...sanitizedSoftSkills,
      ...sanitizedProductivity,
    });

    // Insert into review_details table with sanitized values
    await db.insert(reviewDetails).values({
      reviewId, // Connect to reviews table
      reviewText,
      hardSkillsH1: sanitizedHardSkills.H1,
      hardSkillsH2: sanitizedHardSkills.H2,
      hardSkillsH3: sanitizedHardSkills.H3,
      softSkillsS1: sanitizedSoftSkills.S1,
      softSkillsS2: sanitizedSoftSkills.S2,
      softSkillsS3: sanitizedSoftSkills.S3,
      softSkillsS4: sanitizedSoftSkills.S4,
      softSkillsS5: sanitizedSoftSkills.S5,
      productivityP1: sanitizedProductivity.P1,
      productivityP2: sanitizedProductivity.P2,
      productivityP3: sanitizedProductivity.P3,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Insert failed:", error);
    return NextResponse.json({ error: "Gagal menyimpan review" }, { status: 500 });
  }
}
