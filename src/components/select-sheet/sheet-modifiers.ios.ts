import { ignoreSafeArea } from '@expo/ui/swift-ui/modifiers';

export const sheetModifiers = [ignoreSafeArea({ regions: 'container', edges: 'bottom' })];
