import { z } from "zod";

import { serviceStatuses } from "../types/service";

const serviceBody = {
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  description: z.string().trim().max(500).optional(),
  url: z.string().trim().url("URL must be a valid URL").optional(),
  status: z.enum(serviceStatuses),
};

export const createServiceSchema = z.object({
  body: z.object({
    ...serviceBody,
    status: z.enum(serviceStatuses).default("operational"),
  }),
  params: z.object({}),
});

export const updateServiceSchema = z.object({
  body: z
    .object(serviceBody)
    .partial()
    .refine((value) => Object.keys(value).length > 0, "Provide at least one field to update"),
  params: z.object({
    id: z.string().uuid("Service id must be a valid UUID"),
  }),
});

export const serviceIdSchema = z.object({
  body: z.unknown(),
  params: z.object({
    id: z.string().uuid("Service id must be a valid UUID"),
  }),
});
