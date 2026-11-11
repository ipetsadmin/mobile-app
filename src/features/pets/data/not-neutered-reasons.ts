import { NotNeuteredReason as ContractNotNeuteredReason } from "@ipetsadmin/contracts";

import { NotNeuteredReason } from "../schema/companion.schema";

export const toContractReason = {
  [NotNeuteredReason.TOO_YOUNG]: ContractNotNeuteredReason.TOO_YOUNG,
  [NotNeuteredReason.BREED_PLANS]: ContractNotNeuteredReason.BREED_PLANS,
  [NotNeuteredReason.HEALTH_CONCERNS]:
    ContractNotNeuteredReason.HEALTH_CONCERNS,
  [NotNeuteredReason.OTHER]: ContractNotNeuteredReason.OTHER,
};

export const fromContractReason = {
  [ContractNotNeuteredReason.TOO_YOUNG]: NotNeuteredReason.TOO_YOUNG,
  [ContractNotNeuteredReason.BREED_PLANS]: NotNeuteredReason.BREED_PLANS,
  [ContractNotNeuteredReason.HEALTH_CONCERNS]:
    NotNeuteredReason.HEALTH_CONCERNS,
  [ContractNotNeuteredReason.OTHER]: NotNeuteredReason.OTHER,
};
