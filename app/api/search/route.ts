import { NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { alumniProfiles, users, reviews, companies } from '@/database/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    // Get userEmail from request body
    const { userEmail } = await request.json();

    if (!userEmail) {
      return NextResponse.json(
        { message: 'userEmail is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, userEmail))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const userId = user[0].id;

    // Find the company associated with the user
    const company = await db
      .select({ id: companies.id })
      .from(companies)
      .where(eq(companies.userId, userId))
      .limit(1);

    if (!company.length) {
      return NextResponse.json(
        { message: 'Company not found for this user' },
        { status: 404 }
      );
    }

    const companyId = company[0].id;

    // Fetch alumni data with review status
    const alumni = await db
      .select({
        alumni: alumniProfiles,
        user: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
          pictureUrl: users.pictureUrl,
        },
        hasReview: reviews.id, // If review exists, this will be non-null
      })
      .from(alumniProfiles)
      .innerJoin(users, eq(alumniProfiles.userId, users.id))
      .leftJoin(
        reviews,
        and(
          eq(reviews.alumniId, alumniProfiles.id),
          eq(reviews.companyId, companyId)
        )
      )
      .where(eq(users.role, 'ALUMNI'));

    return NextResponse.json(alumni, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error fetching alumni: ${error}` },
      { status: 500 }
    );
  }
}