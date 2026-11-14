import type { UserAgendaItem } from '@ipetsadmin/contracts';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { TextButton } from '@/components/text-button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import {
  describeAgendaItem,
  getAgendaItemKey,
  getAgendaItemSymbol,
  groupAgendaByDay,
} from '@/features/agenda';
import { useTheme } from '@/hooks/use-theme';
import { formatDayHeading } from '@/utils/format-date';

import { AgendaRow } from './agenda-row';

const MAX_VISIBLE_ITEMS = 5;

type WeekSectionProps = {
  items: UserAgendaItem[];
  onOpenAll: () => void;
  onOpenItem: (petId: string) => void;
};

export function WeekSection({ items, onOpenAll, onOpenItem }: WeekSectionProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const now = new Date();
  const groups = groupAgendaByDay(items.slice(0, MAX_VISIBLE_ITEMS));
  const hiddenCount = items.length - MAX_VISIBLE_ITEMS;

  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <ThemedText type="label">{t('home.week.label')}</ThemedText>
        <TextButton title={t('home.week.all')} variant="strong" onPress={onOpenAll} />
      </View>
      {items.length === 0 && (
        <View style={styles.empty}>
          <SymbolView
            name={{ ios: 'calendar', android: 'event', web: 'event' }}
            size={18}
            tintColor={theme.textSecondary}
          />
          <ThemedText type="bodySmall" themeColor="textSecondary">
            {t('home.week.emptyTitle')}
          </ThemedText>
        </View>
      )}
      {groups.map((group) => (
        <View key={group.day.toDateString()}>
          <ThemedText type="label" themeColor="textSecondary" style={styles.day}>
            {formatDayHeading(group.day, now, i18n.language, t)}
          </ThemedText>
          {group.items.map((item) => {
            const { title, detail } = describeAgendaItem(item, t, i18n.language, {
              timeOnly: true,
            });

            return (
              <AgendaRow
                key={getAgendaItemKey(item)}
                title={title}
                detail={detail}
                symbol={getAgendaItemSymbol(item)}
                onPress={() => onOpenItem(item.petId)}
              />
            );
          })}
        </View>
      ))}
      {hiddenCount > 0 && (
        <TextButton
          title={t('home.week.more', { count: hiddenCount })}
          onPress={onOpenAll}
          style={styles.more}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.xs,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  empty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  day: {
    paddingTop: Spacing.xs,
  },
  more: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
  },
});
