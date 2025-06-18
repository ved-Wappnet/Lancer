"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { usdFormat } from "@/utils/helperFunctions";
import { useGetContractsQuery } from '@/services/contractApi';
import Loader from "@/components/ui/loader";
import ContractDetailsModal from "@/components/ContractDetailsModal";
import { useState } from "react";

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    active: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusConfig[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const FreelancerContractsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any | null>(null);
  const router = useRouter();
  const user = useSelector((state: any) => state.auth.user);

  // Fetch contracts for freelancer from API
  const { data, isLoading, isError } = useGetContractsQuery({ role: 'freelancer', userId: user?.id });
  const contracts = data?.data || [];


  return (
    <>
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm border p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Contracts</h1>
        {isLoading ? (
            <Loader/> 
        ) : isError ? (
          <div className="py-12 text-center text-red-500">Failed to load contracts.</div>
        ) : contracts.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">No contracts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-50 text-muted-foreground">
                  <th className="py-3 px-4 font-medium text-left">Project</th>
                  <th className="py-3 px-4 font-medium text-left">Client</th>
                  <th className="py-3 px-4 font-medium text-left">Amount</th>
                  <th className="py-3 px-4 font-medium text-left">Status</th>
                  <th className="py-3 px-4 font-medium text-left">Created At</th>
                  <th className="py-3 px-4 font-medium text-left">Updated At</th>
                  <th className="py-3 px-4 font-medium text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract: any) => (
                  <tr key={contract.id} className="border-b last:border-0">
                    <td className="py-3 px-4 font-semibold">
                      {contract.bid?.project?.title || "Untitled Project"}
                      <div className="text-xs text-muted-foreground">
                        {contract.bid?.project?.budget ? usdFormat(contract.bid.project.budget) : "-"} budget
                      </div>
                    </td>
                    <td className="py-3 px-4">{contract.client?.name || "-"}</td>
                    <td className="py-3 px-4">{usdFormat(contract.amount)}</td>
                    <td className="py-3 px-4">{getStatusBadge(contract.status)}</td>
                    <td className="py-3 px-4">{contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : "-"}</td>
                    <td className="py-3 px-4">{contract.updatedAt ? new Date(contract.updatedAt).toLocaleDateString() : "-"}</td>
                    <td className="py-3 px-4">
                      <button
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                        onClick={() => { setSelectedContract(contract); setModalOpen(true); }}
                        aria-label="View Contract"
                      >
                        {/* Eye icon from lucide-react */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M1.458 12C2.732 7.943 6.522 5 12 5c5.478 0 9.268 2.943 10.542 7-1.274 4.057-5.064 7-10.542 7-5.478 0-9.268-2.943-10.542-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
      <ContractDetailsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        contract={selectedContract}
        role="freelancer"
      />
    </>
  );
};

export default FreelancerContractsPage;
