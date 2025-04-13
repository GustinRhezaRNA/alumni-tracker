// app/api/alumniProfile/[userEmail]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/database/drizzle'; // Pastikan path benar
import { eq } from 'drizzle-orm';
import { companies, users } from '@/database/schema'; // Pastikan path benar

export async function POST(req: Request) {
    try {
        // Ambil data userEmail dari request body
        const { userEmail } = await req.json(); 

        if (!userEmail) {
            return NextResponse.json({ message: 'userEmail is required' }, { status: 400 });
        }

        // Cari user berdasarkan email
        const user = await db   
            .select()
            .from(users)
            .where(eq(users.email, userEmail))
            .limit(1);

        if (user.length === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Ambil profil perusahaan berdasarkan userId
        const profile = await db
            .select()
            .from(companies)
            .where(eq(companies.userId, user[0].id))
            .limit(1);

        // Jika profil ditemukan, kirimkan response
        if (profile.length === 0) {
            return NextResponse.json({ message: 'Company profile not found' }, { status: 404 });
        }

        // Kembalikan data profil perusahaan
        return NextResponse.json(profile[0], { status: 200 });
    } catch (error) {
        // Tangani error jika ada
        return NextResponse.json({ message: `Error fetching company profile: ${error}` }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        // Ambil data dari request body
        const {
            userEmail,
            industry,
            address,
            contact,
            companyDescription,
            hrdContact
        } = await req.json();

        // Validasi input
        if (!userEmail || !industry || !address || !contact || !hrdContact) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Cari user berdasarkan email
        const user = await db
            .select()
            .from(users)
            .where(eq(users.email, userEmail))
            .limit(1);

        if (user.length === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Update profil perusahaan berdasarkan userId
        const updatedProfile = await db
            .update(companies)
            .set({
                industry,
                address,
                contact,
                companyDescription,
                hrdContact
            })
            .where(eq(companies.userId, user[0].id));

        // Periksa apakah ada baris yang diupdate
        if (updatedProfile.rowCount === 0) {
            return NextResponse.json({ message: 'Profile not found or no changes made' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });

    } catch (error) {
        // Tangani error
        return NextResponse.json({ message: `Error updating company profile: ${error}` }, { status: 500 });
    }
}



