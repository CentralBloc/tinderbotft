"use client";

import React from "react";
import {FormProvider, useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {toast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {useConnectMultipleAccount} from "@/services/instagram/hooks";
import {Check, ChevronsUpDown, Loader2} from "lucide-react";
import {routes} from "@/lib/routes";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {useProxies} from "@/services/proxy/hooks";
import {useModels} from "@/services/models/hooks";

const formSchema = z.object({
  data: z.string().min(1, "Login data is required"),
  proxy: z.string().min(1, "Proxy is required"),
  modele: z.string().min(1, "Model is required"),
});

export default function ConnectInsta() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: "",
      proxy: "",
      modele: "",
    },
    mode: "all",
  });

  const {data: proxies = []} = useProxies();
  const {data: models = []} = useModels();

  const addMutation = useConnectMultipleAccount();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await addMutation.mutateAsync(data, {
      onSuccess: async () => {
        toast({
          title: "Successfully added account(s)",
        });
        router.push(routes.dashboard.insta.index);
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "An error has occurred",
          description: error.response.data.error,
        });
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
        <FormField
          control={form.control}
          name="data"
          render={({field}) => (
            <FormItem>
              <FormLabel>Insta Login Data</FormLabel>
              <Textarea placeholder="Enter login data, one per line" {...field} className="h-32"/>
              <FormMessage/>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7">
          <Button
            disabled={addMutation.isPending}
            className="w-fit"
          >
            {addMutation.isPending && (
              <Loader2
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Connect Account
            <span className="sr-only">
                {addMutation.isPending ? "Submitting..." : "Submit"}
              </span>
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}