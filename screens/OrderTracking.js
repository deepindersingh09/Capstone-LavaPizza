// OrderTrackingScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import OrderService from '../../../services/OrderService'; // ✅ Default import

export default function OrderTrackingScreen({ route }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = OrderService.subscribeToOrder(
      orderId,
      (updatedOrder, error) => {
        setLoading(false);
        if (error) {
          console.error('Error tracking order:', error);
        } else {
          setOrder(updatedOrder);
        }
      }
    );

    return () => unsubscribe();
  }, [orderId]);

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      preparing: '👨‍🍳',
      ready: '✅',
      completed: '🎉',
      cancelled: '❌',
    };
    return icons[status] || '📦';
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF9933" />
        <Text style={styles.loadingText}>Loading order...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
        <Text style={styles.statusIcon}>{getStatusIcon(order.status)}</Text>
        <Text style={styles.status}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items?.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text>
              {item.quantity}x {item.name}
            </Text>
            <Text>${(item.quantity * item.price).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Info</Text>
        <Text>📍 {order.address}</Text>
        <Text>📞 {order.phone}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBF5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 14, color: '#999' },
  errorText: { fontSize: 16, color: '#F44336' },
  header: { backgroundColor: '#FF9933', padding: 24, alignItems: 'center' },
  orderId: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  statusIcon: { fontSize: 48, marginVertical: 12 },
  status: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
  section: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: { fontSize: 16, fontWeight: 'bold' },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: '#FF9933' },
});
