import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, useWindowDimensions } from 'react-native';
import { charts } from '../../data/registry';

export function generateStaticParams(): { slug: string }[] {
  return charts.map((c) => ({ slug: c.slug }));
}

export default function ChartScreen(): React.JSX.Element {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { width } = useWindowDimensions();
  const entry = charts.find((c) => c.slug === slug);
  return (
    <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center' }}>
      <Stack.Screen options={{ title: entry?.title ?? 'Chart' }} />
      {entry ? entry.render(width - 32) : <Text>Unknown chart: {slug}</Text>}
    </ScrollView>
  );
}
