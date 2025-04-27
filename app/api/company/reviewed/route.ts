import { reviews, companies, alumniProfiles, users } from "@/database/schema";
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Fetch the userId using the email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email)) // Get userId from the email
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userId = userResult[0].id;

    // Find the company using the userId
    const companyResult = await db
      .select()
      .from(companies)
      .where(eq(companies.userId, userId)) // Linking to the company based on userId
      .limit(1);

    if (companyResult.length === 0) {
      return NextResponse.json({ message: "Company not found for the given user" }, { status: 404 });
    }

    const companyId = companyResult[0].id;

    // Fetch reviews based on companyId
    const result = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        reviewText: reviews.reviewText,
        reviewDate: reviews.reviewDate,
        alumniName: users.fullName,
      })
      .from(reviews)
      .innerJoin(alumniProfiles, eq(alumniProfiles.id, reviews.alumniId))
      .innerJoin(companies, eq(companies.id, reviews.companyId))
      .innerJoin(users, eq(users.id, alumniProfiles.userId))
      .where(eq(reviews.companyId, companyId));

    if (result.length === 0) {
      return NextResponse.json({ message: "No reviews found for this company" }, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching company reviews:", error);
    return NextResponse.json({ message: "Error fetching company reviews", error: error.message }, { status: 500 });
  }
}
