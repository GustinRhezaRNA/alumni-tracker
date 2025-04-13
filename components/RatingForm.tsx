"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const HARD_SKILLS = {
    H1: "Keahlian Teknis",
    H2: "Kemampuan Problem Solving",
    H3: "Penguasaan Tools",
};

const SOFT_SKILLS = {
    S1: "Komunikasi",
    S2: "Kerjasama",
    S3: "Disipilin",
    S4: "Kreativitas",
    S5: "Adaptasi",
};

const PRODUCTIVITY = {
    P1: "Tepat waktu",
    P2: "Kualitas",
    P3: "Kemandirian",
};

const RatingForm = () => {
    const [hardSkills, setHardSkills] = useState({ H1: 1, H2: 1, H3: 1 });
    const [softSkills, setSoftSkills] = useState({ S1: 1, S2: 1, S3: 1, S4: 1, S5: 1 });
    const [productivity, setProductivity] = useState({ P1: 1, P2: 1, P3: 1 });
    const [averageScore, setAverageScore] = useState<number | null>(null);
    const [reviewText, setReviewText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [companyId, setCompanyId] = useState<string | null>(null);
    const { data: session } = useSession();
    const alumniId = "22222222-2222-2222-2222-222222222222";


    useEffect(() => {
        const fetchCompany = async () => {
          if (session?.user?.email) {
            try {
              const res = await fetch(`/api/company/by-user?email=${session.user.email}`);
              const data = await res.json();
              setCompanyId(data?.company?.id); // pastikan API-mu mengembalikan `{ company: { id: ... } }`
            } catch (err) {
              console.error("Gagal mengambil company:", err);
            }
          }
        };
      
        fetchCompany();
      }, [session]);

    const submitReview = async () => {
        try {
            setIsSubmitting(true);
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    companyId,
                    alumniId,
                    rating: averageScore,
                    reviewText,
                }),
            });

            if (!response.ok) {
                throw new Error("Gagal mengirim review");
            }

            setSubmitted(true);
        } catch (error) {
            console.error("Error submitting review:", error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const calculateAverage = () => {
        const allValues = [
            ...Object.values(hardSkills),
            ...Object.values(softSkills),
            ...Object.values(productivity),
        ];
        const total = allValues.reduce((acc, val) => acc + val, 0);
        const average = total / allValues.length;
        setAverageScore(average);
    };

    const renderSelect = (
        skillKey: string,
        label: string,
        value: number,
        onChange: (e: React.ChangeEvent<HTMLSelectElement>, key: string) => void
    ) => (
        <div key={skillKey}>
            <label className="block font-medium mb-1 text-black">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e, skillKey)}
                className="p-2 rounded-lg border border-gray-300 w-full text-black"
            >
                {[1, 2, 3, 4, 5].map((i) => (
                    <option key={i} value={i}>
                        {i}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="p-8 bg-white rounded-2xl shadow-md w-full max-w-3xl mx-auto text-black">
            <h1 className="text-2xl font-semibold text-center mb-6 text-black">Alumni Rating Form</h1>

            {/* Hard Skills */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-black">Hard Skills</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(HARD_SKILLS).map(([key, label]) =>
                        renderSelect(key, label, hardSkills[key as keyof typeof hardSkills], (e, k) =>
                            setHardSkills((prev) => ({ ...prev, [k]: parseInt(e.target.value) }))
                        )
                    )}
                </div>
            </div>

            {/* Soft Skills */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-black">Soft Skills</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(SOFT_SKILLS).map(([key, label]) =>
                        renderSelect(key, label, softSkills[key as keyof typeof softSkills], (e, k) =>
                            setSoftSkills((prev) => ({ ...prev, [k]: parseInt(e.target.value) }))
                        )
                    )}
                </div>
            </div>

            {/* Productivity */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-black">Produktivitas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(PRODUCTIVITY).map(([key, label]) =>
                        renderSelect(key, label, productivity[key as keyof typeof productivity], (e, k) =>
                            setProductivity((prev) => ({ ...prev, [k]: parseInt(e.target.value) }))
                        )
                    )}
                </div>
            </div>

            {/* Calculate Button */}
            <div className="flex justify-end">
                <button
                    onClick={calculateAverage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition"
                >
                    Hitung Rata-rata
                </button>
            </div>

            {/* Result */}
            {/* Result */}
            {averageScore !== null && (
                <div className="mt-6 bg-gray-100 p-4 rounded-lg text-black space-y-4">
                    <p className="text-lg">
                        <strong>Skor Rata-rata:</strong> {averageScore.toFixed(2)} / 5.00
                    </p>

                    {/* Textarea review */}
                    <div>
                        <label className="block font-semibold mb-1 text-black">Review untuk Alumni</label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={4}
                            placeholder="Tuliskan ulasan Anda..."
                            className="w-full p-3 border rounded-lg text-black"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={submitReview}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
                        disabled={isSubmitting || submitted}
                    >
                        {submitted ? "Review Terkirim" : isSubmitting ? "Mengirim..." : "Kirim Review"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default RatingForm;
