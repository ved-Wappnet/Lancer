import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBidMutation } from "@/services/bidApi";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface BidModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  project: any;
  user: any;
}

export function BidModal({ open, setOpen, project, user }: BidModalProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; deliveryTime?: string; coverLetter?: string }>({});
  const [createBid, { isLoading }] = useCreateBidMutation();

  // Reset form and errors on close
  const handleDialogChange = (openState: boolean) => {
    setOpen(openState);
    if (!openState) {
      setAmount("");
      setDeliveryTime("");
      setCoverLetter("");
      setErrors({});
    }
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!amount) errs.amount = "Bid amount is required.";
    else if (isNaN(Number(amount)) || Number(amount) <= 0) errs.amount = "Enter a valid bid amount (> 0).";
    if (!deliveryTime) errs.deliveryTime = "Delivery time is required.";
    else if (isNaN(Number(deliveryTime)) || Number(deliveryTime) <= 0) errs.deliveryTime = "Enter valid days (> 0).";
    if (!coverLetter) errs.coverLetter = "Cover letter is required.";
    else if (coverLetter.length < 10) errs.coverLetter = "Cover letter must be at least 10 characters.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: "Check your input",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }
    try {
      await createBid({
        projectId: project.id,
        amount: Number(amount),
        deliveryTime: Number(deliveryTime),
        message: coverLetter,
      }).unwrap();
      toast({
        title: "Bid Submitted",
        description: "Your bid has been submitted successfully.",
      });
      handleDialogChange(false);
    } catch (err: any) {
      toast({
        title: "Failed to submit bid",
        description: err?.data?.message || err?.error || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Submit Bid for {project?.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="bid-amount">Bid Amount</label>
              <Input
                id="bid-amount"
                type="number"
                min="0"
                placeholder="Enter your bid amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                aria-invalid={!!errors.amount}
              />
              {errors.amount && <span className="text-xs text-red-500">{errors.amount}</span>}
            </div>
            <div className="grid gap-2">
              <label htmlFor="delivery-time">Delivery Time (days)</label>
              <Input
                id="delivery-time"
                type="number"
                min="1"
                placeholder="e.g. 7"
                value={deliveryTime}
                onChange={e => setDeliveryTime(e.target.value)}
                required
                aria-invalid={!!errors.deliveryTime}
              />
              {errors.deliveryTime && <span className="text-xs text-red-500">{errors.deliveryTime}</span>}
            </div>
            <div className="grid gap-2">
              <label htmlFor="cover-letter">Cover Letter</label>
              <Textarea
                id="cover-letter"
                placeholder="Write a brief cover letter..."
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                className="min-h-[80px]"
                required
                aria-invalid={!!errors.coverLetter}
              />
              {errors.coverLetter && <span className="text-xs text-red-500">{errors.coverLetter}</span>}
            </div>
          </div>
          <DialogFooter className="flex flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => handleDialogChange(false)}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Bid"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
