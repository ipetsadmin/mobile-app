import { Host, Switch } from '@expo/ui';

import { useTheme } from '@/hooks/use-theme';

import { getSwitchModifiers } from './switch-modifiers';

type ThemedSwitchProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function ThemedSwitch({ label, value, onValueChange }: ThemedSwitchProps) {
  const theme = useTheme();

  return (
    <Host matchContents seedColor={theme.primary}>
      <Switch value={value} onValueChange={onValueChange} modifiers={getSwitchModifiers(label)} />
    </Host>
  );
}
