"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

interface ContractDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: any | null;
  role: "client" | "freelancer";
}

import { stripePromise } from "@/utils/stripeClient";

function MakePaymentButton({ contract }: { contract: any }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: contract.id,
          amount: contract.amount,
          clientEmail: contract.client?.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create payment session");
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe.js failed to load");
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (err: any) {
      setError(err.message || "Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end mt-4">
      <button
        className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2 rounded shadow transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        type="button"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Redirecting..." : "Make Payment"}
      </button>
      {error && <span className="text-red-600 text-xs ml-4">{error}</span>}
    </div>
  );
}

export default function ContractDetailsModal({ open, onOpenChange, contract, role }: ContractDetailsModalProps) {
  if (!contract) return null;

  const project = contract.bid?.project;
  const amount = contract.amount;
  const deliveryTime = project?.deliveryTime || "-";
  const deadline = project?.deadline ? new Date(project.deadline).toLocaleDateString() : "-";
  const freelancer = contract.freelancer;
  const client = contract.client;
  const coverLetter = contract?.terms;
  const projectDescription = project?.description;
  const status = contract.status;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-0">
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-2">{project?.title || "Project"}</DialogTitle>
            <DialogDescription>Contract Details</DialogDescription>
          </DialogHeader>

          {/* Financial Details & Timeline */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border rounded-lg p-4">
              <div className="font-semibold text-sm mb-1">Financial Details</div>
              <div className="text-2xl font-bold mb-1">₹ {amount?.toLocaleString() || "-"}</div>
              <div className="text-xs text-muted-foreground">Delivery Time: {deliveryTime} days</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="font-semibold text-sm mb-1">Details</div>
              <div className="flex items-center gap-2 text-xs mb-1">
                <CalendarIcon className="w-4 h-4" />
                <span>Deadline: {deadline}</span>
              </div>
              <div className="flex items-center gap-2 text-xs mb-1">
                <span>Status:</span>
                <span className={
                  status === 'pending' ? 'bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full' :
                  status === 'active' ? 'bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full' :
                  status === 'completed' ? 'bg-green-100 text-green-800 px-2 py-0.5 rounded-full' :
                  status === 'cancelled' ? 'bg-red-100 text-red-800 px-2 py-0.5 rounded-full' :
                  'bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full'
                }>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Freelancer/Client Info */}
          <div className="border rounded-lg p-4 mb-4">
            <div className="font-semibold text-sm mb-1">{role === "client" ? "Freelancer Information" : "Client Information"}</div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>👤</span>
              <span>{role === "client" ? (freelancer?.name || "N/A") : (client?.name || "N/A")}</span>
            </div>
          </div>

          {/* Project Description */}
          <div className="border rounded-lg p-4 mb-4">
            <div className="font-semibold text-sm mb-1">Project Description</div>
            <div className="text-muted-foreground text-sm whitespace-pre-line">{projectDescription || "-"}</div>
          </div>

          {/* Cover Letter */}
          <div className="border rounded-lg p-4 mb-4">
            <div className="font-semibold text-sm mb-1">Cover Letter</div>
            <textarea
              className="w-full min-h-[80px] text-muted-foreground text-sm bg-gray-100 rounded-md p-2 resize-none"
              value={coverLetter || "-"}
              disabled
              readOnly
            />
          </div>
          {/* Make Payment Button (only if completed) */}
          {status === 'completed' && (
            <MakePaymentButton contract={contract} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
