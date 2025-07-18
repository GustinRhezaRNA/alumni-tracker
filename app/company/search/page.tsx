'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import LoadingSpinner from "@/components/LoadingSpinner";
import RatingForm from "@/components/RatingForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AlumniPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [alumniData, setAlumniData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlumniId, setSelectedAlumniId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    const getAlumniData = async () => {
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail: session.user?.email }), // Send userEmail from session
        });
        const data = await response.json();
        setAlumniData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching alumni:", error);
        setLoading(false);
      }
    };

    getAlumniData();
  }, [session, status, router]);

  const handleAddReview = (alumniId: string) => {
    setSelectedAlumniId(alumniId);
    setShowModal(true);
  };

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  const filteredAlumni = alumniData.filter((alumni) =>
    alumni.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="search" className='bg-[#001E80] min-h-screen flex flex-col items-center justify-center py-12'>
      <Button onClick={() => router.back()} className="absolute top-6 left-6 bg-white text-[#001E80] hover:bg-gray-100">
        ← Back
      </Button>

      <h1 className="text-3xl font-semibold text-white mb-6">Alumni Data</h1>

      <Card className='w-[80vw] max-w-3xl p-6 bg-white rounded-2xl shadow-md mb-6'>
        <div className="mb-8 items-center flex gap-2">
          <input
            type="text"
            placeholder="Search Alumni"
            className="p-2 rounded-lg border border-gray-300 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="h-10"> <FaSearch color="white" /></Button>
        </div>

        {filteredAlumni.map((alumni, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md flex justify-between border items-center mb-4"
          >
            <div>
              <h2 className="text-xl font-semibold">{alumni.user?.fullName}</h2>
              <p className="text-gray-600">
                Status: {alumni.alumni.jobStatus} <br />
                Study Program: {alumni.alumni.studyProgram} <br />
                Major: {alumni.alumni.major}
              </p>
            </div>
            <Button
              onClick={() => handleAddReview(alumni.alumni.id)}
              className={`px-4 py-2 rounded-lg ${
                alumni.hasReview
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-500 text-white"
              }`}
              disabled={!!alumni.hasReview} // Disable if hasReview is non-null
            >
              {alumni.hasReview ? "Reviewed" : "Fill Tracer"}
            </Button>
          </div>
        ))}

        {filteredAlumni.length === 0 && (
          <p className="text-gray-500 text-center">No alumni found.</p>
        )}
      </Card>

      {/* Modal Review */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="md:min-w-[900px] overflow-y-auto max-h-[80vh] p-2">
          <div>
            <DialogHeader>
              <DialogTitle>Review for Alumni</DialogTitle>
            </DialogHeader>
            <RatingForm
              alumniId={selectedAlumniId}
              onSubmitSuccess={() => {
                setShowModal(false);
                // Refetch alumni data to update review status
                const getAlumniData = async () => {
                  try {
                    const response = await fetch('/api/company/search', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ userEmail: session.user.email }),
                    });
                    const data = await response.json();
                    setAlumniData(data);
                  } catch (error) {
                    console.error("Error refetching alumni:", error);
                  }
                };
                getAlumniData();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlumniPage;