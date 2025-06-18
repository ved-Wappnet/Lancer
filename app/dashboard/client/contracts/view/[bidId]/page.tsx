"use client";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useGetContractByBidQuery } from '@/services/bidApi';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Contract {
  id: number;
  bidId: number;
  clientId: number;
  freelancerId: number;
  terms: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ViewContractPage({ params }: { params: { bidId: string } }) {
  const { bidId } = params;
  const router = useRouter();
  const { data, isLoading, error } = useGetContractByBidQuery(bidId);
  const contract = data?.data;

  if (isLoading) return <div className="flex justify-center items-center min-h-[60vh]"><span>Loading...</span></div>;
  if (error || data?.success === false) return <div className="text-red-500 text-center mt-8">{data?.message || 'Error fetching contract'}</div>;
  if (!contract) return <div className="text-gray-500 text-center mt-8">No contract found for this bid.</div>;

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow border mt-8 ">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>
      <h1 className="text-2xl font-bold mb-1">View Contract</h1>
      <p className="text-muted-foreground mb-6">Below are the details of this contract.</p>
      <form className="space-y-8" autoComplete="off">
  <div className="mb-8">
    <label className="block text-sm font-medium mb-1">* Terms and Conditions</label>
    <Textarea
      className="w-full border rounded p-2 text-sm bg-gray-100 resize-none"
      value={contract.terms}
      disabled
      readOnly
      ref={el => {
        if (el) {
          el.style.height = 'auto';
          el.style.height = el.scrollHeight + 'px';
        }
      }}
      style={{ whiteSpace: "pre-wrap", overflow: "hidden" }}
    />
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
    <div>
      <label className="block text-sm font-medium mb-1">* Total Amount</label>
      <div className="flex items-center border rounded px-2 bg-gray-100">
        <span className="text-gray-400 mr-1">$</span>
        <Input
          type="number"
          value={contract.amount}
          className="w-full border-0 focus:ring-0 text-sm py-2 bg-gray-100"
          disabled
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Created At</label>
      <Input value={new Date(contract.createdAt).toLocaleString()} className="bg-gray-100" disabled />
    </div>
  </div>
      
      </form>
    </div>
  );
}
