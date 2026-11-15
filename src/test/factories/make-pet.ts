import {
  BeenWithSource,
  BirthDateSource,
  DogBreed,
  Gender,
  type PetResponse,
  PetStatus,
  Species,
  WeightUnit,
} from "@ipetsadmin/contracts"

export function makePet(overrides: Partial<PetResponse> = {}): PetResponse {
  return {
    id: "pet-1",
    name: "Luna",
    species: Species.DOG,
    breed: DogBreed.LABRADOR_RETRIEVER,
    gender: Gender.FEMALE,
    birthDate: {
      date: new Date("2023-03-10T12:00:00.000Z"),
      source: BirthDateSource.EXACT_DATE,
    },
    beenWithUsSince: {
      date: new Date("2023-05-01T12:00:00.000Z"),
      source: BeenWithSource.JOINED_LATER,
    },
    weight: 12.5,
    weightUnit: WeightUnit.KG,
    color: "",
    isNeutered: true,
    allergies: [],
    description: "",
    status: PetStatus.ACTIVE,
    ownerId: "user-1",
    vaccines: [],
    photos: [],
    createdAt: new Date("2023-05-01T12:00:00.000Z"),
    updatedAt: new Date("2023-05-01T12:00:00.000Z"),
    ...overrides,
  } as PetResponse
}
