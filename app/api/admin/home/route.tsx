import { NextResponse  } from 'next/server';
import { db } from '@/database/drizzle';
import { count } from 'drizzle-orm';
import { users, alumniProfiles, reviews, companies } from '@/database/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // 1. Mendapatkan total users
    const totalUsers = await db.select({ count: count() }).from(users);

    // 2. Mendapatkan total alumni
    const totalAlumni = await db.select({ count: count() })
      .from(users)
      .where(eq(users.role, 'ALUMNI'));

    // 3. Mendapatkan total perusahaan
    const totalCompanies = await db.select({ count: count() }).from(companies);

    // 4. Mendapatkan total reviews
    const totalReviews = await db.select({ count: count() }).from(reviews);

    // 5. Mendapatkan rata-rata rating
    const avgRating = await db.select({
      average: sql`AVG(${reviews.rating})`.mapWith(Number)
    }).from(reviews);

    // 6. Statistik berdasarkan tahun kelulusan
    const alumniByYear = await db.select({
      graduationYear: alumniProfiles.graduationYear,
      count: count()
    })
    .from(alumniProfiles)
    .groupBy(alumniProfiles.graduationYear)
    .orderBy(alumniProfiles.graduationYear);

   
  

    // 8. Statistik berdasarkan jurusan/prodi
    const alumniByMajor = await db.select({
      major: alumniProfiles.major,
      count: count()
    })
    .from(alumniProfiles)
    .groupBy(alumniProfiles.major)
    .orderBy(sql`count DESC`);

    // 9. Statistik status pekerjaan
    const jobStatusStats = await db.select({
      jobStatus: alumniProfiles.jobStatus,
      count: count()
    })
    .from(alumniProfiles)
    .groupBy(alumniProfiles.jobStatus)
    .orderBy(sql`count DESC`);

    // 10. Statistik waktu tunggu kerja
    const jobWaitTimeStats = await db.select({
      jobWaitTime: alumniProfiles.jobWaitTime,
      count: count()
    })
    .from(alumniProfiles)
    .where(sql`${alumniProfiles.jobWaitTime} IS NOT NULL`)
    .groupBy(alumniProfiles.jobWaitTime)
    .orderBy(sql`count DESC`);

    return NextResponse.json({
      totalUsers: totalUsers[0].count,
      totalAlumni: totalAlumni[0].count,
      totalCompanies: totalCompanies[0].count,
      totalReviews: totalReviews[0].count,
      averageRating: avgRating[0].average || 0,
      alumniByYear,
      alumniByMajor,
      jobStatusStats,
      jobWaitTimeStats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}