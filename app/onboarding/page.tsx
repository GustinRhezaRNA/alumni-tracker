"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { alumniFields, companyFields } from "@/constants/roles";
import { createUserAndProfile } from "../services/onboardingService";
import { useSession } from "next-auth/react";

enum Role {
    ALUMNI = "ALUMNI",
    COMPANY = "COMPANY",
  }

const InputField = ({ label, type, value, placeholder, onChange }) => (
    <div>
        <label className="text-gray-600">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="border p-2 mb-4 w-full rounded-md bg-gray-200"
        />
    </div>
);

const SelectField = ({ label, value, options, onChange }) => (
    <div>
        <label className="text-gray-600">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="border p-2 mb-4 w-full rounded-md bg-gray-200"
        >
            <option value="" disabled>Pilih {label}</option>
            {options.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

const OnboardingPage = () => {



    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const userData = searchParams.get("data") ? JSON.parse(decodeURIComponent(searchParams.get("data")!)) : {};

    const [formData, setFormData] = useState<any>(userData);
    const [role, setRole] = useState<string>("");

    useEffect(() => {
        if (status === "authenticated") {
            // Redirect user if role is set correctly
            if (session?.user?.role === "ALUMNI") {
                router.push("/alumni");
            } else if (session?.user?.role === "COMPANY") {
                router.push("/company");
            }
        }
    }, [status, session, router]);

    const handleInputChange = (field: string, value: any) => {
        // Check the field type and convert accordingly
        if (field === 'graduationYear' || field === 'jobMatchWithMajor') {
            // Convert to number for these fields
            value = parseInt(value, 10);
        } else if (field === 'jobWaitTime' || field === 'firstSalary') {
            // Ensure these remain strings (optional if you're using select fields)
            value = value.trim();
        }

        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {

        if (formData.role === '') {
            alert("Role tidak boleh kosong!");
            return;
          }
        const result = await createUserAndProfile(formData);
        console.log(formData);
        console.log("Result:", result);
        if (result.success) {
            console.log(result);
            if (formData.role === "ALUMNI") {
                router.push("/alumni");
            } else if (formData.role === "COMPANY") {
                router.push("/company");
            }

        };
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#001E80] py-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">Onboarding</h2>
            <div className="p-8 bg-white rounded-2xl shadow-lg w-full max-w-[1000px]">
                <div className="flex items-center mb-6 space-x-4">
                    <Image src={formData.pictureUrl || ""} alt="Profile" width={80} height={80} className="rounded-full" />
                    <div className="flex flex-col w-full">
                        <InputField label="Full Name" type="text" value={formData.fullName || ""} placeholder="Masukkan nama lengkap" onChange={(e) => handleInputChange('fullName', e.target.value)} />
                        <InputField label="Email" type="email" value={formData.email || ""} placeholder="" onChange={() => { }} />
                    </div>
                </div>

                <SelectField
                    label="Role"
                    value={role}
                    options={[Role.ALUMNI, Role.COMPANY]}
                    onChange={(e) => {
                        setRole(e.target.value);
                        setFormData((prev: any) => ({
                            ...prev, role: e.target.value
                        })); // Update formData with selected role
                    }}
                />

                {role === "ALUMNI" && alumniFields.map((field, index) => (
                    !field.condition || formData.jobStatus === field.condition ? (
                        field.type === "select" ? (
                            <SelectField
                                key={index}
                                label={field.label}
                                value={formData[field.fieldName] || ""}
                                options={field.options || []}
                                onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
                            />
                        ) : (
                            <InputField
                                key={index}
                                label={field.label}
                                type={field.type}
                                value={formData[field.fieldName] || ""}
                                placeholder={field.placeholder}
                                onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
                            />
                        )
                    ) : null
                ))}

                {role === "COMPANY" && companyFields.map((field, index) => (
                    <InputField
                        key={index}
                        label={field.label}
                        type={field.type}
                        value={formData[field.fieldName] || ""}
                        placeholder={field.placeholder}
                        onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
                    />
                ))}

                
                <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md w-full">
                    Complete Onboarding
                </button>
            </div>
        </div>
    );
};

export default OnboardingPage;
