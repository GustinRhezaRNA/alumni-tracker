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
      industry,
      address,
      contact,
      companyDescription,
      hrdContact,
      userId,
    } = await request.json();

    const result = await db.insert(companies).values({
      industry,
      address,
      contact,
      companyDescription,
      hrdContact,
      userId,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating company", error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const {
      id,
      industry,
      address,
      contact,
      companyDescription,
      hrdContact,
      userId,
    } = await request.json();

    const result = await db
      .update(companies)
      .set({
        industry,
        address,
        contact,
        companyDescription,
        hrdContact,
        userId,
      })
      .where(eq(companies.id, id));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating company", error }, { status: 500 });
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
    const result = await db.delete(companies).where(eq(companies.id, id));
    return NextResponse.json({ message: "Company deleted successfully", result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting company", error }, { status: 500 });
  }
}
