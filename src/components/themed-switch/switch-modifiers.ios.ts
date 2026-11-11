import { accessibilityLabel, labelsHidden } from '@expo/ui/swift-ui/modifiers';

export function getSwitchModifiers(label: string) {
  return [labelsHidden(), accessibilityLabel(label)];
}
