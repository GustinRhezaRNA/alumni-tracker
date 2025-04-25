import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/drizzle'; // pastikan path ke db Drizzle kamu benar
import { users, companies } from '@/database/schema'; // sesuaikan dengan skema kamu
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Cari user berdasarkan email
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = userResult[0];

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Cari company berdasarkan userId
    const companyResult = await db
      .select()
      .from(companies)
      .where(eq(companies.userId, user.id))
      .limit(1);

    const company = companyResult[0];

    if (!company) {
      return NextResponse.json({ error: 'Company not found for user' }, { status: 404 });
    }

    return NextResponse.json({company}, { status: 200 });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
