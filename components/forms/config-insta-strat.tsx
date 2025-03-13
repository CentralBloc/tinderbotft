"use client"

import {useFieldArray, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Button} from "@/components/ui/button"
import {Textarea} from "@/components/ui/textarea"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {toast} from "@/components/ui/use-toast"
import {useRouter} from "next/navigation"
import {cn} from "@/lib/utils"
import {Check, ChevronsUpDown, Clock, Copy, Plus, Trash2} from "lucide-react"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Badge} from "@/components/ui/badge"
import * as z from "zod"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {ImageUploader} from "../image-uploader"

import {useEffect} from "react"
import {useCreateInstaActions, useInstaActions} from "@/services/insta-action/hooks";
import {InstaAction} from "@/types";

// Define the schema for each action type
const setupSchema = (daysNumber: number) =>
    z.object({
        action_type: z.literal("setup"),
        profile_pictures: z.array(z.any()).optional(),
        bio_list: z.any().optional(),
        username: z.any().optional(),
        time: z.string().default("00:00"),
        related_day: z.string().min(1).max(daysNumber.toString().length),
    })

const postSchema = (daysNumber: number) =>
    z.object({
        action_type: z.literal("post"),
        posts: z.array(z.any()).optional(),
        time: z.string().default("00:00"),
        related_day: z.string().min(1).max(daysNumber.toString().length),
    })

const storySchema = (daysNumber: number) =>
    z.object({
        action_type: z.literal("story"),
        stories: z.array(z.any()).optional(),
        time: z.string().default("00:00"),
        related_day: z.string().min(1).max(daysNumber.toString().length),
    })

const reelsSchema = (daysNumber: number) =>
    z.object({
        action_type: z.literal("reels"),
        posts: z.array(z.any()).optional(),
        time: z.string().default("00:00"),
        related_day: z.string().min(1).max(daysNumber.toString().length),
    })

// Combine all schemas into one discriminated union
const actionSchema = (daysNumber: number) =>
    z.discriminatedUnion("action_type", [
        setupSchema(daysNumber),
        postSchema(daysNumber),
        storySchema(daysNumber),
        reelsSchema(daysNumber),
    ])

const formSchema = (daysNumber: number) =>
    z.object({
        actions: z.array(actionSchema(daysNumber)),
    })

interface InstaActionFormProps {
    daysNumber: number
    instaStratId: string
    existingActions?: InstaAction[]
}

export default function InstaActionForm({ daysNumber, instaStratId, existingActions }: Readonly<InstaActionFormProps>) {
    const router = useRouter()

    // Fetch existing actions if not provided
    const { data: fetchedActions, isLoading } = useInstaActions(instaStratId)

    // Mutation for creating/updating actions
    const createActionsMutation = useCreateInstaActions()

    const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
        resolver: zodResolver(formSchema(daysNumber)),
        defaultValues: {
            actions: [
                {
                    action_type: "setup" as const,
                    profile_pictures: [],
                    bio_list: null,
                    username: null,
                    time: "00:00",
                    related_day: "1",
                },
            ],
        },
        mode: "all",
    })

    // Update form when existing actions are loaded
    useEffect(() => {
        const actions = existingActions || fetchedActions

        if (actions && actions.length > 0) {
            form.reset({
                actions: actions.map((action: InstaAction) => ({
                    action_type: action.action_type,
                    profile_pictures: action.profile_pictures || [],
                    stories: action.stories || [],
                    posts: action.posts || [],
                    following_username: action.following_username || "",
                    username: action.username || null,
                    bio_list: action.bio_list || null,
                    time: action.time || "00:00",
                    related_day: action.related_day || "1",
                })),
            })
        }
    }, [existingActions, fetchedActions, form])

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "actions",
    })

    const onSubmit = async (data: z.infer<ReturnType<typeof formSchema>>) => {
        try {
            await createActionsMutation.mutateAsync({
                insta_strat: instaStratId,
                actions: data.actions.map((action) => {
                    // Create a base action with common properties
                    const baseAction = {
                        action_type: action.action_type,
                        time: action.time,
                        related_day: action.related_day,
                    }

                    // Add type-specific properties based on action_type
                    switch (action.action_type) {
                        case "setup":
                            return {
                                ...baseAction,
                                profile_pictures: action.profile_pictures?.map((pic) => (pic.file ? { file: pic.file } : pic)),
                                username: action.username,
                                bio_list: action.bio_list,
                            }
                        case "post":
                            return {
                                ...baseAction,
                                posts: action.posts?.map((post) => (post.file ? { file: post.file } : post)),
                            }
                        case "story":
                            return {
                                ...baseAction,
                                stories: action.stories?.map((story) => (story.file ? { file: story.file } : story)),
                            }
                        case "reels":
                            return {
                                ...baseAction,
                                posts: action.posts?.map((post) => (post.file ? { file: post.file } : post)),
                            }
                    }
                }),
            })

            toast({
                title: "Instagram actions configured successfully",
                description: "Your Instagram strategy has been updated with the new actions.",
            })

            // Redirect to appropriate page after successful submission
            router.push("/dashboard/instagram-strategies")
        } catch (error) {
            console.error("Error submitting data:", error)
            toast({
                variant: "destructive",
                title: "Error submitting data",
                description: "An unexpected error occurred while saving your Instagram actions.",
            })
        }
    }

    // Count the number of fields for each action type
    const setupCount = fields.filter((field) => field.action_type === "setup").length
    const postCount = fields.filter((field) => field.action_type === "post").length
    const storyCount = fields.filter((field) => field.action_type === "story").length
    const reelsCount = fields.filter((field) => field.action_type === "reels").length

    const handleAddAction = (actionType: "setup" | "post" | "story" | "reels") => {
        const newAction = {
            action_type: actionType,
            profile_pictures: [],
            stories: [],
            posts: [],
            following_username: "",
            username: null,
            bio_list: null,
            time: "00:00",
            related_day: "1",
        }

        append(newAction)
    }

    const handleCopyField = (index: number) => {
        const allFields = form.getValues("actions")
        const fieldToCopy = allFields[index]
        const copiedField = {
            ...fieldToCopy,
            related_day: Math.min(Number.parseInt(fieldToCopy.related_day) + 1, daysNumber).toString(),
        }

        append(copiedField)
    }

    const getActionTypeColor = (actionType: string) => {
        switch (actionType) {
            case "setup":
                return "bg-blue-500 hover:bg-blue-600"
            case "post":
                return "bg-green-500 hover:bg-green-600"
            case "story":
                return "bg-purple-500 hover:bg-purple-600"
            case "reels":
                return "bg-red-500 hover:bg-red-600"
            default:
                return "bg-gray-500 hover:bg-gray-600"
        }
    }

    if (isLoading && !existingActions) {
        return <div className="flex justify-center p-8">Loading actions...</div>
    }

    return (
        <Form {...form}>
            <form onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)} className="grid max-w-3xl gap-6">
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="overflow-hidden border shadow-sm transition-all hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/30 pb-2">
                                <div className="flex items-center gap-3">
                                    <CardTitle className="text-lg font-medium">Action {index + 1}</CardTitle>
                                    <Badge
                                        className={cn("px-2 py-1 text-xs font-medium text-white", getActionTypeColor(field.action_type))}
                                    >
                                        {field.action_type}
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
                                    {/* Setup specific fields */}
                                    {field.action_type === "setup" && (
                                        <>
                                            <div className="md:col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`actions.${index}.profile_pictures`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Profile Pictures</FormLabel>
                                                            <FormControl>
                                                                <ImageUploader value={field.value || []} onChange={field.onChange} maxFiles={10} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name={`actions.${index}.username`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Usernames (JSON)</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder='["username1", "username2"]'
                                                                className="min-h-[120px] resize-y"
                                                                {...field}
                                                                value={field.value ? JSON.stringify(field.value, null, 2) : ""}
                                                                onChange={(e) => {
                                                                    try {
                                                                        const parsed = JSON.parse(e.target.value)
                                                                        field.onChange(parsed)
                                                                    } catch {
                                                                        field.onChange(e.target.value)
                                                                    }
                                                                }}
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
                                                        <FormLabel>Bio List (JSON)</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder='["Bio 1", "Bio 2"]'
                                                                className="min-h-[120px] resize-y"
                                                                {...field}
                                                                value={field.value ? JSON.stringify(field.value, null, 2) : ""}
                                                                onChange={(e) => {
                                                                    try {
                                                                        const parsed = JSON.parse(e.target.value)
                                                                        field.onChange(parsed)
                                                                    } catch {
                                                                        field.onChange(e.target.value)
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </>
                                    )}

                                    {/* Post specific fields */}
                                    {field.action_type === "post" && (
                                        <div className="md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`actions.${index}.posts`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Post Images</FormLabel>
                                                        <FormControl>
                                                            <ImageUploader value={field.value || []} onChange={field.onChange} maxFiles={10} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* Story specific fields */}
                                    {field.action_type === "story" && (
                                        <div className="md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`actions.${index}.stories`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Story Images</FormLabel>
                                                        <FormControl>
                                                            <ImageUploader value={field.value || []} onChange={field.onChange} maxFiles={10} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* Reels specific fields */}
                                    {field.action_type === "reels" && (
                                        <div className="md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`actions.${index}.posts`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Reels Videos</FormLabel>
                                                        <FormControl>
                                                            <ImageUploader
                                                                value={field.value || []}
                                                                onChange={field.onChange}
                                                                maxFiles={10}
                                                                acceptedFileTypes="video/*"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* Common fields for all action types */}
                                    <FormField
                                        control={form.control}
                                        name={`actions.${index}.time`}
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
                                                                            onSelect={() =>
                                                                                form.setValue(`actions.${index}.related_day`, (dayIndex + 1).toString())
                                                                            }
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    field.value === (dayIndex + 1).toString() ? "opacity-100" : "opacity-0",
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
                            <Button type="button" className="w-full bg-blue-500 text-white hover:bg-blue-600 sm:w-fit">
                                <Plus className="mr-2 size-4" />
                                Add new action
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem
                                onClick={() => handleAddAction("setup")}
                                className={setupCount >= daysNumber ? "cursor-not-allowed opacity-50" : ""}
                                disabled={setupCount >= daysNumber}
                            >
                                Setup
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleAddAction("post")}
                                className={postCount >= daysNumber ? "cursor-not-allowed opacity-50" : ""}
                                disabled={postCount >= daysNumber}
                            >
                                Post
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleAddAction("story")}
                                className={storyCount >= daysNumber ? "cursor-not-allowed opacity-50" : ""}
                                disabled={storyCount >= daysNumber}
                            >
                                Story
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleAddAction("reels")}
                                className={reelsCount >= daysNumber ? "cursor-not-allowed opacity-50" : ""}
                                disabled={reelsCount >= daysNumber}
                            >
                                Reels
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        type="submit"
                        className="w-full bg-green-500 text-white hover:bg-green-600 sm:w-fit"
                        disabled={createActionsMutation.isPending}
                    >
                        {createActionsMutation.isPending ? "Saving..." : "Configure Instagram Actions"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

