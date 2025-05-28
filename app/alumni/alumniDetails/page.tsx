'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { alumniFields } from '@/constants/roles';
import LoadingSpinner from '@/components/LoadingSpinner';

interface FormData {
  nim: string;
  graduationYear: string;
  major: string;
  phone: string;
  address: string;
  jobStatus: string;
  currentCompany: string;
  jobPosition: string;
  jobWaitTime: string;
  firstSalary: string;
  jobMatchWithMajor: string;
  curriculumFeedback: string;
  universityName: string;
  studyProgram: string;
  fundingSource: string;
  scholarshipSource: string;
  [key: string]: string;
}

const AlumniDetails = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    const getAlumniProfile = async (userEmail: string) => {
      const response = await fetch('/api/alumniProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail }),
      });

      const data = await response.json();
      setProfileData(data);
      setLoading(false);
    };

    getAlumniProfile(session.user?.email as string);
  }, [session, status, router]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        nim: profileData.nim,
        graduationYear: profileData.graduationYear,
        major: profileData.major,
        phone: profileData.phone,
        address: profileData.address,
        jobStatus: profileData.jobStatus,
        currentCompany: profileData.currentCompany || '',
        jobPosition: profileData.jobPosition || '',
        jobWaitTime: profileData.jobWaitTime || '',
        firstSalary: profileData.firstSalary || '',
        jobMatchWithMajor: profileData.jobMatchWithMajor || '',
        curriculumFeedback: profileData.curriculumFeedback || '',
        universityName: profileData.universityName,
        studyProgram: profileData.studyProgram,
        fundingSource: profileData.fundingSource,
        scholarshipSource: profileData.scholarshipSource,
      });
    }
  }, [profileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { userEmail: session?.user?.email, ...formData };
    console.log('Form submitted:', submitData);

    const response = await fetch('/api/alumniProfile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submitData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Profile updated successfully!');
      router.push('/alumni');
    } else {
      alert('Failed to update profile: ' + data.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <form
      id="alumniProfile"
      onSubmit={handleSubmit}
      className="bg-[#001E80] min-h-screen flex flex-col items-center justify-center py-12"
    >
      <Card className="w-[80vw] max-w-3xl p-6 bg-white rounded-2xl shadow-md mb-6">
        <h1 className="text-3xl font-semibold text-[#333]">Alumni Profile</h1>

        {alumniFields.map((field) => {
          if (
            (field.condition && field.condition !== formData.jobStatus) ||
            (field.dependentCondition && field.dependentCondition !== formData.fundingSource)
          ) {
            return null;
          }

          if (field.fieldName === 'graduationYear') {
            const currentYear = new Date().getFullYear();
            const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - i);

            return (
              <div key={field.fieldName} className="mt-4">
                <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-600">
                  Graduation Year
                </label>
                <select
                  name="graduationYear"
                  value={formData.graduationYear || ''}
                  onChange={(e) => handleSelectChange('graduationYear', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select year</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (field.fieldName === 'major') {
            const majorOptions = ['Computer Science and Engineering', 'Information Technology', 'Informatics'];

            return (
              <div key={field.fieldName} className="mt-4">
                <label htmlFor="major" className="block text-sm font-medium text-gray-600">
                  Major
                </label>
                <select
                  name="major"
                  value={formData.major || ''}
                  onChange={(e) => handleSelectChange('major', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Major</option>
                  {majorOptions.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          return (
            <div key={field.fieldName} className="mt-4">
              <label htmlFor={field.fieldName} className="block text-sm font-medium text-gray-600">
                {field.label}:
              </label>
              {field.type === 'select' ? (
                <select
                  name={field.fieldName}
                  value={formData[field.fieldName] || ''}
                  onChange={(e) => handleSelectChange(field.fieldName, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {field.options?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  type={field.type || 'text'}
                  name={field.fieldName}
                  value={formData[field.fieldName] || ''}
                  onChange={handleInputChange}
                  placeholder={field.placeholder || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              )}
            </div>
          );
        })}

        <div className="flex gap-4 justify-end mt-4">
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
            Save Changes
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default AlumniDetails;