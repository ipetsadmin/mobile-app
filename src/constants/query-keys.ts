export const queryKeys = {
  pets: {
    all: ['pets'] as const,
    list: (userId?: string) => ['pets', 'list', userId] as const,
    detail: (petId: string) => ['pets', 'detail', petId] as const,
  },
  treatments: {
    all: ['treatments'] as const,
    list: (petId: string) => ['treatments', 'list', petId] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    list: (petId: string) => ['appointments', 'list', petId] as const,
  },
  account: {
    all: ['account'] as const,
    profile: (userId?: string) => ['account', 'profile', userId] as const,
  },
  agenda: {
    all: ['agenda'] as const,
    list: (userId?: string, days?: number) => ['agenda', 'list', userId, days] as const,
  },
};
