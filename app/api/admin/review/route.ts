import { reviews, reviewDetails, companies, users, alumniProfiles } from "@/database/schema";
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { eq, sql } from "drizzle-orm";

export async function GET() {
    try {


        const result = await db
            .select()
            .from(reviews)
            .innerJoin(reviewDetails, eq(reviews.id, reviewDetails.reviewId))
            .innerJoin(companies, eq(reviews.companyId, companies.id))
            .innerJoin(alumniProfiles, eq(reviews.alumniId, alumniProfiles.id))
            .innerJoin(users, eq(users.id, alumniProfiles.userId))
            .innerJoin(
                db.select().from(users).as('company_users'),
                eq(companies.userId, sql`company_users.id`)
            );

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error retrieving reviews", error }, { status: 500 });
    }
}

// export async function POST(request: Request) {
//   try {
//     const {
//       companyId,
//       alumniId,
//       rating,
//       reviewText,
//       hardSkillsH1,
//       hardSkillsH2,
//       hardSkillsH3,
//       softSkillsS1,
//       softSkillsS2,
//       softSkillsS3,
//       softSkillsS4,
//       softSkillsS5,
//       productivityP1,
//       productivityP2,
//       productivityP3,
//     } = await request.json();

//     // Insert review data into reviews table
//     const reviewResult = await db.insert(reviews).values({
//       companyId,
//       alumniId,
//       rating,
//       reviewText,
//     }).returning({ id: reviews.id }); // Ensure the ID is returned

//     // Insert review details into review_details table
//     const reviewDetailsResult = await db.insert(reviewDetails).values({
//       reviewId: reviewResult[0]?.id, // Safely access the ID of the inserted review
//       hardSkillsH1,
//       hardSkillsH2,
//       hardSkillsH3,
//       softSkillsS1,
//       softSkillsS2,
//       softSkillsS3,
//       softSkillsS4,
//       softSkillsS5,
//       productivityP1,
//       productivityP2,
//       productivityP3,
//     });

//     return NextResponse.json({ reviewResult, reviewDetailsResult }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ message: "Error creating review", error }, { status: 500 });
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     const {
//       id,
//       companyId,
//       alumniId,
//       rating,
//       reviewText,
//       hardSkillsH1,
//       hardSkillsH2,
//       hardSkillsH3,
//       softSkillsS1,
//       softSkillsS2,
//       softSkillsS3,
//       softSkillsS4,
//       softSkillsS5,
//       productivityP1,
//       productivityP2,
//       productivityP3,
//     } = await request.json();

//     // Update review data
//     const reviewResult = await db
//       .update(reviews)
//       .set({ companyId, alumniId, rating, reviewText })
//       .where(eq(reviews.id, id));

//     // Update review details data
//     const reviewDetailsResult = await db
//       .update(reviewDetails)
//       .set({
//         hardSkillsH1,
//         hardSkillsH2,
//         hardSkillsH3,
//         softSkillsS1,
//         softSkillsS2,
//         softSkillsS3,
//         softSkillsS4,
//         softSkillsS5,
//         productivityP1,
//         productivityP2,
//         productivityP3,
//       })
//       .where(eq(reviewDetails.reviewId, id));

//     return NextResponse.json({ reviewResult, reviewDetailsResult }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Error updating review", error }, { status: 500 });
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     const url = new URL(request.url);
//     const id = url.searchParams.get("id"); // Retrieve query parameter 'id'

//     if (!id) {
//       return NextResponse.json({ message: "ID is required" }, { status: 400 });
//     }

//     // Delete review details first to avoid foreign key constraint violations
//     await db.delete(reviewDetails).where(eq(reviewDetails.reviewId, id));

//     // Then delete the review
//     const result = await db.delete(reviews).where(eq(reviews.id, id));

//     return NextResponse.json({ message: "Review deleted successfully", result }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "Error deleting review", error }, { status: 500 });
//   }
// }
