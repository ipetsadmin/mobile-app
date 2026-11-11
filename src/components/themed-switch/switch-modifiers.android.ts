import { semantics } from '@expo/ui/jetpack-compose/modifiers';

export function getSwitchModifiers(label: string) {
  return [semantics({ contentDescription: label })];
}
