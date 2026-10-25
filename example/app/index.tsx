import { Link, Stack } from 'expo-router';
import { FlatList, Pressable, Text, StyleSheet } from 'react-native';
import { charts } from '../data/registry';

export default function Home(): React.JSX.Element {
  return (
    <>
      <Stack.Screen options={{ title: 'Skia Charts' }} />
      <FlatList data={charts} keyExtractor={(c) => c.slug} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/charts/[slug]', params: { slug: item.slug } }} asChild>
            <Pressable style={s.row}><Text style={s.title}>{item.title}</Text><Text>›</Text></Pressable>
          </Link>
        )} />
    </>
  );
}
const s = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, marginBottom: 8, borderRadius: 12, backgroundColor: '#F1F5F9' },
  title: { fontSize: 16, fontWeight: '600' },
});
