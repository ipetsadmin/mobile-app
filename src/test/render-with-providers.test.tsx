import { useQuery } from '@tanstack/react-query';
import { waitFor } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { createTestQueryClient, renderHookWithProviders, renderWithProviders } from './render-with-providers';

function Label() {
  const { t } = useTranslation();

  return <Text>{t('agenda.allDay')}</Text>;
}

describe('renderWithProviders', () => {
  it('renders translated text in spanish', async () => {
    const { getByText } = await renderWithProviders(<Label />);

    expect(getByText('Todo el día')).toBeTruthy();
  });

  it('exposes the query client used by the tree', async () => {
    const queryClient = createTestQueryClient();
    const { queryClient: used } = await renderWithProviders(<Label />, queryClient);

    expect(used).toBe(queryClient);
  });
});

describe('renderHookWithProviders', () => {
  it('resolves a query through the provided client', async () => {
    const { result } = await renderHookWithProviders(() =>
      useQuery({ queryKey: ['value'], queryFn: async () => 42 }),
    );

    await waitFor(() => expect(result.current.data).toBe(42));
  });
});
