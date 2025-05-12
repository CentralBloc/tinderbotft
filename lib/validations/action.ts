import * as z from "zod";

const timeStringSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time value");

export const swipingActionSchema = z.object({
  min_swipe_times: z.number({
    required_error: "Minimum number of swipes required",
  }),
  max_swipe_times: z.number({
    required_error: "Maximum number of swipes required",
  }),
  min_right_swipe_percentage: z.number({
    required_error: "The minimum percentage of swipes to the right is required",
  }),
  max_right_swipe_percentage: z.number({
    required_error: "The maximum percentage of swipes to the right is required",
  }),
  device_id: z.string().optional(),
  refresh_token: z.string().nullable(),
  schedule_time: timeStringSchema.optional(),
  schedule_time_2: timeStringSchema.optional().nullable(),
  related_days: z.number().optional(),
  insta_list: z.array(z.string()).optional(),
  bio_list: z.array(z.string()).optional(),
  type: z.string({
    required_error: "Action type is required",
  })
});


export const addBioActionSchema = z.object({
  min_swipe_times: z.number().optional(),
  max_swipe_times: z.number().optional(),
  min_right_swipe_percentage: z.number().optional(),
  max_right_swipe_percentage: z.number().optional(),
  device_id: z.string().optional(),
  refresh_token: z.string().nullable(),
  schedule_time: timeStringSchema.optional(),
  schedule_time_2: timeStringSchema.optional(),
  related_days: z.number().optional(),
  insta_list: z.string({
    required_error: "Instagram username list is required",
  }),
  bio_list: z.string({
    required_error: "Bio list is required",
  }),
  type: z.string({
    required_error: "Action type is required",
  })
});