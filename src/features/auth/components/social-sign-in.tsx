import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SocialSignInProps = {
  onContinueWithGoogle: () => void;
  onContinueWithApple: () => void;
};

export function SocialSignIn({ onContinueWithGoogle, onContinueWithApple }: SocialSignInProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Button
        variant="outline"
        size="lg"
        title={t('signIn.continueWithGoogle')}
        icon={<ThemedText type="button">G</ThemedText>}
        onPress={onContinueWithGoogle}
      />
      {process.env.EXPO_OS === 'ios' && (
        <Button
          variant="outline"
          size="lg"
          title={t('signIn.continueWithApple')}
          icon={<SymbolView name="apple.logo" size={18} tintColor={theme.text} />}
          onPress={onContinueWithApple}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
});
