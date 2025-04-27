/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { alumniProfiles } from "@/database/schema";
import { companies } from "@/database/schema";

export const createUserAndProfile = async (userData: any) => {
  try {
    // Insert into the `users` table
    const userInsertResult = await db.insert(users).values({
      fullName: userData.fullName,
      email: userData.email,
      pictureUrl: userData.pictureUrl,
      role: userData.role,
    }).returning();

    const userId = userInsertResult[0]?.id;
    if (!userId) {
      console.error("Error: User ID not returned");
      return { success: false, error: "User ID missing" };
    }

    // Log the role to ensure it's correct
    console.log("User Role: ", userData.role);  

    // Insert into `alumni_profiles` or `companies` based on role
    if (userData.role === "ALUMNI") {
      // Log the data to insert into alumni_profiles
      console.log("Inserting into alumni_profiles with data:", userData);

      if (!userData.nim || !userData.major || !userData.phone || !userData.address || !userData.jobStatus) {
        throw new Error("Missing required alumni profile fields.");
      }

      // Insert into alumniProfiles table
      await db.insert(alumniProfiles).values({
        userId: userId,
        nim: userData.nim, // Maps to nim
        graduationYear: userData.graduationYear, // Maps to graduationYear
        faculty: userData.faculty, // Maps to faculty
        major: userData.major, // Maps to major
        phone: userData.phone, // Maps to phone
        address: userData.address, // Maps to address
        jobStatus: userData.jobStatus, // Maps to jobStatus
        currentCompany: userData.currentCompany || "", // Optional: Maps to currentCompany
        jobPosition: userData.jobPosition || "", // Optional: Maps to jobPosition
        jobWaitTime: userData.jobWaitTime || "", // Optional: Maps to jobWaitTime
        firstSalary: userData.firstSalary || "", // Optional: Maps to firstSalary
        jobMatchWithMajor: userData.jobMatchWithMajor || null, // Optional: Maps to jobMatchWithMajor
        curriculumFeedback: userData.curriculumFeedback || "", // Optional: Maps to curriculumFeedback
        universityName: userData.universityName || "", // Optional: Maps to universityName
        studyProgram: userData.studyProgram || "", // Optional: Maps to studyProgram
        fundingSource: userData.fundingSource || "", // Optional: Maps to fundingSource
        scholarshipSource: userData.scholarshipSource || "", // Optional: Maps to scholarshipSource
      });

    } else if (userData.role === "COMPANY") {
      // Log the data to insert into companies
      console.log("Inserting into companies with data:", userData);

      if (!userData.contact || !userData.industry || !userData.address) {
        throw new Error("Missing required company fields.");
      }

      // Insert into companies table
      await db.insert(companies).values({
        userId: userId,
        industry: userData.industry, // Maps to industry
        address: userData.address, // Maps to address
        contact: userData.contact, // Maps to contact
        companyDescription: userData.companyDescription || "", // Optional: Maps to companyDescription
        hrdContact: userData.hrdContact || "", // Optional: Maps to hrdContact
      });
    }

    return { success: true, userId };
  } catch (error) {
    if (error instanceof Error) {
        console.error("Error during user and profile insertion:", error.message);
        return { success: false, error: error.message };
    } else {
        console.error("Unknown error:", error);
        return { success: false, error: "An unknown error occurred" };
    }
  }
};
