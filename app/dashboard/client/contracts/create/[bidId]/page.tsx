"use client";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { useCreateContractMutation } from "@/services/bidApi";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const contractSchema = z.object({
  terms: z.string().min(1, "Terms and Conditions are required."),
  amount: z
    .number({ invalid_type_error: "Total Amount is required." })
    .min(1, "Total Amount must be greater than 0."),
});

type ContractFormValues = z.infer<typeof contractSchema>;

export default function CreateContractPage() {
  const { bidId } = useParams();
  const router = useRouter();
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: { terms: "", amount: 0 },
  });

  const user = useSelector((state: any) => state.auth.user);
  const [createContract, { isLoading, error }] = useCreateContractMutation();
  const { toast } = useToast();

  const onSubmit = async (values: ContractFormValues) => {
    if (!user) {
      toast({ title: "Not authenticated", description: "Please sign in again.", variant: "destructive" });
      return;
    }
    try {
      await createContract({
        bidId: Array.isArray(bidId) ? bidId[0] : bidId,
        clientId: user.id,
        terms: values.terms,
        amount: values.amount,
      }).unwrap();
      toast({ title: "Contract created!", description: "Your contract has been successfully created." });
      router.push("/dashboard/client/bids");
    } catch (err: any) {
      toast({ title: "Error", description: err?.data?.error || "Failed to create contract.", variant: "destructive" });
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow border mt-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>
      <h1 className="text-2xl font-bold mb-1">Create Contract</h1>
      <p className="text-muted-foreground mb-6">Fill in the details to create a new contract.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Terms and Conditions</FormLabel>
                  <FormControl>
                    <Textarea
                      className="w-full border rounded p-2 min-h-[72px] text-sm"
                      placeholder="Enter contract terms and conditions..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Total Amount</FormLabel>
                  <FormControl>
                    <div className="flex items-center border rounded px-2">
                      <span className="text-gray-400 mr-1">$</span>
                      <Input
                        type="number"
                        min={0}
                        step="any"
                        {...field}
                        value={field.value ?? ""}
                        onChange={e => field.onChange(Number(e.target.value))}
                        className="w-full border-0 focus:ring-0 text-sm py-2"
                        required
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <span>✓</span> Create Contract
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
