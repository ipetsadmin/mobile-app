import { usePets } from "../data/use-pets";

export function useHasPets() {
  const { data: pets } = usePets();

  return { hasPets: (pets?.length ?? 0) > 0, isResolved: pets !== undefined };
}
