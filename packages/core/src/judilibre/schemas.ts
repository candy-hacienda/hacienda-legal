import { z } from "zod";

export const JudilibreDecisionSummarySchema = z
  .object({
    id: z.string().optional(),
    decision_datetime: z.string().nullable().optional(),
    jurisdiction: z.string().nullable().optional(),
    chamber: z.string().nullable().optional(),
    number: z.string().nullable().optional(),
    solution: z.string().nullable().optional(),
    publication: z.union([z.string(), z.array(z.string())]).nullable().optional(),
    text: z.string().nullable().optional(),
    summary: z.string().nullable().optional(),
  })
  .passthrough();

export const JudilibreDecisionSchema = JudilibreDecisionSummarySchema.extend({
  zones: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

export const JudilibreSearchResponseSchema = z
  .object({
    results: z.array(JudilibreDecisionSchema).default([]),
    total: z.number().optional(),
    page: z.number().optional(),
    page_size: z.number().optional(),
    next_page: z.string().nullable().optional(),
    previous_page: z.string().nullable().optional(),
  })
  .passthrough();

export type JudilibreDecision = z.infer<typeof JudilibreDecisionSchema>;
export type JudilibreDecisionSummary = z.infer<typeof JudilibreDecisionSummarySchema>;
export type JudilibreSearchResponse = z.infer<typeof JudilibreSearchResponseSchema>;
