import { NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { alumniProfiles, users } from '@/database/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const alumni = await db
      .select({
        alumni: alumniProfiles,
        user: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
          pictureUrl: users.pictureUrl,
        },
      })
      .from(alumniProfiles)
      .innerJoin(users, eq(alumniProfiles.userId, users.id))
      .where(eq(users.role, "ALUMNI")); // Filter hanya role alumni

    return NextResponse.json(alumni, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Error fetching alumni: ${error}` },
      { status: 500 }
    );
  }
}
