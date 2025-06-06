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
    hardSkillsAvg: sql`
      (
        (COUNT(CASE WHEN ${reviewDetails.hardSkillsH1} = 1 THEN 1 END) * 1 +
         COUNT(CASE WHEN ${reviewDetails.hardSkillsH1} = 2 THEN 1 END) * 2 +
         COUNT(CASE WHEN ${reviewDetails.hardSkillsH1} = 3 THEN 1 END) * 3 +
         COUNT(CASE WHEN ${reviewDetails.hardSkillsH1} = 4 THEN 1 END) * 4 +
         COUNT(CASE WHEN ${reviewDetails.hardSkillsH1} = 5 THEN 1 END) * 5 +
         COUNT(CASE WHEN ${reviewDetails.hardSkillsH2} = 1 THEN 1 END) * 1 +
         COUNT(CASE WHEN ${reviewDetails.hardSkillsH2} = 2 THEN 1 END) * 2 +
         COUNT(CASE WHEN ${reviewDetails.hardSkillsH2} = 3 THEN 1 END) * 3 +
         COUNT(CASE WHEN ${reviewDetails.hardSkillsH2} = 4 THEN 1 END) * 4 +
         COUNT(CASE WHEN ${reviewDetails.hardSkillsH2} = 5 THEN 1 END) * 5 +
         COUNT(CASE WHEN ${reviewDetails.hardSkillsH3} = 1 THEN 1 END) * 1 +
         COUNT(CASE WHEN ${reviewDetails.hardSkillsH3} = 2 THEN 1 END) * 2 +
         COUNT(CASE WHEN ${reviewDetails.hardSkillsH3} = 3 THEN 1 END) * 3 +
         COUNT(CASE WHEN ${reviewDetails.hardSkillsH3} = 4 THEN 1 END) * 4 +
         COUNT(CASE WHEN ${reviewDetails.hardSkillsH3} = 5 THEN 1 END) * 5)
      ) / NULLIF(
        (COUNT(${reviewDetails.hardSkillsH1}) +
         COUNT(${reviewDetails.hardSkillsH2}) +
         COUNT(${reviewDetails.hardSkillsH3})), 0
      )`.mapWith(Number),
    softSkillsAvg: sql`
      (
        (COUNT(CASE WHEN ${reviewDetails.softSkillsS1} = 1 THEN 1 END) * 1 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS1} = 2 THEN 1 END) * 2 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS1} = 3 THEN 1 END) * 3 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS1} = 4 THEN 1 END) * 4 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS1} = 5 THEN 1 END) * 5 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS2} = 1 THEN 1 END) * 1 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS2} = 2 THEN 1 END) * 2 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS2} = 3 THEN 1 END) * 3 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS2} = 4 THEN 1 END) * 4 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS2} = 5 THEN 1 END) * 5 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS3} = 1 THEN 1 END) * 1 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS3} = 2 THEN 1 END) * 2 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS3} = 3 THEN 1 END) * 3 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS3} = 4 THEN 1 END) * 4 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS3} = 5 THEN 1 END) * 5 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS4} = 1 THEN 1 END) * 1 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS4} = 2 THEN 1 END) * 2 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS4} = 3 THEN 1 END) * 3 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS4} = 4 THEN 1 END) * 4 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS4} = 5 THEN 1 END) * 5 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS5} = 1 THEN 1 END) * 1 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS5} = 2 THEN 1 END) * 2 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS5} = 3 THEN 1 END) * 3 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS5} = 4 THEN 1 END) * 4 +
         COUNT(CASE WHEN ${reviewDetails.softSkillsS5} = 5 THEN 1 END) * 5)
      ) / NULLIF(
        (COUNT(${reviewDetails.softSkillsS1}) +
         COUNT(${reviewDetails.softSkillsS2}) +
         COUNT(${reviewDetails.softSkillsS3}) +
         COUNT(${reviewDetails.softSkillsS4}) +
         COUNT(${reviewDetails.softSkillsS5})), 0
      )`.mapWith(Number),
    productivityAvg: sql`
      (
        (COUNT(CASE WHEN ${reviewDetails.productivityP1} = 1 THEN 1 END) * 1 +
         COUNT(CASE WHEN ${reviewDetails.productivityP1} = 2 THEN 1 END) * 2 +
         COUNT(CASE WHEN ${reviewDetails.productivityP1} = 3 THEN 1 END) * 3 +
         COUNT(CASE WHEN ${reviewDetails.productivityP1} = 4 THEN 1 END) * 4 +
         COUNT(CASE WHEN ${reviewDetails.productivityP1} = 5 THEN 1 END) * 5 +
         COUNT(CASE WHEN ${reviewDetails.productivityP2} = 1 THEN 1 END) * 1 +
         COUNT(CASE WHEN ${reviewDetails.productivityP2} = 2 THEN 1 END) * 2 +
         COUNT(CASE WHEN ${reviewDetails.productivityP2} = 3 THEN 1 END) * 3 +
         COUNT(CASE WHEN ${reviewDetails.productivityP2} = 4 THEN 1 END) * 4 +
         COUNT(CASE WHEN ${reviewDetails.productivityP2} = 5 THEN 1 END) * 5 +
         COUNT(CASE WHEN ${reviewDetails.productivityP3} = 1 THEN 1 END) * 1 +
         COUNT(CASE WHEN ${reviewDetails.productivityP3} = 2 THEN 1 END) * 2 +
         COUNT(CASE WHEN ${reviewDetails.productivityP3} = 3 THEN 1 END) * 3 +
         COUNT(CASE WHEN ${reviewDetails.productivityP3} = 4 THEN 1 END) * 4 +
         COUNT(CASE WHEN ${reviewDetails.productivityP3} = 5 THEN 1 END) * 5)
      ) / NULLIF(
        (COUNT(${reviewDetails.productivityP1}) +
         COUNT(${reviewDetails.productivityP2}) +
         COUNT(${reviewDetails.productivityP3})), 0
      )`.mapWith(Number),
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
  }
catch (error) {
    console.error("Error fetching admin home data:", error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
