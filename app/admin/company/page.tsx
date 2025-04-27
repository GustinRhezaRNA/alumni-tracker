"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {  useRouter } from "next/navigation";

interface Company {
  companies: {
    id: string;
    industry: string;
    address: string;
    contact: string;
    companyDescription: string;
    hrdContact: string;
  };
  users: {
    fullName: string;
    email: string;
    pictureUrl: string;
  };
}

const CompanyPage = () => {
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const Router = useRouter();

  // Fetch company data from the API
  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/admin/company");
      const data = await response.json();
      setCompanyList(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setLoading(false);
    } 
  };

  useEffect(() => {
    fetchCompanies(); // Fetch data when the component is mounted
  }, []);

  // Handle add company action
  const handelAddCompany = () => {
    Router.push("/admin/company/new"); // Redirect to the add company page
  };

  // Handle delete action
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/company/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCompanyList(companyList.filter((company) => company.companies.id !== id)); // Remove the deleted company from the list
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  // Handle update action
  const handleUpdate = (id: string) => {
    Router.push(`/admin/company/edit/${id}`);
  };

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Company Data</h2>
        <Button onClick={handelAddCompany} className="bg-[#2bff00] hover:bg-[#25d900] text-black">Add Company</Button>
      </div>

      {loading ? (
        <div>Loading...</div> 
      ) : (
        companyList.map((company) => (
          <Card key={company.companies.id} className="p-6 border rounded-lg mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold mb-4">{company.companies.industry}</h3>
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Contact: </span>
                    {company.companies.contact}
                  </p>
                  <p>
                    <span className="font-medium">Address: </span>
                    {company.companies.address}
                  </p>
                  <p>
                    <span className="font-medium">Company Description: </span>
                    {company.companies.companyDescription}
                  </p>
                  <p>
                    <span className="font-medium">HRD Contact: </span>
                    {company.companies.hrdContact}
                  </p>
                  <p>
                    <span className="font-medium">User: </span>
                    {company.users.fullName} ({company.users.email})
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-[#ffe500] hover:bg-[#e6cf00] text-black"
                  onClick={() => handleUpdate(company.companies.id)}
                >
                  Update
                </Button>
                <Button
                  className="bg-[#ff0000] hover:bg-[#cc0000] text-white"
                  onClick={() => handleDelete(company.companies.id)}
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

export default CompanyPage;
