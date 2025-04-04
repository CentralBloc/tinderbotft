"use client";

import {useRouter} from "next/navigation";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import React from "react";
import {useAddStrategy, useUpdateStrategy} from "@/services/strategy/hooks";
import {Check, ChevronsUpDown, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {routes} from "@/lib/routes";
import {strategySchema} from "@/lib/validations/strategy";
import {createStrategyCredentials} from "@/services/strategy/queries";
import {StrategyInterface} from "@/types";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {useProxies} from "@/services/proxy/hooks";
import {DualSlider} from "@/components/ui/dual-slider";

type Credentials = z.infer<typeof strategySchema>;

interface AddOrUpdateStrategyFormProps {
    mode: "add" | "update";
    initialData?: StrategyInterface;
}

export default function AddOrUpdateStrategyForm({
                                                    mode,
                                                    initialData,
                                                }: Readonly<AddOrUpdateStrategyFormProps>) {
    const router = useRouter();
    const addMutation = useAddStrategy();
    const updateMutation = useUpdateStrategy(initialData?.id ?? "");
    const {data: proxies = [], isLoading, isError} = useProxies();

    const form = useForm<Credentials>({
        resolver: zodResolver(strategySchema),
        defaultValues: {
            name: initialData?.name ?? "",
            description: initialData?.description ?? "",
            days_number: initialData?.days_number ?? 0,
            proxy:
                typeof initialData?.proxy === "object"
                    ? initialData?.proxy?.id
                    : initialData?.proxy ?? undefined,
            min_swipes_delay: initialData?.min_swipes_delay ?? 2,
            max_swipes_delay: initialData?.max_swipes_delay ?? 5,
        },
        mode: "all",
    });

    const onSubmit = async (data: Credentials) => {
        if (mode === "add") {
            await addMutation.mutateAsync(data as createStrategyCredentials, {
                onSuccess: async () => {
                    toast({
                        title: "Stratégie créée avec succès",
                    });
                    router.push(routes.dashboard.strategy.index);
                },
                onError: (error: any) => {
                    toast({
                        variant: "destructive",
                        title: "Une erreur s'est produite",
                        description: error.response.data.error,
                    });
                },
            });
        } else {
            await updateMutation.mutateAsync(data as createStrategyCredentials, {
                onSuccess: async () => {
                    toast({
                        title: "Stratégie mise à jour avec succès",
                    });
                    router.push(routes.dashboard.strategy.index);
                },
                onError: (error: any) => {
                    toast({
                        variant: "destructive",
                        title: "Une erreur s'est produite",
                        description: error.response.data.error,
                    });
                },
            });
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
                className="grid max-w-2xl gap-4 md:gap-7"
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Strategy Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nom de la stratégie" {...field} />
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
                                    <Input placeholder="Description" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7">
                    <FormField
                        control={form.control}
                        name="days_number"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Days Number</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Days Number"
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="proxy"
                        render={({field}) => (
                            <FormItem className="mt-0 ">
                                <FormLabel>Proxy</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between h-11 md:h-12",
                                                    !field.value && "text-muted-foreground",
                                                )}
                                            >
                                                {field.value
                                                    ? proxies.find((proxy) => proxy.id === field.value)
                                                        ?.name
                                                    : "Select proxy"}
                                                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search proxy..."/>
                                            <CommandList>
                                                <CommandEmpty>No proxy found.</CommandEmpty>
                                                <CommandGroup>
                                                    {proxies.map((proxy) => (
                                                        <CommandItem
                                                            value={proxy.name}
                                                            key={proxy.id}
                                                            onSelect={() => {
                                                                form.setValue("proxy", proxy.id);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    proxy.id === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0",
                                                                )}
                                                            />
                                                            {proxy.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-1 md:gap-7">
                    <FormField
                        control={form.control}
                        name="min_swipes_delay"
                        render={({ field: minField }) => (
                            <FormField
                                control={form.control}
                                name="max_swipes_delay"
                                render={({ field: maxField }) => (
                                    <DualSlider
                                        minField={minField}
                                        maxField={maxField}
                                        label="Swipe Delay(s)"
                                        min={0}
                                        max={60}
                                    />
                                )}
                            />
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7">
                    <Button
                        disabled={addMutation.isPending || updateMutation.isPending}
                        className="w-fit"
                    >
                        {(addMutation.isPending || updateMutation.isPending) && (
                            <Loader2
                                className="mr-2 size-4 animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        {mode === "add"
                            ? "Add strategy"
                            : "Update strategy"}
                        <span className="sr-only">
              {mode === "add"
                  ? "Add strategy"
                  : "Update strategy"}
            </span>
                    </Button>
                </div>
            </form>
        </Form>
    );
}
