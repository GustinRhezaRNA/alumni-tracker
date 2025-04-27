import { alumniProfiles, users } from "@/database/schema";
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";

// GET untuk mendapatkan detail alumni berdasarkan ID
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params; // Access id properly from context.params

    // Fetch data using the provided id
    const result = await db
      .select()
      .from(alumniProfiles)
      .innerJoin(users, eq(users.id, alumniProfiles.userId))
      .where(eq(alumniProfiles.id, id));

    if (result.length === 0) {
      return NextResponse.json({ message: "Alumni profile not found" }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    console.error("Error retrieving alumni profile:", error);
    return NextResponse.json({ message: "Error retrieving alumni profile", error }, { status: 500 });
  }
}

// PUT untuk update data alumni berdasarkan ID
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params; // Access id properly from context.params
    const requestData = await request.json();

    // Sanitize data
    const sanitizedData = {
      nim: requestData.nim || null,
      graduationYear: requestData.graduationYear || null,
      faculty: requestData.faculty || null,
      major: requestData.major || null,
      phone: requestData.phone || null,
      address: requestData.address || null,
      jobStatus: requestData.jobStatus || null,
      currentCompany: requestData.currentCompany || null,
      jobPosition: requestData.jobPosition || null,
      jobWaitTime: requestData.jobWaitTime || null,
      firstSalary: requestData.firstSalary || null,
      jobMatchWithMajor: requestData.jobMatchWithMajor ?? null,
      curriculumFeedback: requestData.curriculumFeedback || null,
      universityName: requestData.universityName || null,
      studyProgram: requestData.studyProgram || null,
      fundingSource: requestData.fundingSource || null,
      scholarshipSource: requestData.scholarshipSource || null,
    };

    // Ensure graduationYear is not null or undefined if it's required
    if (sanitizedData.graduationYear === null) {
      return NextResponse.json({ message: "Graduation Year is required" }, { status: 400 });
    }

    // Update the alumni profile with sanitized data using context.params.id
    const result = await db
      .update(alumniProfiles)
      .set(sanitizedData)
      .where(eq(alumniProfiles.id, id)) // Use the `id` extracted from context.params
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ message: "Alumni profile not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Alumni profile updated successfully", data: result[0] }, { status: 200 });
  } catch (error) {
    console.error('Error updating alumni profile:', error);
    return NextResponse.json({ message: "Error updating alumni profile", error: error.message }, { status: 500 });
  }
}

// DELETE untuk menghapus alumni berdasarkan ID
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;

    const alumni = await db
      .select()
      .from(alumniProfiles)
      .where(eq(alumniProfiles.id, id))
      .limit(1); // Only one result should be found

    if (alumni.length === 0) {
      return NextResponse.json({ message: "Alumni profile not found" }, { status: 404 });
    }

    const userId = alumni[0].userId; // Get the userId from the alumni profile

    // Step 2: Delete the user from the users table using the userId
    const result = await db
      .delete(users)
      .where(eq(users.id, userId)) // Delete user by userId
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Step 3: Return success message
    return NextResponse.json({ message: "Alumni profile and associated user deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error('Error deleting alumni profile:', error);
    return NextResponse.json({ message: "Error deleting alumni profile", error: error.message }, { status: 500 });
  }
}
