import { NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { count, eq, sql } from 'drizzle-orm';
import {
  users,
  alumniProfiles,
  reviews,
  companies,
  reviewDetails,
} from '@/database/schema';

export async function GET() {
  try {
    // 1. Total users
    const totalUsers = await db.select({ count: count() }).from(users);

    // 2. Total alumni
    const totalAlumni = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, 'ALUMNI'));

    // 3. Total perusahaan
    const totalCompanies = await db.select({ count: count() }).from(companies);

    // 4. Total reviews
    const totalReviews = await db.select({ count: count() }).from(reviews);

    // 5. Rata-rata rating
    const avgRating = await db
      .select({
        average: sql`AVG(${reviews.rating})`.mapWith(Number),
      })
      .from(reviews);

    // 6. Statistik tahun kelulusan
    const alumniByYear = await db
      .select({
        graduationYear: alumniProfiles.graduationYear,
        count: count(),
      })
      .from(alumniProfiles)
      .groupBy(alumniProfiles.graduationYear)
      .orderBy(alumniProfiles.graduationYear);

    // 7. Statistik jurusan
    const alumniByMajor = await db
      .select({
        major: alumniProfiles.major,
        count: count(),
      })
      .from(alumniProfiles)
      .groupBy(alumniProfiles.major)
      .orderBy(sql`count DESC`);

    // 8. Statistik status kerja
    const jobStatusStats = await db
      .select({
        jobStatus: alumniProfiles.jobStatus,
        count: count(),
      })
      .from(alumniProfiles)
      .groupBy(alumniProfiles.jobStatus)
      .orderBy(sql`count DESC`);

    // 9. Statistik waktu tunggu kerja
    const jobWaitTimeStats = await db
      .select({
        jobWaitTime: alumniProfiles.jobWaitTime,
        count: count(),
      })
      .from(alumniProfiles)
      .where(sql`${alumniProfiles.jobWaitTime} IS NOT NULL`)
      .groupBy(alumniProfiles.jobWaitTime)
      .orderBy(sql`count DESC`);

    // 10. Rata-rata skill berdasarkan jurusan
    const skillsByMajor = await db
      .select({
        major: alumniProfiles.major,
        hardSkillsAvg: sql`AVG((${reviewDetails.hardSkillsH1} + ${reviewDetails.hardSkillsH2} + ${reviewDetails.hardSkillsH3}) / 3)`.mapWith(Number),
        softSkillsAvg: sql`AVG((${reviewDetails.softSkillsS1} + ${reviewDetails.softSkillsS2} + ${reviewDetails.softSkillsS3} + ${reviewDetails.softSkillsS4} + ${reviewDetails.softSkillsS5}) / 5)`.mapWith(Number),
        productivityAvg: sql`AVG((${reviewDetails.productivityP1} + ${reviewDetails.productivityP2} + ${reviewDetails.productivityP3}) / 3)`.mapWith(Number),
      })
      .from(reviewDetails)
      .innerJoin(reviews, eq(reviewDetails.reviewId, reviews.id))
      .innerJoin(alumniProfiles, eq(reviews.alumniId, alumniProfiles.id))
      .groupBy(alumniProfiles.major);

    return NextResponse.json({
      totalUsers: totalUsers[0].count,
      totalAlumni: totalAlumni[0].count,
      totalCompanies: totalCompanies[0].count,
      totalReviews: totalReviews[0].count,
      averageRating: avgRating[0].average || 0,
      alumniByYear,
      alumniByMajor,
      jobStatusStats,
      jobWaitTimeStats,
      skillsByMajor, 
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
