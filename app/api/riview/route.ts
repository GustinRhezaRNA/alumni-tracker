// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle"; 
import { reviews } from "@/database/schema";

export async function POST(req: Request) {
  const body = await req.json();

  const { companyId, alumniId, rating, reviewText } = body;

  try {
    await db.insert(reviews).values({
      companyId,
      alumniId,
      rating: Math.round(rating), // kalau mau dibulatkan
      reviewText,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Insert failed:", error);
    return NextResponse.json({ error: "Gagal menyimpan review" }, { status: 500 });
  }
}
