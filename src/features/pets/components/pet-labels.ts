import { Gender, WeightUnit } from "@ipetsadmin/contracts";

export const ageKeys = {
  years: "companions.age.years",
  months: "companions.age.months",
} as const;

export const genderKeys = {
  [Gender.FEMALE]: "gender.female",
  [Gender.MALE]: "gender.male",
} as const;

export const weightUnitKeys = {
  [WeightUnit.KG]: "weightUnit.kg",
  [WeightUnit.LB]: "weightUnit.lb",
} as const;
