import React, { useCallback, useEffect, useMemo, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

import NotificationCard, { NotificationItem } from '../../../../components/NotificationCard';

const STORAGE_KEY = '@lava_pizza_notifications_v1';

const seed: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Order Confirmed',
    body: 'Your Lava Pizza order #LP-10293 is confirmed. We’re firing up the oven! 🔥',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    type: 'order',
    read: false,
  },
  {
    id: 'n2',
    title: 'Delivery On The Way',
    body: 'Rider Jaspreet has picked up your order. ETA ~18 minutes.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: 'order',
    read: true,
  },
  {
    id: 'n3',
    title: '2-For-1 Tuesdays',
    body: 'Every Tuesday: buy any large, get another free. Use code TUE2X at checkout.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    type: 'promo',
    read: false,
  },
];

export default function NotificationScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load / seed
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setItems(JSON.parse(raw));
        } else {
          setItems(seed);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        }
      } catch (e) {
        console.warn('Failed to load notifications', e);
      }
    })();
  }, []);

  // Persist helper
  const persist = useCallback(async (next: NotificationItem[]) => {
    try {
      setItems(next);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to save notifications', e);
    }
  }, []);

  // Pull to refresh (mock)
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 700));
    setRefreshing(false);
  }, []);

  const unreadCount = useMemo(() => items.filter((i) => !i.read).length, [items]);

  const markAllRead = useCallback(() => {
    if (!items.length) return;
    const next = items.map((i) => ({ ...i, read: true }));
    persist(next);
  }, [items, persist]);

  const clearAll = useCallback(() => {
    if (!items.length) return;
    Alert.alert('Clear all?', 'This will remove all notifications.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => persist([]) },
    ]);
  }, [items.length, persist]);

  const toggleRead = useCallback(
    (id: string) => {
      const next = items.map((i) => (i.id === id ? { ...i, read: !i.read } : i));
      persist(next);
    },
    [items, persist]
  );

  const removeItem = useCallback(
    (id: string) => {
      const next = items.filter((i) => i.id !== id);
      persist(next);
    },
    [items, persist]
  );

  // Configure the Stack header (title, back arrow is automatic)
  useLayoutEffect(() => {
    navigation.setOptions?.({
      title: unreadCount ? `Notifications (${unreadCount})` : 'Notifications',
      headerBackTitleVisible: false,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={markAllRead}
            disabled={!items.length}
            style={{ paddingHorizontal: 8, opacity: items.length ? 1 : 0.4 }}
          >
            <Ionicons name="checkmark-done-outline" size={22} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={clearAll}
            disabled={!items.length}
            style={{ paddingHorizontal: 8, opacity: items.length ? 1 : 0.4 }}
          >
            <Ionicons name="trash-outline" size={22} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, unreadCount, items.length, markAllRead, clearAll]);

  // Optional subheader under the title for status text
  const Subheader = (
    <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 8 }}>
      <Text style={{ color: '#666' }}>
        {unreadCount ? `${unreadCount} unread` : 'All caught up 🎉'}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(i) => i.id}
      ListHeaderComponent={Subheader}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <TouchableOpacity
          onLongPress={() => removeItem(item.id)}
          onPress={() => toggleRead(item.id)}
          activeOpacity={0.8}
        >
          <NotificationCard item={item} />
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={{ alignItems: 'center', marginTop: 48 }}>
          <Ionicons name="notifications-off" size={40} />
          <Text style={{ marginTop: 8, color: '#777' }}>No notifications yet</Text>
        </View>
      }
      contentContainerStyle={{ paddingBottom: 32 }}
    />
  );
}

const styles = StyleSheet.create({
  // (no changes needed right now; kept for future)
});
