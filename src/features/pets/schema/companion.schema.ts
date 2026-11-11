import {
  CatBreed,
  DogBreed,
  Gender,
  Species,
  WeightUnit,
} from "@ipetsadmin/contracts";
import { z } from "zod";

import { endOfDay, startOfDay } from "@/utils/calendar";

export const MAX_PET_AGE_YEARS = 30;

const breedsBySpecies: Record<Species, string[]> = {
  [Species.DOG]: Object.values(DogBreed),
  [Species.CAT]: Object.values(CatBreed),
};

export const BirthDateMode = {
  EXACT: "exact",
  UNSURE: "unsure",
} as const;

const birthSchema = z.object({
  mode: z.enum(BirthDateMode, { error: "validation.selectOption" }),
  date: z
    .date({ error: "validation.required" })
    .refine((date) => date.getTime() <= endOfDay(new Date()).getTime(), "validation.notFuture"),
});

export const TogetherMode = {
  SINCE_BIRTH: "sinceBirth",
  JOINED_LATER: "joinedLater",
} as const;

const togetherSchema = z.object({
  mode: z.enum(TogetherMode, { error: "validation.selectOption" }),
  date: z
    .date({ error: "validation.required" })
    .refine((date) => date.getTime() <= endOfDay(new Date()).getTime(), "validation.notFuture"),
});

export const NotNeuteredReason = {
  TOO_YOUNG: "tooYoung",
  BREED_PLANS: "breedPlans",
  HEALTH_CONCERNS: "healthConcerns",
  OTHER: "other",
} as const;

const microchipNumberSchema = z
  .string()
  .trim()
  .regex(/^[\d\s]*$/, "validation.microchipInvalid")
  .optional();

const weightSchema = z
  .string({ error: "validation.required" })
  .trim()
  .min(1, "validation.required")
  .regex(/^\d+([.,]\d+)?$/, "validation.weightInvalid")
  .refine(
    (value) => Number(value.replace(",", ".")) > 0,
    "validation.weightInvalid",
  );

export const companionSchema = z
  .object({
    species: z.enum(Species, { error: "validation.selectOption" }),
    name: z
      .string({ error: "validation.required" })
      .trim()
      .min(1, "validation.required"),
    breed: z.enum([...Object.values(DogBreed), ...Object.values(CatBreed)], {
      error: "validation.required",
    }),
    gender: z.enum(Gender, { error: "validation.selectOption" }),
    birth: birthSchema,
    together: togetherSchema,
    weight: weightSchema,
    weightUnit: z.enum(WeightUnit, { error: "validation.selectOption" }),
    isNeutered: z.boolean(),
    notNeuteredReason: z.enum(NotNeuteredReason).optional(),
    microchipNumber: microchipNumberSchema,
    photoUri: z.string().optional(),
  })
  .refine((values) => values.isNeutered || !!values.notNeuteredReason, {
    path: ["notNeuteredReason"],
    message: "validation.selectOption",
  })
  .refine((values) => startOfDay(values.together.date) >= startOfDay(values.birth.date), {
    path: ["together", "date"],
    message: "validation.beforeBirth",
  })
  .refine((values) => breedsBySpecies[values.species].includes(String(values.breed)), {
    path: ["breed"],
    message: "validation.breedMismatch",
  });

export type CompanionValues = z.infer<typeof companionSchema>;
