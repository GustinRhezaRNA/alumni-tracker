import { alumniProfiles, companies, reviewDetails, reviews } from "@/database/schema";
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";

// GET untuk mendapatkan detail alumni berdasarkan ID
export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;

    // Fetch review data with review details
    const result = await db
      .select()
      .from(reviews)
      .innerJoin(alumniProfiles, eq(alumniProfiles.id, reviews.alumniId))
      .innerJoin(companies, eq(companies.id, reviews.companyId))
      .leftJoin(reviewDetails, eq(reviewDetails.reviewId, reviews.id))
      .where(eq(reviews.id, id));

    if (result.length === 0) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error("Error retrieving review:", error);
    return NextResponse.json({ message: "Error retrieving review", error }, { status: 500 });
  }
}

// PUT untuk update data alumni berdasarkan ID
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params;
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

  console.log("Review Data (Updating):", { companyId, alumniId, rating: averageRating, reviewText });

  try {
    // Fetch existing review details
    const reviewResult = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);
      
    if (reviewResult.length === 0) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    await db
      .update(reviews)
      .set({ 
        companyId, 
        alumniId, 
        rating: averageRating, 
        reviewText 
      })
      .where(eq(reviews.id, id));

    // Update reviewDetails table with sanitized values
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

    console.log("ReviewDetails Data (Updating):", {
      reviewId: id,
      reviewText,
      ...sanitizedHardSkills,
      ...sanitizedSoftSkills,
      ...sanitizedProductivity,
    });

    // Update review_details with sanitized values
    await db
      .update(reviewDetails)
      .set({
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
      })
      .where(eq(reviewDetails.reviewId, id));

    return NextResponse.json({ message: "Review updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}


// DELETE untuk menghapus alumni berdasarkan ID
export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;

    // Delete the review details first
    await db
      .delete(reviewDetails)
      .where(eq(reviewDetails.reviewId, id));

    // Then delete the review
    const result = await db
      .delete(reviews)
      .where(eq(reviews.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ message: "Error deleting review", error: error.message }, { status: 500 });
  }
}
