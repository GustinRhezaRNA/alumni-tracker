import { companies, users } from "@/database/schema";
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle"; // Pastikan path benar
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // Ambil data perusahaan beserta informasi pengguna yang terkait
    const result = await db
      .select()
      .from(companies)
      .innerJoin(users, eq(users.id, companies.userId)); // Menggunakan inner join untuk gabungkan data

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error retrieving companies", error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const {
      fullName,
      email,
      industry,
      address,
      contact,
      companyDescription,
      hrdContact,
    } = await request.json();

    // Validasi jika data yang diperlukan tidak kosong
    if (!fullName || !email || !industry || !address || !contact || !companyDescription || !hrdContact) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Menambahkan data ke dalam tabel users terlebih dahulu
    const userInsertResult = await db.insert(users).values({
      email,
      fullName,
      pictureUrl: "", 
      role: "COMPANY",
    }).returning();

    // Mendapatkan userId dari hasil insert
    const userId = userInsertResult[0]?.id;
    if (!userId) {
      console.error("Error: User ID not returned");
      return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
    }

    // Memasukkan data perusahaan setelah mendapatkan userId
    const companyInsertResult = await db.insert(companies).values({
      userId, // Mengaitkan perusahaan dengan pengguna
      industry,
      address,
      contact,
      companyDescription,
      hrdContact,
    });

    return NextResponse.json({ message: "Company created successfully", company: companyInsertResult }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json({ message: "Error creating company", error: error.message }, { status: 500 });
  }
}

