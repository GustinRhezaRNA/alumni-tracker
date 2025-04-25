import { alumniProfiles, users } from "@/database/schema";
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle"; // Pastikan path benar
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Ambil data alumni beserta data user yang terkait
    const result = await db
      .select()
      .from(alumniProfiles)
      .innerJoin(users, eq(users.id, alumniProfiles.userId)); // Menggunakan inner join untuk gabungkan data

    // Mengembalikan hasil dalam format JSON
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error retrieving alumni profiles", error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const {
      userId,
      nim,
      graduationYear,
      faculty,
      major,
      phone,
      address,
      jobStatus,
      currentCompany,
      jobPosition,
      jobWaitTime,
      firstSalary,
      jobMatchWithMajor,
      curriculumFeedback,
      universityName,
      studyProgram,
      fundingSource,
      scholarshipSource,
    } = await request.json();

    const result = await db.insert(alumniProfiles).values({
      userId,
      nim,
      graduationYear,
      faculty,
      major,
      phone,
      address,
      jobStatus,
      currentCompany,
      jobPosition,
      jobWaitTime,
      firstSalary,
      jobMatchWithMajor,
      curriculumFeedback,
      universityName,
      studyProgram,
      fundingSource,
      scholarshipSource,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating alumni profile", error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const {
      id,
      userId,
      nim,
      graduationYear,
      faculty,
      major,
      phone,
      address,
      jobStatus,
      currentCompany,
      jobPosition,
      jobWaitTime,
      firstSalary,
      jobMatchWithMajor,
      curriculumFeedback,
      universityName,
      studyProgram,
      fundingSource,
      scholarshipSource,
    } = await request.json();

    const result = await db
      .update(alumniProfiles)
      .set({
        userId,
        nim,
        graduationYear,
        faculty,
        major,
        phone,
        address,
        jobStatus,
        currentCompany,
        jobPosition,
        jobWaitTime,
        firstSalary,
        jobMatchWithMajor,
        curriculumFeedback,
        universityName,
        studyProgram,
        fundingSource,
        scholarshipSource,
      })
      .where(eq(alumniProfiles.id, id));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating alumni profile", error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Extract the query parameter 'id' from the URL
    const url = new URL(request.url);
    const id = url.searchParams.get("id"); // Use `.get()` to retrieve the query parameter

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    // Perform the delete operation
    const result = await db.delete(alumniProfiles).where(eq(alumniProfiles.id, id));
    return NextResponse.json({ message: "Alumni profile deleted successfully", result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting alumni profile", error }, { status: 500 });
  }
}
