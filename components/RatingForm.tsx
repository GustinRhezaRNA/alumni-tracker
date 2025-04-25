"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { HARD_SKILLS, SOFT_SKILLS, PRODUCTIVITY } from "@/constants/riview";
import { IoClose } from "react-icons/io5";

interface RatingFormProps {
    alumniId: string | null;
    onSubmitSuccess: () => void;
}

const RatingForm: React.FC<RatingFormProps> = ({ alumniId, onSubmitSuccess }) => {
    const [hardSkills, setHardSkills] = useState({ H1: 1, H2: 1, H3: 1 });
    const [softSkills, setSoftSkills] = useState({ S1: 1, S2: 1, S3: 1, S4: 1, S5: 1 });
    const [productivity, setProductivity] = useState({ P1: 1, P2: 1, P3: 1 });
    const [reviewText, setReviewText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [companyId, setCompanyId] = useState<string | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchCompany = async () => {
            if (session?.user?.email) {
                try {
                    const res = await fetch(`/api/company?email=${session.user.email}`);
                    const data = await res.json();
                    setCompanyId(data?.company?.id);
                    console.log("Company ID:", data?.company?.id);
                } catch (err) {
                    console.error("Gagal mengambil company:", err);
                }
            }
        };
        fetchCompany();
    }, [session]);

    const submitReview = async () => {
        console.log("Submitting review...", { companyId, alumniId, reviewText, hardSkills, softSkills, productivity });
        try {
            setIsSubmitting(true);
            const response = await fetch("/api/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    companyId,
                    alumniId,
                    reviewText,
                    hardSkills,
                    softSkills,
                    productivity
                }),
            });

            if (!response.ok) {
                throw new Error("Gagal mengirim review");
            }

            setSubmitted(true);
        } catch (error) {
            console.error("Error submitting review:", error);
        }
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
        <div className="p-10 bg-white rounded-2xl shadow-md w-full mx-auto text-black relative">
            <button
                onClick={() => onSubmitSuccess()}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                aria-label="Close"
            >
                <IoClose size={40} />
            </button>
            <h1 className="text-2xl font-semibold text-center mb-6 text-black">Alumni Rating Form</h1>
            {/* Hard Skills */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-black">Hard Skills</h2>
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
                <h2 className="text-xl font-semibold mb-2 text-black">Soft Skills</h2>
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
                <h2 className="text-xl font-semibold mb-2 text-black">Produktivitas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(PRODUCTIVITY).map(([key, label]) =>
                        renderSelect(key, label, productivity[key as keyof typeof productivity], (e, k) =>
                            setProductivity((prev) => ({ ...prev, [k]: parseInt(e.target.value) }))
                        )
                    )}
                </div>
            </div>

            {/* Review Text */}
            <div className="mb-6">
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
            <div className="flex justify-end">
                <button
                    onClick={submitReview}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl mt-6"
                    disabled={isSubmitting || submitted}
                >
                    {submitted ? "Review Terkirim" : isSubmitting ? "Mengirim..." : "Kirim Review"}
                </button>
            </div>
        </div>
    );
};

export default RatingForm;
