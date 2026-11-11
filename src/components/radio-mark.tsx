import { StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type RadioMarkProps = {
  selected: boolean;
};

export function RadioMark({ selected }: RadioMarkProps) {
  const theme = useTheme();

  return (
    <View style={[styles.radio, { borderColor: selected ? theme.primary : theme.muted }]}>
      {selected && <View style={[styles.dot, { backgroundColor: theme.primary }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  radio: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.pill,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: Radius.pill,
  },
});
