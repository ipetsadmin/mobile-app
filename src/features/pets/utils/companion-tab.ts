export const companionTabs = ['overview', 'health', 'appointments'] as const;

export type CompanionTab = (typeof companionTabs)[number];
