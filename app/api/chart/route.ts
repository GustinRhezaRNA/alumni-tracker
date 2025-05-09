import { db } from "@/database/drizzle";
import { alumniProfiles, reviews, reviewDetails } from "@/database/schema";
import { eq, avg, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const averageRatingsByMajor = await db
      .select({
        major: alumniProfiles.major,
        averageRating: avg(reviews.rating).as("average_rating"),
      })
      .from(alumniProfiles)
      .innerJoin(reviews, eq(alumniProfiles.id, reviews.alumniId))
      .groupBy(alumniProfiles.major)
      .orderBy(alumniProfiles.major);

    return NextResponse.json({ data: averageRatingsByMajor }, { status: 200 });
  } catch (error) {
    console.error("Error fetching average ratings by major:", error);
    return NextResponse.json(
      { error: "Failed to fetch average ratings" },
      { status: 500 }
    );
  }
}