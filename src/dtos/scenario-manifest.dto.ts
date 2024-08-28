import {z} from "zod";

const NAME_REGEX = /^[\d._a-z-]+$/; // alphanumeric, dash, underscore, dot

export const ScenarioDto = z.object({
  description: z.string().optional().default(""),
  name: z.string().regex(NAME_REGEX),
});

export const FlowcoreManifestDto = z.object({
  scenario: ScenarioDto,
  tenant: z.string().optional(),
});

export type Scenario = z.infer<typeof ScenarioDto>;
export type FlowcoreManifest = z.infer<typeof FlowcoreManifestDto>;
