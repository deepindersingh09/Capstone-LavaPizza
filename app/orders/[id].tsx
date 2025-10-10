import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type StageKey = 'prepping' | 'baking' | 'onway' | 'delivered';
type Stage = { key: StageKey; label: string; icon: keyof typeof Ionicons.glyphMap };

const STAGES: Stage[] = [
  { key: 'prepping',  label: 'Preparing',          icon: 'restaurant-outline' },
  { key: 'baking',    label: 'Baking',             icon: 'flame-outline' },
  { key: 'onway',     label: 'Out for delivery',   icon: 'bicycle-outline' },
  { key: 'delivered', label: 'Delivered',          icon: 'checkmark-done-outline' },
];

// In a real app, fetch by id. For now, demo picks a stage from the id.
function mockStageFromId(id: string): StageKey {
  const idx = parseInt(id.slice(-1), 10) % 4;
  return ['prepping', 'baking', 'onway', 'delivered'][idx] as StageKey;
}

export default function OrderStatus() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const current: StageKey = useMemo(() => mockStageFromId(id || '0'), [id]);

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Order #{id}</Text>
        <Text style={styles.sub}>We’re on it! Track your order below.</Text>
      </View>

      {/* Progress tracker */}
      <View style={styles.timeline}>
        {STAGES.map((s, i) => {
          const isDone = STAGES.findIndex(x => x.key === current) >= i;
          return (
            <View key={s.key} style={styles.step}>
              <View style={[styles.dot, isDone && styles.dotActive]}>
                <Ionicons name={s.icon} size={16} color={isDone ? '#111' : '#999'} />
              </View>
              {i < STAGES.length - 1 && (
                <View style={[styles.bar, isDone && styles.barActive]} />
              )}
              <Text style={[styles.stepLabel, isDone && styles.stepLabelActive]}>{s.label}</Text>
            </View>
          );
        })}
      </View>

      {/* ETA card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Estimated Time</Text>
        <Text style={styles.infoBig}>~ 18–25 min</Text>
        <Text style={styles.infoSmall}>We’ll update this if anything changes.</Text>
      </View>

      {/* Address / rider (placeholder) */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Courier</Text>
        <Text style={styles.infoLine}>Jaspreet (AB-1234)</Text>
        <Text style={styles.infoTitle}>Delivering to</Text>
        <Text style={styles.infoLine}>1234 10 St SW, Calgary</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16, gap: 14 },

  headerCard: {
    backgroundColor: '#FFF1BF',
    borderRadius: 14,
    padding: 14,
  },
  title: { fontSize: 18, fontWeight: '800', color: '#111' },
  sub: { color: '#333', marginTop: 4 },

  timeline: {
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    borderRadius: 14,
    padding: 14,
  },
  step: { marginBottom: 12, position: 'relative' },
  dot: {
    width: 28, height: 28, borderRadius: 16,
    borderWidth: 1, borderColor: '#ddd',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  dotActive: { backgroundColor: '#FFF1BF', borderColor: '#f1cc4a' },
  bar: {
    position: 'absolute', left: 14, top: 28, width: 2, height: 18,
    backgroundColor: '#eee',
  },
  barActive: { backgroundColor: '#f1cc4a' },
  stepLabel: { marginTop: 6, color: '#666' },
  stepLabelActive: { color: '#111', fontWeight: '700' },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    gap: 4,
  },
  infoTitle: { fontSize: 12, color: '#666' },
  infoBig: { fontSize: 18, fontWeight: '800', color: '#111' },
  infoSmall: { fontSize: 12, color: '#666' },
  infoLine: { fontSize: 14, color: '#111' },
});
