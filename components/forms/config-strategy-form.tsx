"use client"
import {useFieldArray, useForm,} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {toast} from "@/components/ui/use-toast"
import {useRouter} from "next/navigation"
import {cn} from "@/lib/utils"
import {Check, ChevronsUpDown, Clock, Copy, Plus, Trash2} from "lucide-react"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {DualSlider} from "@/components/ui/dual-slider"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Badge} from "@/components/ui/badge"
import * as z from "zod"
import {useAddAction} from "@/services/actions/hooks"
import type {createActionCredentials} from "@/services/actions/queries"
import {routes} from "@/lib/routes"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {ConfigStratSkeletonLoader} from "@/components/skeleton/config-strat-loader";
import {useEffect, useState} from "react";

const fieldSchema = (daysNumber: number) =>
    z.object({
        min_swipe_times: z.number().min(0).max(300).optional(),
        max_swipe_times: z.number().min(0).max(300).optional(),
        min_right_swipe_percentage: z.number().min(0).max(100).optional(),
        max_right_swipe_percentage: z.number().min(0).max(100).optional(),
        scheduled_time: z.string().default("00:00"),
        scheduled_time_2: z.string().nullable().optional(),
        related_day: z.number().min(1).max(daysNumber),
        insta_list: z.string().optional(),
        bio_list: z.string().optional(),
        type: z.string(),
    })

const formSchema = (daysNumber: number) =>
    z.object({
        actions: z.array(fieldSchema(daysNumber)),
    })

interface ConfigStrategyFormProps {
    daysNumber: number
    strategyId: string
    strategyActions: any[] | undefined
}

export default function ConfigStrategyForm({
                                               daysNumber,
                                               strategyId,
                                               strategyActions,
                                           }: Readonly<ConfigStrategyFormProps>) {
    const router = useRouter()
    const addMutation = useAddAction()
    const [isLoading, setIsLoading] = useState(true)
    const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
        resolver: zodResolver(formSchema(daysNumber)),
        defaultValues: {
            //@ts-ignore
            actions:
                strategyActions && strategyActions.length > 0
                    ? strategyActions.map((action) => ({
                        min_swipe_times: action.min_swipe_times ?? undefined,
                        max_swipe_times: action.max_swipe_times ?? undefined,
                        min_right_swipe_percentage: action.min_right_swipe_percentage ?? undefined,
                        max_right_swipe_percentage: action.max_right_swipe_percentage ?? undefined,
                        scheduled_time: action.scheduled_time ?? "00:00",
                        scheduled_time_2: action.scheduled_time_2 ?? undefined,
                        related_day: action.related_day,
                        insta_list: action.insta_list ?? "",
                        bio_list: action.bio_list ?? "",
                        type: action.type,
                    }))
                    : [
                        {
                            min_swipe_times: 0,
                            max_swipe_times: 300,
                            min_right_swipe_percentage: 0,
                            max_right_swipe_percentage: 100,
                            scheduled_time: "00:00",
                            scheduled_time_2: null,
                            related_day: 1,
                            type: "swiping",
                        },
                    ],
        },
        mode: "all",
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "actions",
    })

    const onSubmit = async (data: z.infer<ReturnType<typeof formSchema>>) => {
        const payload: createActionCredentials = {
            strategy: strategyId,
            //@ts-ignore
            actions: data.actions.map((action) => ({
                ...action,
                insta_list: action.insta_list || undefined,
                bio_list: action.bio_list || undefined,
                scheduled_time_2: action.scheduled_time_2 === "" ? undefined : action.scheduled_time_2,
            })),
        }

        try {
            await addMutation.mutateAsync(payload, {
                onSuccess: async () => {
                    toast({
                        title: "Strategy configured successfully",
                        description: "Your strategy has been updated with the new actions.",
                    })
                    router.push(routes.dashboard.strategy.index)
                },
                onError: (error: any) => {
                    toast({
                        variant: "destructive",
                        title: "Error submitting data",
                        description: error.response?.data?.error || "An unexpected error occurred",
                    })
                },
            })
        } catch (error) {
            console.error("Error submitting data:", error)
        }
    }

    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    // Count the number of fields with type "swiping" and "add-bio"
    const swipingFieldsCount = fields.filter((field) => field.type === "swiping").length
    const addBioFieldsCount = fields.filter((field) => field.type === "add-bio").length

    const handleAddBioField = () => {
        if (addBioFieldsCount < daysNumber) {
            append({
                insta_list: "",
                bio_list: "",
                scheduled_time: "00:00",
                scheduled_time_2: undefined,
                related_day: addBioFieldsCount + 1,
                type: "add-bio",
            })
        } else {
            toast({
                variant: "destructive",
                title: "Limit reached",
                description: `You cannot add more than ${daysNumber} add-bio actions.`,
            })
        }
    }

    const handleAddSwipingField = () => {
        if (swipingFieldsCount < daysNumber) {
            append({
                min_swipe_times: 0,
                max_swipe_times: 300,
                min_right_swipe_percentage: 0,
                max_right_swipe_percentage: 100,
                scheduled_time: "00:00",
                scheduled_time_2: undefined,
                related_day: swipingFieldsCount + 1,
                type: "swiping",
            })
        } else {
            toast({
                variant: "destructive",
                title: "Limit reached",
                description: `You cannot add more than ${daysNumber} swiping actions.`,
            })
        }
    }

    const handleCopyField = (index: number) => {
        const allFields = form.getValues("actions")
        const fieldToCopy = allFields[index]
        const copiedField = {
            ...fieldToCopy,
            related_day: Math.min(fields.length + 1, daysNumber),
        }

        append(copiedField)
    }

    return (
        <Form {...form}>
            <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className="grid max-w-3xl gap-6">
                {isLoading ? (
                    <ConfigStratSkeletonLoader count={strategyActions?.length || 1} />
                ) : (
                    <>
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <Card key={field.id} className="overflow-hidden border shadow-sm transition-all hover:shadow-md">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/30 pb-2">
                                        <div className="flex items-center gap-3">
                                            <CardTitle className="text-lg font-medium">Action {index + 1}</CardTitle>
                                            <Badge
                                                className={cn(
                                                    "px-2 py-1 text-xs font-medium text-white",
                                                    field.type === "swiping"
                                                        ? "bg-blue-500 hover:bg-blue-600"
                                                        : "bg-green-500 hover:bg-green-600",
                                                )}
                                            >
                                                {field.type}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleCopyField(index)}
                                                            type="button"
                                                            className="size-8"
                                                        >
                                                            <Copy className="size-4" />
                                                            <span className="sr-only">Copy action</span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Copy action</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            onClick={() => remove(index)}
                                                            type="button"
                                                            className="size-8"
                                                        >
                                                            <Trash2 className="size-4" />
                                                            <span className="sr-only">Delete action</span>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Delete action</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                                            {field.type === "swiping" && (
                                                <>
                                                    <FormField
                                                        control={form.control}
                                                        name={`actions.${index}.min_swipe_times`}
                                                        render={({ field: minField }) => (
                                                            <FormField
                                                                control={form.control}
                                                                name={`actions.${index}.max_swipe_times`}
                                                                render={({ field: maxField }) => (
                                                                    <DualSlider
                                                                        minField={minField}
                                                                        maxField={maxField}
                                                                        label="Swipe number (min and max)"
                                                                        min={0}
                                                                        max={300}
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`actions.${index}.min_right_swipe_percentage`}
                                                        render={({ field: minField }) => (
                                                            <FormField
                                                                control={form.control}
                                                                name={`actions.${index}.max_right_swipe_percentage`}
                                                                render={({ field: maxField }) => (
                                                                    <DualSlider
                                                                        minField={minField}
                                                                        maxField={maxField}
                                                                        label="Like percentage (min and max)"
                                                                        min={0}
                                                                        max={100}
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                    />
                                                </>
                                            )}
                                            {field.type === "add-bio" && (
                                                <>
                                                    <FormField
                                                        control={form.control}
                                                        name={`actions.${index}.insta_list`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Instagram usernames list</FormLabel>
                                                                <FormControl>
                                                                    <Textarea
                                                                        placeholder="Enter Instagram usernames (one per line)"
                                                                        className="min-h-[120px] resize-y"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`actions.${index}.bio_list`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Bio List</FormLabel>
                                                                <FormControl>
                                                                    <Textarea
                                                                        placeholder="Enter bios (one per line)"
                                                                        className="min-h-[120px] resize-y"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </>
                                            )}
                                            <FormField
                                                control={form.control}
                                                name={`actions.${index}.scheduled_time`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Schedule time</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input type="time" placeholder="Schedule time" className="pl-3 pr-10" {...field} />
                                                                <Clock className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`actions.${index}.scheduled_time_2`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel >
                                                            Schedule time 2<span className="text-xs text-muted-foreground">(Optional)</span>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    type="time"
                                                                    placeholder="Schedule time 2"
                                                                    className="pl-3 pr-10"
                                                                    {...field}
                                                                    value={field.value ?? ""}
                                                                />
                                                                <Clock className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`actions.${index}.related_day`}
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel>Associated day</FormLabel>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant="outline"
                                                                        role="combobox"
                                                                        className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                                                    >
                                                                        {field.value ? `Day ${field.value}` : "Select day"}
                                                                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-full p-0">
                                                                <Command>
                                                                    <CommandInput placeholder="Search day..." />
                                                                    <CommandList>
                                                                        <CommandEmpty>No day found.</CommandEmpty>
                                                                        <CommandGroup>
                                                                            {[...Array(daysNumber)].map((_, dayIndex) => (
                                                                                <CommandItem
                                                                                    key={dayIndex}
                                                                                    onSelect={() => form.setValue(`actions.${index}.related_day`, dayIndex + 1)}
                                                                                >
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4",
                                                                                            field.value === dayIndex + 1 ? "opacity-100" : "opacity-0",
                                                                                        )}
                                                                                    />
                                                                                    Day {dayIndex + 1}
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
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="flex flex-col justify-between gap-4 pt-2 sm:flex-row">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        className="w-full bg-blue-500 text-white hover:bg-blue-600 sm:w-fit"
                                        disabled={swipingFieldsCount >= daysNumber && addBioFieldsCount >= daysNumber}
                                    >
                                        <Plus className="mr-2 size-4" />
                                        Add new action
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem
                                        onClick={handleAddSwipingField}
                                        disabled={swipingFieldsCount >= daysNumber}
                                        className={swipingFieldsCount >= daysNumber ? "cursor-not-allowed opacity-50" : ""}
                                    >
                                        Swiping
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={handleAddBioField}
                                        disabled={addBioFieldsCount >= daysNumber}
                                        className={addBioFieldsCount >= daysNumber ? "cursor-not-allowed opacity-50" : ""}
                                    >
                                        Add-bio
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600 sm:w-fit">
                                Configure Strategy
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </Form>
    )
}
