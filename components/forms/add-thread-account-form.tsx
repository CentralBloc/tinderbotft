"use client";

import {useRouter} from "next/navigation";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Check, ChevronsUpDown, Loader2} from "lucide-react";
import {useAddThreadAccount, useUpdateThreadAccount} from "@/services/threads/account/hooks";
import {routes} from "@/lib/routes";
import {threadAccountSchema} from "@/lib/validations/thread-account";
import {ThreadAccountInterface, ThreadStrategyInterface} from "@/types";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import React from "react";
import {Input} from "@/components/ui/input";
import {useProxies} from "@/services/proxy/hooks";
import {useModels} from "@/services/models/hooks";
import {useThreadStrats} from "@/services/threads/strategy/hooks";


type ThreadAccountFormData = z.infer<typeof threadAccountSchema>;

interface AddOrUpdateThreadAccountFormProps {
  mode: "add" | "update";
  initialData?: ThreadAccountInterface;
  verification_code?: string;
}

export default function AddOrUpdateThreadAccountForm({
                                                       mode,
                                                       initialData,
                                                       verification_code
                                                     }: Readonly<AddOrUpdateThreadAccountFormProps>) {
  const router = useRouter();
  const addMutation = useAddThreadAccount();
  const updateMutation = useUpdateThreadAccount(initialData?.id ?? "");
  const {data: strategies = []} = useThreadStrats();
  const {data: proxies = []} = useProxies();
  const {data: models = []} = useModels();
  const form = useForm<ThreadAccountFormData>({
    resolver: zodResolver(threadAccountSchema),
    defaultValues: {
      username: initialData?.username ?? "",
      password: initialData?.password ?? "",
      verification_code: verification_code ?? "",
      token: initialData?.token ?? "",
      strategy:
        typeof initialData?.strategy === "object"
          ? initialData?.strategy?.id
          : initialData?.strategy ?? undefined,
      proxy:
        typeof initialData?.proxy === "object"
          ? initialData?.proxy?.id
          : initialData?.proxy ?? undefined,
      modele:
        typeof initialData?.modele === "object"
          ? initialData?.modele?.id
          : initialData?.modele ?? undefined,
    },
  });

  async function onSubmit(data: ThreadAccountFormData) {
    const mutation = mode === "add" ? addMutation : updateMutation;

    await mutation.mutateAsync(data, {
      onSuccess: () => {
        toast({
          title: `Thread account ${mode === "add" ? "created" : "updated"} successfully`,
        });
        router.push(routes.dashboard.insta.index);
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "An error has occurred",
          description: error.response?.data?.error || "Something went wrong",
        });
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-2xl gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7">
          <FormField
            control={form.control}
            name="username"
            render={({field}) => (
              <FormItem>
                <FormLabel>UserName</FormLabel>
                <FormControl>
                  <Input placeholder="Thread account username" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Thread Account Password" {...field} value={field.value || ""}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7">
          <FormField
            control={form.control}
            name="token"
            render={({field}) => (
              <FormItem>
                <FormLabel>Token</FormLabel>
                <FormControl>
                  <Input placeholder="Token du compte" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="verification_code"
            render={({field}) => (
              <FormItem>
                <FormLabel>OTP Code</FormLabel>
                <FormControl>
                  <Input placeholder="otp verification code" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7">
          <FormField
            control={form.control}
            name="modele"
            render={({field}) => (
              <FormItem className="mt-0 ">
                <FormLabel>Model</FormLabel>
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
                          ? models.find(
                            (model) => model.id === field.value,
                          )?.name
                          : "Select model"}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50"/>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search strategy..."/>
                      <CommandList>
                        <CommandEmpty>No model found.</CommandEmpty>
                        <CommandGroup>
                          {models.map((model) => (
                            <CommandItem
                              value={model.name}
                              key={model.id}
                              onSelect={() => {
                                form.setValue("modele", model.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  model.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {model.name}
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
                          ? proxies.find(
                            (proxy) => proxy.id === field.value,
                          )?.name
                          : "Select proxy"}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50"/>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search strategy..."/>
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

        <FormField
          control={form.control}
          name="strategy"
          render={({field}) => (
            <FormItem className="mt-0 ">
              <FormLabel>Strategy</FormLabel>
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
                        ? strategies.find(
                          (strategy: ThreadStrategyInterface) => strategy.id === field.value,
                        )?.name
                        : "Select strategy"}
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50"/>
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search strategy..."/>
                    <CommandList>
                      <CommandEmpty>No strategy found.</CommandEmpty>
                      <CommandGroup>
                        {strategies.map((strategy: ThreadStrategyInterface) => (
                          <CommandItem
                            value={strategy.name}
                            key={strategy.id}
                            onSelect={() => {
                              form.setValue("strategy", strategy.id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                strategy.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {strategy.name}
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


        <Button
          type="submit"
          disabled={addMutation.isPending || updateMutation.isPending}
          className="w-fit"
        >
          {(addMutation.isPending || updateMutation.isPending) && (
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true"/>
          )}
          {mode === "add" ? "Add Thread Account" : "Update Thread Account"}
        </Button>
      </form>
    </Form>
  );
}