"use client";

import {useRouter} from "next/navigation";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React from "react";

import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {routes} from "@/lib/routes";
import {useProxies} from "@/services/proxy/hooks";
import {useAddThreadStrat, useUpdateThreadStrat} from "@/services/threads/strategy/hooks";

// Define validation schema
const threadStrategySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable(),
  day_number: z.number().nullable(),
});

type Credentials = z.infer<typeof threadStrategySchema>;

interface AddOrUpdateThreadStrategyFormProps {
  mode: "add" | "update";
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    day_number: number | null;
  };
}

export default function AddOrUpdateThreadStrategyForm({
                                                        mode,
                                                        initialData,
                                                      }: Readonly<AddOrUpdateThreadStrategyFormProps>) {
  const router = useRouter();
  const addMutation = useAddThreadStrat();
  const {data: proxies = [], isLoading, isError} = useProxies();
  const updateMutation = useUpdateThreadStrat(initialData?.id ?? "");

  const form = useForm<Credentials>({
    resolver: zodResolver(threadStrategySchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? null,
      day_number: initialData?.day_number ?? null,
    },
    mode: "all",
  });

  const onSubmit = async (data: Credentials) => {
    if (mode === "add") {
      await addMutation.mutateAsync(data, {
        onSuccess: () => {
          toast({
            title: "Thread strategy created successfully",
          });
          router.push(routes.dashboard.insta.strat.index);
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Failed to create thread strategy",
            description: error.response?.data?.error ?? "An error occurred",
          });
        },
      });
    } else {
      await updateMutation.mutateAsync(data, {
        onSuccess: () => {
          toast({
            title: "Thread strategy updated successfully",
          });
          router.push(routes.dashboard.insta.strat.index);
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Failed to update thread strategy",
            description: error.response?.data?.error ?? "An error occurred",
          });
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className="grid max-w-2xl gap-4 md:gap-7">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7">
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>Strategy Name</FormLabel>
                <FormControl>
                  <Input placeholder="Thread strategy name" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({field}) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} value={field.value || ""}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="day_number"
          render={({field}) => (
            <FormItem>
              <FormLabel>Days Number</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Days number"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <div>
          <Button
            disabled={addMutation.isPending || updateMutation.isPending}
            className="w-fit"
          >
            {(addMutation.isPending || updateMutation.isPending) && (
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true"/>
            )}
            {mode === "add" ? "Add strategy" : "Update strategy"}
          </Button>
        </div>
      </form>
    </Form>
  );
}