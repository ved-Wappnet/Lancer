
'use client';

import React from 'react'
import { useSelector } from 'react-redux';
import { DollarSign, Clock, Calendar, User as UserIcon, Timer } from "lucide-react";
import { useRouter } from 'next/navigation';

import { timeAgo, usdFormat } from '@/utils/helperFunctions';
import Loader from '@/components/ui/loader';
import { useGetBidsQuery } from '@/services/bidApi';
import { useGetProjectsQuery } from '@/services/projectApi';



const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'accepted': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};



const ClientBidsPage = () => {  
  const router = useRouter();
  const { data, isLoading, error } = useGetBidsQuery();
  const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery();
  const user = useSelector((state: any) => state.auth.user);

  // Extract bids and projects
  const bids: any[] = Array.isArray(data?.data)
    ? data.data.map((item: any) => (item.bid ? item.bid : item))
    : [];
  const projects = Array.isArray(projectsData) ? projectsData : [];

  // Map for quick project lookup
  const projectMap = new Map<number, any>(projects.map((p: any) => [p.id, p]));

  const handleAccept = (bidId: number) => {
    router.push(`/dashboard/client/contracts/create/${bidId}`);
  };

  const handleReject = (bidId: number) => {
    alert(`Reject bid ${bidId}`);
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Received Bids</h1>
        {isLoading || projectsLoading ? (
          <Loader/>
        ) : bids.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">No bids received on your projects yet.</div>
        ) : (
          <div className="space-y-8">
            {bids.map((bid: any) => {
              const project = projectMap.get(Number(bid.projectId));

              return (
                <div key={bid.id} className="border rounded-lg p-6 flex flex-col gap-2 relative bg-card shadow-sm">
                  {/* Project info */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                    <div>
                      <div className="font-semibold text-base truncate">{project?.title || 'Untitled Project'}</div>
                      <div className="text-xs text-muted-foreground">{project?.budget ? usdFormat(project.budget) : '-'} budget</div>
                    </div>
                    <div className="absolute top-6 right-6">
                      {getStatusBadge(bid?.status)}
                    </div>
                  </div>
                  {/* Bid details */}
                  <div className="flex flex-wrap flex-col sm:flex-row gap-4 items-center text-sm my-2">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <DollarSign className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="font-medium">{usdFormat(bid.amount).replace(/^\$/, '')}</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-[110px]">
                      <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                      <span>{bid.deliveryTime} days</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-[160px]">
                      <Calendar className="w-5 h-5 text-amber-500 shrink-0" />
                      <span>{new Date(bid.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-[200px]">
                      {bid.user.image ? (
                        <img src={bid.user.image} alt={bid.user.name} className="h-6 w-6 rounded-full object-cover border" />
                      ) : (
                        <UserIcon className="w-6 h-6 text-gray-400 shrink-0" />
                      )}
                      <span className="font-medium">{bid.user.name}</span>
                      <span className="inline-flex items-center gap-1 text-base px-2 py-0.5 rounded-md ml-2"><Timer className="w-5 h-5" />about {timeAgo(bid.createdAt)}</span>
                    </div>
                  </div>
                  {/* Cover letter */}
                  <div className="mt-2">
                    <div className="font-semibold mb-1">Cover Letter</div>
                    <div className="text-xs text-muted-foreground break-words">{bid.message || 'No cover letter provided.'}</div>
                  </div>
                  {/* Action buttons */}
                  <div className="flex gap-2 mt-4">
                    {bid.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleReject(bid.id)}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAccept(bid.id)}
                          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          ✓ Accept & Create Contract
                        </button>
                      </>
                    )}
                    {bid.status === 'accepted' && (
  <button
    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    onClick={() => router.push(`/dashboard/client/contracts/view/${bid.id}`)}
  >
    View Contract →
  </button>
)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientBidsPage