
import { companies, users } from "@/database/schema";
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request, 
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params; // Access id properly from context.params

    // Fetch data using the provided id
    const result = await db
      .select()
      .from(companies)
      .innerJoin(users, eq(users.id, companies.userId))
      .where(eq(companies.id, id)); // Retrieve company data based on the ID

    if (result.length === 0) {
      return NextResponse.json({ message: "Company profile not found" }, { status: 404 });
    }

    return NextResponse.json(result[0], { status: 200 }); // Return company data if found
  } catch (error) {
    console.error("Error retrieving company profile:", error);
    return NextResponse.json({ message: "Error retrieving company profile", error }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params; // Ambil id dari URL params
    const requestData = await request.json(); // Ambil data yang dikirimkan dalam request body

    // Sanitasi data: pastikan tidak ada nilai kosong atau undefined
    const sanitizedData = {
      industry: requestData.industry || null,
      address: requestData.address || null,
      contact: requestData.contact || null,
      companyDescription: requestData.companyDescription || null,
      hrdContact: requestData.hrdContact || null,
    };

    // Cek apakah data penting seperti industry dan address sudah diisi
    if (!sanitizedData.industry || !sanitizedData.address) {
      return NextResponse.json({ message: "Industry and address are required" }, { status: 400 });
    }

    // Update data perusahaan berdasarkan id
    const result = await db
      .update(companies)
      .set(sanitizedData) // Update data yang sudah disanitasi
      .where(eq(companies.id, id)) // Gunakan id dari params untuk mencari perusahaan
      .returning(); // Ambil hasil dari update

    if (result.length === 0) {
      return NextResponse.json({ message: "Company profile not found" }, { status: 404 });
    }

    // Jika update berhasil, kirim response sukses dengan data yang diperbarui
    return NextResponse.json({ message: "Company profile updated successfully", data: result[0] }, { status: 200 });
  } catch (error) {
    console.error('Error updating company profile:', error);
    return NextResponse.json({ message: "Error updating company profile", error: error.message }, { status: 500 });
  }
}

  
export async function DELETE(
    request: Request,
    context: { params: { id: string } }
  ) {
    try {
      // Step 1: Get the company using the provided ID
      const { id } = context.params;
  
      // Retrieve company details based on company ID
      const company = await db
        .select()
        .from(companies)
        .where(eq(companies.id, id))
        .limit(1); // Only one result should be found
  
      if (company.length === 0) {
        return NextResponse.json({ message: "Company not found" }, { status: 404 });
      }
  
      // Step 2: Get the userId from the company data
      const userId = company[0].userId;
  
      // Step 3: Delete the user from the users table
      const userResult = await db
        .delete(users)
        .where(eq(users.id, userId)) // Delete the user by userId
        .returning(); // Optionally return the deleted user for logging
  
      if (userResult.length === 0) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      // Step 4: Delete the company from the companies table
      const companyResult = await db
        .delete(companies)
        .where(eq(companies.id, id)); // Delete company by company ID
  
      if (companyResult.length === 0) {
        return NextResponse.json({ message: "Failed to delete company" }, { status: 500 });
      }
  
      // Step 5: Return success response
      return NextResponse.json({ message: "Company and associated user deleted successfully" }, { status: 200 });
  
    } catch (error) {
      console.error('Error deleting company:', error);
      return NextResponse.json({ message: "Error deleting company", error: error.message }, { status: 500 });
    }
}
  