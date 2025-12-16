import React, { useCallback, useEffect, useMemo, useState, useLayoutEffect } from "react";
import { View, Text, FlatList, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

import NotificationCard, { NotificationItem } from "../../../../components/NotificationCard";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

export default function NotificationScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [uid, setUid] = useState<string | null>(null);

  // Track logged-in user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
      if (!user) setItems([]);
    });
    return unsub;
  }, []);

  // Realtime Firestore listener
  useEffect(() => {
    if (!uid) return;

    const ref = collection(db, "users", uid, "notifications");
    const q = query(ref, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const next: NotificationItem[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            title: data.title ?? "",
            body: data.body ?? "",
            createdAt: data.createdAt ?? new Date().toISOString(),
            type: data.type ?? "promo",
            read: !!data.read,
          };
        });
        setItems(next);
      },
      (err) => {
        console.warn("Failed to load notifications from Firestore", err);
      }
    );

    return unsub;
  }, [uid]);

  const unreadCount = useMemo(() => items.filter((i) => !i.read).length, [items]);

  const onRefresh = useCallback(async () => {
    // With realtime onSnapshot, refresh is mostly just UI feedback
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 500));
    setRefreshing(false);
  }, []);

  const markAllRead = useCallback(async () => {
    if (!uid || !items.length) return;

    try {
      const batch = writeBatch(db);
      items.forEach((i) => {
        if (!i.read) {
          const ref = doc(db, "users", uid, "notifications", i.id);
          batch.update(ref, { read: true });
        }
      });
      await batch.commit();
    } catch (e) {
      console.warn("Failed to mark all read", e);
    }
  }, [uid, items]);

  const clearAll = useCallback(() => {
    if (!uid || !items.length) return;

    Alert.alert("Clear all?", "This will remove all notifications.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          try {
            const batch = writeBatch(db);
            items.forEach((i) => {
              const ref = doc(db, "users", uid, "notifications", i.id);
              batch.delete(ref);
            });
            await batch.commit();
          } catch (e) {
            console.warn("Failed to clear all", e);
          }
        },
      },
    ]);
  }, [uid, items]);

  const toggleRead = useCallback(
    async (id: string) => {
      if (!uid) return;
      const found = items.find((x) => x.id === id);
      if (!found) return;

      try {
        const ref = doc(db, "users", uid, "notifications", id);
        await updateDoc(ref, { read: !found.read });
      } catch (e) {
        console.warn("Failed to toggle read", e);
      }
    },
    [uid, items]
  );

  const removeItem = useCallback(
    async (id: string) => {
      if (!uid) return;
      try {
        const ref = doc(db, "users", uid, "notifications", id);
        await deleteDoc(ref);
      } catch (e) {
        console.warn("Failed to remove notification", e);
      }
    },
    [uid]
  );

  useLayoutEffect(() => {
    navigation.setOptions?.({
      title: unreadCount ? `Notifications (${unreadCount})` : "Notifications",
      headerBackTitleVisible: false,
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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

  const Subheader = (
    <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 8 }}>
      <Text style={{ color: "#666" }}>
        {uid ? (unreadCount ? `${unreadCount} unread` : "All caught up 🎉") : "Please sign in"}
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
        <View style={{ alignItems: "center", marginTop: 48 }}>
          <Ionicons name="notifications-off" size={40} />
          <Text style={{ marginTop: 8, color: "#777" }}>
            {uid ? "No notifications yet" : "Sign in to see notifications"}
          </Text>
        </View>
      }
      contentContainerStyle={{ paddingBottom: 32 }}
    />
  );
}
