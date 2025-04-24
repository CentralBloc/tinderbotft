"use client";

import {useRouter} from "next/navigation";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {routes} from "@/lib/routes";
import {toast} from "@/components/ui/use-toast";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {useUsers} from "@/services/users/hooks";
import {usePlans} from "@/services/plans/hooks";
import {Loader2} from "lucide-react";
import {SubscriptionInterface} from "@/types";

const subscriptionSchema = z.object({
  userId: z.string().min(1, "User is required"),
  planId: z.string().min(1, "Plan is required"),
  startDate: z.string().min(1, "Start date is required"),
  billingCycle: z.enum(["monthly", "quarterly", "yearly"]),
  isActive: z.boolean(),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface AddOrUpdateSubscriptionFormProps {
  mode: "add" | "update";
  initialData?: SubscriptionInterface;
}

export default function AddOrUpdateSubscriptionForm({
                                                      mode,
                                                      initialData,
                                                    }: Readonly<AddOrUpdateSubscriptionFormProps>) {
  const router = useRouter();
  const {data: users = []} = useUsers();
  const {data: plans = []} = usePlans();

  const isValidBillingCycle = (value: string): value is "monthly" | "quarterly" | "yearly" => {
    return ["monthly", "quarterly", "yearly"].includes(value);
  };

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      userId: initialData?.user?.id ?? "",
      planId: typeof initialData?.plan === "object" && initialData.plan !== null
        ? initialData.plan.id
        : typeof initialData?.plan === "string"
          ? initialData.plan
          : "",
      startDate: initialData?.start_date
        ? new Date(initialData.start_date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      billingCycle: initialData?.billing_cycle && isValidBillingCycle(initialData.billing_cycle)
        ? initialData.billing_cycle
        : "monthly", isActive: initialData?.status === "active",
    },
  });

  const onSubmit = async (data: SubscriptionFormData) => {
    try {
      // Here you would make the API call to create/update subscription
      // const response = await addSubscription(data) or updateSubscription(data)

      toast({
        title: mode === "add" ? "Subscription created" : "Subscription updated",
        description: "The subscription has been saved successfully.",
      });

      router.push(routes.dashboard.admin.subscriptions.index);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-2xl gap-4 md:gap-7">
        <FormField
          control={form.control}
          name="userId"
          render={({field}) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planId"
          render={({field}) => (
            <FormItem>
              <FormLabel>Plan</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} (${plan.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage/>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4 md:gap-7">
          <FormField
            control={form.control}
            name="startDate"
            render={({field}) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="billingCycle"
            render={({field}) => (
              <FormItem>
                <FormLabel>Billing Cycle</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing cycle"/>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage/>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({field}) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Active</FormLabel>
              <FormMessage/>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 size-4 animate-spin"/>
            )}
            {mode === "add" ? "Create Subscription" : "Update Subscription"}
          </Button>
        </div>
      </form>
    </Form>
  );
}