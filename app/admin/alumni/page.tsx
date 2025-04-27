"use client";

import React, { useEffect, useState } from "react";
import { Button} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
interface Alumni {
  alumni_profiles: {
    id: string;
    nim: string;
    graduationYear: number;
    faculty: string;
    major: string;
    jobStatus: string;
    currentCompany: string;
    jobPosition: string;
    universityName: string;
    studyProgram: string;
  };
  users: {
    fullName: string;
    email: string;
    pictureUrl: string;
  };
}

const AlumniPage = () => {
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const Router = useRouter();

  // Fetch alumni data from the API
  const fetchAlumni = async () => {
    try {
      const response = await fetch("/api/admin/alumni");
      const data = await response.json();
      setAlumniList(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching alumni:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  //handle redirect add alumni
  const handleAddAlumni = () => {
    Router.push("/admin/alumni/new"); 
  };

  // Handle delete action
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/alumni/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        const result = await response.json(); // Get the response after deletion
        if (result.message === "Alumni profile deleted successfully") {
          // Filter out the deleted alumni from the list
          setAlumniList(alumniList.filter((alumni) => alumni.alumni_profiles.id !== id));
        }
      }
    } catch (error) {
      console.error("Error deleting alumni:", error);
    }
  };
  

  // Handle update action
  const handleUpdate = (id: string) => {
    Router.push(`/admin/alumni/edit/${id}`);
    console.log("Update alumni with ID:", id);
  };

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Alumni Data</h2>
        <Button onClick={handleAddAlumni} className="bg-[#2bff00] hover:bg-[#25d900] text-black">Add Alumni</Button>
      </div>

      {loading ? (
        <div>Loading...</div> 
      ) : (
        alumniList.map((alumni) => (
          <Card key={alumni.alumni_profiles.id} className="p-6 border rounded-lg mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold mb-4">{alumni.users.fullName}</h3>
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Status: </span>
                    {alumni.alumni_profiles.jobStatus}
                  </p>
                  <p>
                    <span className="font-medium">Study Program: </span>
                    {alumni.alumni_profiles.studyProgram}
                  </p>
                  <p>
                    <span className="font-medium">Major: </span>
                    {alumni.alumni_profiles.major}
                  </p>
                  <p>
                    <span className="font-medium">Email: </span>
                    {alumni.users.email}
                  </p>
                  <p>
                    <span className="font-medium">University: </span>
                    {alumni.alumni_profiles.universityName}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-[#ffe500] hover:bg-[#e6cf00] text-black"
                  onClick={() => handleUpdate(alumni.alumni_profiles.id)}
                >
                  Update
                </Button>
                <Button
                  className="bg-[#ff0000] hover:bg-[#cc0000] text-white"
                  onClick={() => handleDelete(alumni.alumni_profiles.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
  
export default AlumniPage;
