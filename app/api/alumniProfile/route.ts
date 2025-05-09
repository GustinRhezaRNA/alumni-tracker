// app/api/alumniProfile/[userEmail]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/database/drizzle'; // Pastikan path benar
import { eq } from 'drizzle-orm';
import { alumniProfiles, users } from '@/database/schema'; // Pastikan path benar

export async function POST(req: Request) {
    try {
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

        // Ambil profil dari alumniProfiles berdasarkan userId
        const profile = await db
            .select()
            .from(alumniProfiles)
            .where(eq(alumniProfiles.userId, user[0].id))
            .limit(1);

        // Jika profil ditemukan, kirimkan response
        if (profile.length === 0) {
            return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
        }

        return NextResponse.json(profile[0], { status: 200 });
    } catch (error) {
        // Tangani error jika ada
        return NextResponse.json({ message: `Error fetching profile: ${error}` }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        // Ambil data dari request body
        const {
            userEmail,
            nim,
            graduationYear,
            major,
            phone,
            address,
            jobStatus,
            universityName,
            studyProgram,
            fundingSource,
            scholarshipSource,
            currentCompany,
            jobPosition,
            jobWaitTime,
            firstSalary,
            jobMatchWithMajor,
            curriculumFeedback
        } = await req.json();

        // Validasi input
        if (!userEmail || !nim || !graduationYear || !major || !phone || !address || !jobStatus) {
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

        // Tentukan nilai untuk field terkait berdasarkan status pekerjaan
        let updatedData = {
            nim,
            graduationYear,
        
            major,
            phone,
            address,
            jobStatus,
            universityName,
            studyProgram,
            fundingSource,
            scholarshipSource,
            currentCompany: jobStatus === "Bekerja" ? currentCompany : null, // Set null if not applicable
            jobPosition: jobStatus === "Bekerja" ? jobPosition : null,
            jobWaitTime: jobStatus === "Bekerja" ? jobWaitTime : null,  // Set null if not applicable
            firstSalary: jobStatus === "Bekerja" ? firstSalary : null, // Set null if not applicable
            jobMatchWithMajor: jobStatus === "Bekerja" ? jobMatchWithMajor : 0, // Default to 0 if not applicable
            curriculumFeedback
        };

        // Jika status pekerjaan bukan 'Bekerja', kosongkan field terkait pekerjaan
        if (jobStatus === "Tidak Bekerja") {
            updatedData = {
                ...updatedData,
                currentCompany: '',
                jobPosition: '',
                jobWaitTime: null, // Set null for empty field
                firstSalary: null, 
                jobMatchWithMajor: 0, // Default to 0
                curriculumFeedback: ''
            };
        }

        // Jika status pekerjaan adalah 'Bekerja', hapus field yang terkait dengan 'Studi'
        if (jobStatus === 'Bekerja') {
            updatedData = {
                ...updatedData, 
                universityName: '',
                studyProgram: '',
                fundingSource: '',
                scholarshipSource: ''
            };
        }

        // Update profil berdasarkan userId
        const updatedProfile = await db
            .update(alumniProfiles)
            .set(updatedData)
            .where(eq(alumniProfiles.userId, user[0].id));

        // Periksa apakah ada baris yang diupdate
        if (updatedProfile.rowCount === 0) {
            return NextResponse.json({ message: 'Profile not found or no changes made' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });

    } catch (error) {
        // Tangani error
        return NextResponse.json({ message: `Error updating profile: ${error}` }, { status: 500 });
    }
}


