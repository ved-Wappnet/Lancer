'use client';
import React from 'react'

import { useGetBidsQuery } from '@/services/bidApi';
import { useGetProjectsQuery } from '@/services/projectApi';
import type { Bid } from '@/types/bid';

const usdFormat = (amount: number | string) => {
  return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

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

const FreelancerBidsPage = () => {
  const { data, isLoading, error } = useGetBidsQuery();
  const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery();

  // If API returns BidResponse[] (i.e., {bid: Bid}), extract .bid
  const bids: Bid[] = Array.isArray(data?.data)
    ? data.data.map((item: any) => (item.bid ? item.bid : item))
    : [];
    
  const projects = Array.isArray(projectsData) ? projectsData : [];
  // Map for quick project lookup
  const projectMap = new Map<number, any>(projects.map((p: any) => [p.id, p]));

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">Your Bids</h1>
        <p className="text-muted-foreground mb-6 mt-1">View all your submitted bids and their status</p>
        {isLoading || projectsLoading ? (
          <div className="py-12 text-center text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="text-red-500">Failed to load bids.</div>
        ) : bids.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">No bids found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-left border-b">
                <th className="py-2 font-medium">Project</th>
                <th className="py-2 font-medium">Bid Amount</th>
                <th className="py-2 font-medium">Delivery Time</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Date Submitted</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => {
                const project = projectMap.get(bid.projectId);
                return (
                  <tr key={bid.id} className="border-b last:border-0">
                    <td className="py-4 align-top w-1/3">
                      <div className="font-semibold truncate max-w-xs whitespace-nowrap">{project?.title || 'Untitled Project'}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-xs truncate-ellipsis w-64">{project?.description || ''}</div>
                      <div className="text-xs text-muted-foreground mt-1">Project Budget: {project?.budget ? "$" + (project.budget) : '-'}</div>
                    </td>
                    <td className="py-4 align-top">
                      <div className="font-semibold">{usdFormat(bid.amount)}</div>
                    </td>
                    <td className="py-4 align-top">{bid.deliveryTime} days</td>
                    <td className="py-4 align-top">
                      {getStatusBadge(bid.status)}
                    </td>
                    <td className="py-4 align-top">{new Date(bid.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}



export default FreelancerBidsPage