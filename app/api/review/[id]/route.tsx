import { db } from '@/database/drizzle';
import { reviews, reviewDetails } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reviewId = params.id;
    const review = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);

    if (review.length === 0) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    // 2. Ambil detail review berdasarkan reviewId
    const detail = await db
      .select()
      .from(reviewDetails)
      .where(eq(reviewDetails.reviewId, reviewId))
      .limit(1);

    if (detail.length === 0) {
      return NextResponse.json({ message: 'Review details not found' }, { status: 404 });
    }

    // 3. Gabungkan review + detail
    const combined = {
      ...review[0],
      ...detail[0],
    };

    return NextResponse.json(combined);
  } catch (error) {
    console.error('Error fetching review detail:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

