"use client"

import {useFieldArray, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {toast} from "@/components/ui/use-toast"
import {useRouter} from "next/navigation"
import {Clock, Copy, Plus, Trash2} from "lucide-react"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {routes} from "@/lib/routes"
import {useCreateThreadStratActions} from "@/services/threads/action/hooks"
import {useEffect, useState} from "react"
import type {ThreadActionInterface} from "@/types"

const fieldSchema = (daysNumber: number) =>
  z.object({
    frequency: z.number().min(1).max(24),
    start_time: z.string().default("00:00"),
    related_day: z.number().min(1).max(daysNumber),
    type: z.string(),
    post_number: z.number().min(1),
    media_post_number: z.number().min(0),
  })

const formSchema = (daysNumber: number) =>
  z.object({
    actions: z.array(fieldSchema(daysNumber)),
  })

interface ConfigThreadStrategyFormProps {
  daysNumber: number
  strategyId: string
  existingActions: ThreadActionInterface[] | undefined
}

export default function ConfigThreadStrategyForm({
                                                   daysNumber,
                                                   strategyId,
                                                   existingActions,
                                                 }: Readonly<ConfigThreadStrategyFormProps>) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema(daysNumber)),
    defaultValues: {
      actions: existingActions && existingActions.length > 0
        ? existingActions.map((action) => ({
          frequency: Number(action.frequency),
          start_time: action.start_time ?? "00:00",
          related_day: action.related_day,
          type: action.type,
          post_number: action.post_number,
          media_post_number: action.media_post_number,
        }))
        : [{
          frequency: 1,
          start_time: "00:00",
          related_day: 1,
          type: "posting",
          post_number: 1,
          media_post_number: 0,
        }],
    },
  })

  const {fields, append, remove} = useFieldArray({
    control: form.control,
    name: "actions",
  })

  const createMutation = useCreateThreadStratActions({
    strategy: strategyId,
    actions: form.getValues().actions,
  })

  const onSubmit = async (data: z.infer<ReturnType<typeof formSchema>>) => {
    const payload = {
      strategy: strategyId,
      actions: data.actions,
    }

    try {
      await createMutation.mutateAsync(undefined, {
        onSuccess: () => {
          toast({
            title: "Thread strategy configured",
            description: "Your thread strategy has been updated successfully.",
          })
          router.push(routes.dashboard.insta.strat.index)
        },
        onError: (error: any) => {
          toast({
            variant: "destructive",
            title: "Error configuring strategy",
            description: error.response?.data?.error ?? "An unexpected error occurred",
          })
        },
      })
    } catch (error) {
      console.error("Error submitting data:", error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleCopyField = (index: number) => {
    const allFields = form.getValues("actions")
    const fieldToCopy = allFields[index]
    append({
      ...fieldToCopy,
      related_day: Math.min(fields.length + 1, daysNumber),
    })
  }

  const handleAddField = () => {
    if (fields.length < daysNumber) {
      append({
        frequency: 1,
        start_time: "00:00",
        related_day: fields.length + 1,
        type: "posting",
        post_number: fields.length,
        media_post_number: 0,
      })
    } else {
      toast({
        variant: "destructive",
        title: "Limit reached",
        description: `You cannot add more than ${daysNumber} actions.`,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full max-w-3xl flex-col gap-6">
        <div className="flex-1 space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/30 pb-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg font-medium">Position {field.post_number}</CardTitle>
                  <Badge className="bg-purple-500 text-white hover:bg-purple-600">
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
                          <Copy className="size-4"/>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy position</p>
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
                          <Trash2 className="size-4"/>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete position</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                  <FormField
                    control={form.control}
                    name={`actions.${index}.post_number`}
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Number of posts</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            min={1}
                            placeholder="Enter number of posts"
                            onChange={(e) => field.onChange(e.target.value.toString())}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`actions.${index}.frequency`}
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Frequency (posts per day)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min={1} max={60}/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`actions.${index}.media_post_number`}
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Media posts number</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`actions.${index}.start_time`}
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Start time</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="time" {...field} className="pl-3 pr-10"/>
                            <Clock className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"/>
                          </div>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-4 pt-2 sm:flex-row">
          <Button
            type="button"
            onClick={handleAddField}
            className="w-full bg-purple-500 text-white hover:bg-purple-600 sm:w-fit"
            disabled={fields.length >= daysNumber}
          >
            <Plus className="mr-2 size-4"/>
            Add new position
          </Button>
          <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600 sm:w-fit">
            Configure Strategy
          </Button>
        </div>
      </form>
    </Form>
  )
}
