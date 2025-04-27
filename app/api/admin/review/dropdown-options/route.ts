import { alumniProfiles, companies, users } from "@/database/schema";
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    // Fetch alumni profiles with 'alumni' type
    const alumniResults = await db
      .select({
        id: alumniProfiles.id,
        name: users.fullName, // Get alumni's full name
        type: sql`'alumni'`.as('type') // Set the type as 'alumni'
      })
      .from(alumniProfiles)
      .innerJoin(users, eq(users.id, alumniProfiles.userId));

    // Fetch companies with 'company' type
    const companyResults = await db
      .select({
        id: companies.id,
        name: users.fullName, // Get company's name
        type: sql`'company'`.as('type') // Set the type as 'company'
      })
      .from(companies)
      .innerJoin(users, eq(users.id, companies.userId));

    // Combine alumni and company results into one array
    const allOptions = [...alumniResults, ...companyResults];

    // Return the combined results as JSON
    return NextResponse.json(allOptions, { status: 200 });
  } catch (error) {
    console.error("Error fetching dropdown options:", error);
    return NextResponse.json({ message: "Error fetching dropdown options", error: error.message }, { status: 500 });
  }
}
