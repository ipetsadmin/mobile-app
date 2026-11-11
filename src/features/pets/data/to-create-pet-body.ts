import type { PostUserPetRequestBody } from "@ipetsadmin/api-client";
import { PetStatus } from "@ipetsadmin/contracts";

import type { CompanionValues } from "../schema/companion.schema";
import { toPetDetailsBody } from "./to-pet-details-body";

export function toCreatePetBody(
  values: CompanionValues,
): PostUserPetRequestBody {
  return {
    ...toPetDetailsBody(values),
    color: "",
    allergies: [],
    description: "",
    status: PetStatus.ACTIVE,
  };
}
