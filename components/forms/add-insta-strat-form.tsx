"use client"

import {useRouter} from "next/navigation"
import type * as z from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {toast} from "@/components/ui/use-toast"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useAddInstaStrat, useUpdateInstaStrat} from "@/services/insta-strat/hooks"
import {Check, ChevronsUpDown, Loader2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {routes} from "@/lib/routes"
import {instaStratSchema} from "@/lib/validations/insta-strat"
import type {createInstaStratCredentials} from "@/services/insta-strat/queries"
import type {InstaStratInterface} from "@/types"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {cn} from "@/lib/utils"
import {useModels} from "@/services/models/hooks";


type Credentials = z.infer<typeof instaStratSchema>

interface AddOrUpdateInstaStratFormProps {
    mode: "add" | "update"
    initialData?: InstaStratInterface
}

export default function AddOrUpdateInstaStratForm({ mode, initialData }: Readonly<AddOrUpdateInstaStratFormProps>) {
    const router = useRouter()
    const addMutation = useAddInstaStrat()
    const updateMutation = useUpdateInstaStrat(initialData?.id ?? "")
    const { data: models = [], isLoading, isError } = useModels()

    const form = useForm<Credentials>({
        resolver: zodResolver(instaStratSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            description: initialData?.description ?? "",
            day_number: initialData?.day_number ?? 5,
            modele: typeof initialData?.modele === "object" ? initialData?.modele?.id : (initialData?.modele ?? undefined),
        },
        mode: "all",
    })

    const onSubmit = async (data: Credentials) => {
        if (mode === "add") {
            await addMutation.mutateAsync(data as createInstaStratCredentials, {
                onSuccess: async () => {
                    toast({
                        title: "Stratégie Instagram créée avec succès",
                    })
                    router.push(routes.dashboard.insta.strat.index)
                },
                onError: (error: any) => {
                    toast({
                        variant: "destructive",
                        title: "Une erreur s'est produite",
                        description: error.response.data.error,
                    })
                },
            })
        } else {
            await updateMutation.mutateAsync(data as createInstaStratCredentials, {
                onSuccess: async () => {
                    toast({
                        title: "Stratégie Instagram mise à jour avec succès",
                    })
                    router.push(routes.dashboard.insta.strat.index)
                },
                onError: (error: any) => {
                    toast({
                        variant: "destructive",
                        title: "Une erreur s'est produite",
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
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom de la stratégie</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nom de la stratégie" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7">
                    <FormField
                        control={form.control}
                        name="day_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre de jours</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Nombre de jours"
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="modele"
                        render={({ field }) => (
                            <FormItem className="mt-0 ">
                                <FormLabel>Modèle</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn("w-full justify-between h-11 md:h-12", !field.value && "text-muted-foreground")}
                                            >
                                                {field.value
                                                    ? models.find((model) => model.id === field.value)?.name
                                                    : "Sélectionner un modèle"}
                                                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Rechercher un modèle..." />
                                            <CommandList>
                                                <CommandEmpty>Aucun modèle trouvé.</CommandEmpty>
                                                <CommandGroup>
                                                    {models.map((model) => (
                                                        <CommandItem
                                                            value={model.name}
                                                            key={model.id}
                                                            onSelect={() => {
                                                                form.setValue("modele", model.id)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn("mr-2 h-4 w-4", model.id === field.value ? "opacity-100" : "opacity-0")}
                                                            />
                                                            {model.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-7">
                    <Button disabled={addMutation.isPending || updateMutation.isPending} className="w-fit">
                        {(addMutation.isPending || updateMutation.isPending) && (
                            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
                        )}
                        {mode === "add" ? "Ajouter une stratégie Instagram" : "Mettre à jour la stratégie Instagram"}
                        <span className="sr-only">
              {mode === "add" ? "Ajouter une stratégie Instagram" : "Mettre à jour la stratégie Instagram"}
            </span>
                    </Button>
                </div>
            </form>
        </Form>
    )
}

