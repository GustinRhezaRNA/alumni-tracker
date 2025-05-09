import { alumniProfiles, users } from "@/database/schema";
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle"; 
import { eq } from "drizzle-orm";

// Fetching all alumni data from the database
export async function GET() {
  try {
    const result = await db
      .select()
      .from(alumniProfiles)
      .innerJoin(users, eq(users.id, alumniProfiles.userId));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error retrieving alumni profiles:", error);
    return NextResponse.json({ message: "Error retrieving alumni profiles", error }, { status: 500 });
  }
}

// Update the alumni profile with sanitized data
export async function POST(request: Request) {
  try {
    const {
      fullName,
      nim,
      email,
      phone,
      address,
      major,
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
      graduationYear,
    } = await request.json();

    // Sanitize data: Replace empty strings with null for fields that are expected to be integers
    const sanitizedData = {
      fullName,
      nim,
      email,
      phone,
      address,
    
      major,
      jobStatus,
      currentCompany: currentCompany || null,
      jobPosition: jobPosition || null, 
      jobWaitTime: jobWaitTime || null, 
      firstSalary: firstSalary || null, 
      jobMatchWithMajor: jobMatchWithMajor || null, 
      curriculumFeedback: curriculumFeedback || null, 
      universityName: universityName || null, 
      studyProgram: studyProgram || null, 
      fundingSource: fundingSource || null, 
      scholarshipSource: scholarshipSource || null, 
      graduationYear: graduationYear || null, 
      role: "ALUMNI", 
    };

    // Make sure graduationYear is valid (since it's notNull in the schema)
    if (!sanitizedData.graduationYear) {
      return NextResponse.json({ message: "Graduation Year is required" }, { status: 400 });
    }

    // Insert into the `users` table
    const userInsertResult = await db.insert(users).values({
      email,
      fullName,
      pictureUrl: "",  // Not required
      role: sanitizedData.role,  // Ensure role is set to ALUMNI
    }).returning();

    // Log the insert result for debugging
    console.log('User insert result:', userInsertResult);

    const userId = userInsertResult[0]?.id; // Ensure the ID is retrieved correctly
    if (!userId) {
      console.error("Error: User ID not returned");
      return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
    }

    // Log the role to ensure it's correct
    console.log("User Role: ", sanitizedData.role);

    // Only insert into the alumniProfiles table if the role is "ALUMNI"
    if (sanitizedData.role === "ALUMNI") {
      // Log the data to insert into alumni_profiles
      console.log("Inserting into alumni_profiles with data:", sanitizedData);

      // Validate required alumni profile fields
      if (!sanitizedData.nim || !sanitizedData.major || !sanitizedData.phone || !sanitizedData.address || !sanitizedData.jobStatus) {
        throw new Error("Missing required alumni profile fields.");
      }

      // Insert into alumniProfiles table
      await db.insert(alumniProfiles).values({
        userId: userId,
        nim: sanitizedData.nim, // Maps to nim
        graduationYear: sanitizedData.graduationYear, // Maps to graduationYear
      
        major: sanitizedData.major, // Maps to major
        phone: sanitizedData.phone, // Maps to phone
        address: sanitizedData.address, // Maps to address
        jobStatus: sanitizedData.jobStatus, // Maps to jobStatus
        currentCompany: sanitizedData.currentCompany, // Optional: Maps to currentCompany
        jobPosition: sanitizedData.jobPosition, // Optional: Maps to jobPosition
        jobWaitTime: sanitizedData.jobWaitTime, // Optional: Maps to jobWaitTime
        firstSalary: sanitizedData.firstSalary, // Optional: Maps to firstSalary
        jobMatchWithMajor: sanitizedData.jobMatchWithMajor, // Optional: Maps to jobMatchWithMajor
        curriculumFeedback: sanitizedData.curriculumFeedback, // Optional: Maps to curriculumFeedback
        universityName: sanitizedData.universityName, // Optional: Maps to universityName
        studyProgram: sanitizedData.studyProgram, // Optional: Maps to studyProgram
        fundingSource: sanitizedData.fundingSource, // Optional: Maps to fundingSource
        scholarshipSource: sanitizedData.scholarshipSource, // Optional: Maps to scholarshipSource
      });

      return NextResponse.json({ message: "User and alumni profile created successfully" }, { status: 201 });
    }

    return NextResponse.json({ message: "User created successfully but no alumni profile created (role mismatch)" }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Error creating user and profile", error: error.message }, { status: 500 });
  }
}

// export async function PUT(req: Request) {
//   const url = new URL(req.url);
//   const id = url.searchParams.get('id'); 
//   try {
//     const {
//       id,
//       userId,
//       nim,
//       graduationYear,
//       faculty,
//       major,
//       phone,
//       address,
//       jobStatus,
//       currentCompany,
//       jobPosition,
//       jobWaitTime,
//       firstSalary,
//       jobMatchWithMajor,
//       curriculumFeedback,
//       universityName,
//       studyProgram,
//       fundingSource,
//       scholarshipSource,
//     } = await request.json();

//     // Sanitize data: replace empty strings with null where applicable
//     const sanitizedData = {
//       userId,
//       nim: nim || null, // Ensure NIM is set to null if it's an empty string
//       graduationYear: graduationYear || null, // Ensure graduationYear is non-nullable, or set to null if empty
//       faculty: faculty || null,
//       major: major || null,
//       phone: phone || null,
//       address: address || null,
//       jobStatus: jobStatus || null,
//       currentCompany: currentCompany || null, // Optional, can be empty or null
//       jobPosition: jobPosition || null, // Optional, can be empty or null
//       jobWaitTime: jobWaitTime || null, // Optional, can be empty or null
//       firstSalary: firstSalary || null, // Optional, can be empty or null
//       jobMatchWithMajor: jobMatchWithMajor ?? null, // Ensure it is either a number or null
//       curriculumFeedback: curriculumFeedback || null, // Optional, can be empty or null
//       universityName: universityName || null, // Optional, can be empty or null
//       studyProgram: studyProgram || null, // Optional, can be empty or null
//       fundingSource: fundingSource || null, // Optional, can be empty or null
//       scholarshipSource: scholarshipSource || null, // Optional, can be empty or null
//     };

//     // Ensure graduationYear is not null or undefined
//     if (sanitizedData.graduationYear === null) {
//       return NextResponse.json({ message: "Graduation Year is required" }, { status: 400 });
//     }

//     // Update the alumni profile with sanitized data
//     const result = await db
//       .update(alumniProfiles)
//       .set(sanitizedData)
//       .where(eq(alumniProfiles.id, id));

//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json({ message: "Error updating alumni profile", error }, { status: 500 });
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     // Extract the query parameter 'id' from the URL
//     const url = new URL(request.url);
//     const id = url.searchParams.get("id"); // Use `.get()` to retrieve the query parameter

    // if (!id) {
    //   return NextResponse.json({ message: "ID is required" }, { status: 400 });
    // }

    // // Perform the delete operation
    // const result = await db.delete(alumniProfiles).where(eq(alumniProfiles.id, id));
    // return NextResponse.json({ message: "Alumni profile deleted successfully", result }, { status: 200 });
  // } catch (error) {
  //   return NextResponse.json({ message: "Error deleting alumni profile", error }, { status: 500 });
  // }
// }
