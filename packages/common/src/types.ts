import { z } from "zod";

export const CreateEventSchema = z.object({
    name: z.string(),
    description: z.string(),
    startTime: z.string(),
    locationId: z.string(),
    banner: z.string(),
    adminId: z.string(),
})  
export const CreateLocationSchema = z.object({
    name: z.string(),
    description: z.string(),
    startTime: z.string(),
    locationId: z.string(),
    banner: z.string(),
})  
