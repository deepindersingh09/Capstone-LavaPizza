import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type CardItem = { id: string; brand: string; last4: string; exp: string };
const STORAGE_KEY = '@lava_wallet_v1';

const seed: CardItem[] = [
  { id: 'c1', brand: 'Visa', last4: '4242', exp: '12/27' },
];

export default function Wallet() {
  const router = useRouter();
  const [cards, setCards] = useState<CardItem[]>([]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setCards(JSON.parse(raw));
      else {
        setCards(seed);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      }
    })();
  }, []);

  const persist = async (next: CardItem[]) => {
    setCards(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addDummy = async () => {
    const next = [
      ...cards,
      { id: String(Date.now()), brand: 'Mastercard', last4: '4444', exp: '05/28' },
    ];
    await persist(next);
  };

  const remove = (id: string) => {
    Alert.alert('Remove card?', 'You can add it again later.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await persist(cards.filter(c => c.id !== id));
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: CardItem }) => (
    <View style={styles.cardRow}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Ionicons name="card-outline" size={22} color="#111" />
        <View>
          <Text style={styles.cardTitle}>{item.brand} •••• {item.last4}</Text>
          <Text style={styles.cardSub}>Exp {item.exp}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => remove(item.id)}>
        <Ionicons name="trash-outline" size={20} color="#c00" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['left','right','bottom']}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <View style={{ width: 24 }} />
      </View>

      
      <FlatList
        data={cards}
        keyExtractor={(c) => c.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Ionicons name="card-outline" size={40} color="#999" />
            <Text style={{ marginTop: 8, color: '#777' }}>No cards yet</Text>
          </View>
        }
      />

      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBtn} onPress={addDummy}>
          <Ionicons name="add" size={20} color="#111" />
          <Text style={styles.addText}>Add Payment Method</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fbf3e6',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },

  cardRow: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#111' },
  cardSub: { fontSize: 12, color: '#777', marginTop: 2 },

  footer: { padding: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#eee' },
  addBtn: {
    backgroundColor: '#FFF1BF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  addText: { fontSize: 16, fontWeight: '700', color: '#111' },
});
