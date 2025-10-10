import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Order = {
  id: string;
  code: string;         // e.g., LP-10293
  items: string[];      // names
  placedAt: string;     // ISO string
  stage: 'prepping' | 'baking' | 'onway' | 'delivered';
};

const seed: Order[] = [
  {
    id: '10293',
    code: 'LP-10293',
    items: ['Volcanic Pizza (L)', 'Cheesy Garlic Bread'],
    placedAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    stage: 'baking',
  },
  {
    id: '10287',
    code: 'LP-10287',
    items: ['Shahi Fries', 'Paneer Wrap'],
    placedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    stage: 'onway',
  },
];

const stageText: Record<Order['stage'], string> = {
  prepping: 'Preparing',
  baking: 'Baking',
  onway: 'Out for delivery',
  delivered: 'Delivered',
};

export default function OrdersList() {
  const router = useRouter();
  const [orders] = useState<Order[]>(seed);

  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`./orders/${item.id}`)}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.code}>{item.code}</Text>
        <Text style={styles.stage}>{stageText[item.stage]}</Text>
      </View>

      <Text style={styles.items} numberOfLines={1}>
        {item.items.join(' · ')}
      </Text>

      <View style={styles.row}>
        <Ionicons name="time-outline" size={14} color="#666" />
        <Text style={styles.meta}>
          Placed {new Date(item.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={orders}
      keyExtractor={(o) => o.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 12 }}
      renderItem={renderItem}
      ListEmptyComponent={
        <View style={{ alignItems: 'center', marginTop: 48 }}>
          <Text style={{ color: '#777' }}>No active orders</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    gap: 6,
  },
  code: { fontSize: 16, fontWeight: '700', color: '#111' },
  stage: { fontSize: 12, fontWeight: '700', color: '#111' },
  items: { fontSize: 12, color: '#444' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  meta: { fontSize: 12, color: '#666' },
});
