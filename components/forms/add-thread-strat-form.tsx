"use client"

import {useRouter} from "next/navigation"
import type * as z from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {toast} from "@/components/ui/use-toast"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Check, ChevronsUpDown, Loader2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {routes} from "@/lib/routes"
import {threadStratSchema} from "@/lib/validations/thread-strat"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {cn} from "@/lib/utils"
import {useAddThreadStrat, useUpdateThreadStrat} from "@/services/threads/strategy/hooks";
import {CreateThreadStratCredentials} from "@/services/thread-strat/queries";
import {useProxies} from "@/services/proxy/hooks";
import {ThreadStrategyInterface} from "@/types";


type Credentials = z.infer<typeof threadStratSchema>

interface AddOrUpdateInstaStratFormProps {
  mode: "add" | "update"
  initialData?: ThreadStrategyInterface
}

export default function AddOrUpdateInstaStratForm({mode, initialData}: Readonly<AddOrUpdateInstaStratFormProps>) {
  const router = useRouter()
  const addMutation = useAddThreadStrat()
  const updateMutation = useUpdateThreadStrat(initialData?.id ?? "")
  const {data: proxies = [], isLoading, isError} = useProxies()

  const form = useForm<Credentials>({
    resolver: zodResolver(threadStratSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      day_number: initialData?.day_number ?? 5,
      proxy: typeof initialData?.proxy === "object" ? initialData?.proxy?.id : (initialData?.proxy ?? undefined),
    },
    mode: "all",
  })

  const onSubmit = async (data: Credentials) => {
    if (mode === "add") {
      await addMutation.mutateAsync(data as CreateThreadStratCredentials, {
        onSuccess: async () => {
          toast({
            title: "Successful Thread strategy creation",
          })
          router.push(routes.dashboard.insta.strat.index)
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "An error occurred",
            description: error.response.data.error,
          })
        },
      })
    } else {
      await updateMutation.mutateAsync(data as CreateThreadStratCredentials, {
        onSuccess: async () => {
          toast({
            title: "Thread strategy updated successfully",
          })
          router.push(routes.dashboard.insta.strat.index)
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "An error occurred",
            description: error.response.data.error,
          })
        },
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className="grid max-w-2xl gap-4 md:gap-7">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7">
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>Strategy name</FormLabel>
                <FormControl>
                  <Input placeholder="Strategy name" {...field} />
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
            name="day_number"
            render={({field}) => (
              <FormItem>
                <FormLabel>Number of days</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Number of days"
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
                        className={cn("w-full justify-between h-11 md:h-12", !field.value && "text-muted-foreground")}
                      >
                        {field.value
                          ? proxies.find((proxy) => proxy.id === field.value)?.name
                          : "Select a proxy"}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50"/>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search proy..."/>
                      <CommandList>
                        <CommandEmpty>No models found.</CommandEmpty>
                        <CommandGroup>
                          {proxies.map((proxy) => (
                            <CommandItem
                              value={proxy.name}
                              key={proxy.id}
                              onSelect={() => {
                                form.setValue("proxy", proxy.id)
                              }}
                            >
                              <Check
                                className={cn("mr-2 h-4 w-4", proxy.id === field.value ? "opacity-100" : "opacity-0")}
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7">
          <Button disabled={addMutation.isPending || updateMutation.isPending} className="w-fit">
            {(addMutation.isPending || updateMutation.isPending) && (
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true"/>
            )}
            {mode === "add" ? "Add Thread Strategy" : "Update Thread Strategy"}
            <span className="sr-only">
              {mode === "add" ? "Add Thread Strategy" : "Upate Thread Strategy"}
            </span>
          </Button>
        </div>
      </form>
    </Form>
  )
}

