# Lava Pizza Delivery System - Implementation Guide

## 🎉 What's Been Completed

I've built a **production-ready foundation** for your Uber Eats-style delivery system. Here's everything that's done:

### ✅ Phase 0: Development Setup (100% Complete)
- **TypeScript Strict Mode**: All errors fixed, proper typing throughout
- **ESLint & Prettier**: Code quality tools configured with Expo presets
- **Git Hooks**: Pre-commit hooks with lint-staged for automatic formatting
- **Policy Pages**: Created refund, privacy, and terms pages

### ✅ Phase 1: Dark Mode System (100% Complete)
- **Design Tokens**: Centralized colors, spacing, typography, shadows
- **Theme Provider**: Context-based theming with AsyncStorage persistence
- **Theme Toggle**: Working toggle component for switching themes
- **Supports**: Both manual toggle and system preference

### ✅ Phase 2-3: Firebase Infrastructure (100% Complete)
- **Firebase Services**: Auth, Firestore, and Storage fully initialized
- **Complete Type System**: TypeScript models for:
  - Users (Customer, DeliveryAgent, Admin)
  - Orders with full lifecycle (pending → assigned → picked_up → enroute → delivered)
  - Chat & Messages with read receipts
  - Earnings & Payout Requests
  - Notifications
  - Real-time location tracking with GeoPoints

- **Firestore Service Layer** (`lib/services/firestoreService.ts`):
  - **Orders**: create, get, update status, assign agent, real-time listeners
  - **Agents**: create, get, update location/status, nearby queries
  - **Chat**: create chats, send messages, real-time message listeners
  - **Earnings**: track earnings, get agent earnings, request payouts
  - **Notifications**: create and subscribe to notifications

### 📦 Installed Packages
- `ngeohash` - For geolocation queries (find nearby agents)
- `eslint-config-expo` - Expo-specific linting rules
- Full Firebase SDK (auth, firestore, storage)

---

## 🚀 Next Steps to Complete the System

Here's what remains to build the **full Uber Eats experience**:

### Priority 1: Core Delivery Flow

#### A. Agent Order Management
**File**: `app/agent/activeDeliveries.tsx`

**Current State**: Shows mock orders
**Next Steps**:
```tsx
import { useEffect, useState } from 'react';
import { subscribeToPendingOrders, assignAgentToOrder } from '@/lib/services/firestoreService';
import { useAuth } from '@/contexts/AuthContext'; // Create this

export default function ActiveDeliveries() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Subscribe to pending orders in real-time
    const unsubscribe = subscribeToPendingOrders((newOrders) => {
      setOrders(newOrders);
    });
    return unsubscribe;
  }, []);

  const handleAcceptOrder = async (orderId) => {
    await assignAgentToOrder(orderId, user.id, user.name);
    await updateAgentStatus(user.id, 'enroute');
  };

  // Render orders with Accept/Reject buttons
}
```

#### B. Real-time GPS Location Tracking
**File**: Create `lib/services/locationService.ts`

```typescript
import * as Location from 'expo-location';
import { encode as encodeGeohash } from 'ngeohash';
import { updateAgentLocation } from './firestoreService';

export const startLocationTracking = async (agentId: string) => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return;

  // Update location every 10 seconds
  return await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      distanceInterval: 10, // meters
      timeInterval: 10000, // 10 seconds
    },
    async (location) => {
      const { latitude, longitude } = location.coords;
      const geohash = encodeGeohash(latitude, longitude, 7);

      await updateAgentLocation(agentId, { latitude, longitude }, geohash);
    }
  );
};
```

**Usage in** `app/agent/dashboard.tsx`:
```tsx
useEffect(() => {
  let subscription;
  if (agentStatus === 'online') {
    startLocationTracking(user.id).then(sub => subscription = sub);
  }
  return () => subscription?.remove();
}, [agentStatus]);
```

#### C. Customer Order Tracking
**File**: `app/order_tracking/[orderId].tsx`

**Current State**: Mock driver location
**Next Steps**:
```tsx
import { subscribeToAgent } from '@/lib/services/firestoreService';

export default function OrderTracking() {
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [agent Location, setAgentLocation] = useState(null);

  useEffect(() => {
    // Subscribe to order updates
    const orderUnsub = onSnapshot(doc(db, 'orders', orderId), (doc) => {
      setOrder(doc.data());
    });

    return orderUnsub;
  }, [orderId]);

  useEffect(() => {
    if (!order?.assignedAgentId) return;

    // Subscribe to agent's real-time location
    const agentUnsub = subscribeToAgent(order.assignedAgentId, (agent) => {
      setAgentLocation(agent?.currentLocation);
    });

    return agentUnsub;
  }, [order?.assignedAgentId]);

  // Render map with agent's live location
}
```

### Priority 2: Chat System

#### Create Chat Screen
**File**: Create `app/chat/[chatId].tsx`

```tsx
import { useEffect, useState } from 'react';
import { subscribeToChatMessages, sendMessage } from '@/lib/services/firestoreService';

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToChatMessages(chatId, (newMessages) => {
      setMessages(newMessages);
    });
    return unsubscribe;
  }, [chatId]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    await sendMessage(
      chatId,
      user.id,
      user.role, // 'customer' or 'agent'
      inputText
    );

    setInputText('');
  };

  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => <MessageBubble message={item} isMe={item.senderId === user.id} />}
      // ... input field with handleSend
    />
  );
}
```

### Priority 3: Tipping System

#### Add Tip Modal on Delivery Completion
**File**: Create `components/TipModal.tsx`

```tsx
import { useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const TIP_PRESETS = [0, 2, 5, 10];

export function TipModal({ orderId, visible, onClose }) {
  const [selectedTip, setSelectedTip] = useState(0);
  const [customTip, setCustomTip] = useState('');

  const handleSubmitTip = async () => {
    const tipAmount = customTip ? parseFloat(customTip) : selectedTip;

    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      tip: tipAmount,
      total: order.subtotal + order.deliveryFee + tipAmount
    });

    // Create earning record for agent
    await createEarning({
      agentId: order.assignedAgentId,
      orderId,
      amount: order.deliveryFee,
      tip: tipAmount,
      total: order.deliveryFee + tipAmount
    });

    onClose();
  };

  return (
    <Modal visible={visible} transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add a tip</Text>

          {/* Preset tip buttons */}
          <View style={styles.presets}>
            {TIP_PRESETS.map(amount => (
              <TouchableOpacity
                key={amount}
                onPress={() => setSelectedTip(amount)}
                style={[styles.presetBtn, selected Tip === amount && styles.selected]}
              >
                <Text>${amount}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom tip input */}
          <TextInput
            placeholder="Custom amount"
            keyboardType="decimal-pad"
            value={customTip}
            onChangeText={setCustomTip}
          />

          <TouchableOpacity onPress={handleSubmitTip} style={styles.submitBtn}>
            <Text>Confirm Tip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
```

### Priority 4: Push Notifications

#### Setup Firebase Cloud Messaging
**File**: Create `lib/services/notificationService.ts`

```typescript
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { createNotification } from './firestoreService';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async (userId: string) => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  // Save token to user document
  await updateDoc(doc(db, 'users', userId), { pushToken: token });

  return token;
};

export const sendOrderNotification = async (
  userId: string,
  title: string,
  body: string,
  data?: any
) => {
  await createNotification({
    userId,
    type: 'order_assigned',
    title,
    body,
    data,
  });

  // Trigger actual push notification via Cloud Function
};
```

### Priority 5: Firestore Security Rules

**File**: Create `firestore.rules`

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function isAgent() {
      return isAuthenticated() && get(/databases/$(database)/documents/agents/$(request.auth.uid)).data.role == 'agent';
    }

    // Orders
    match /orders/{orderId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.customerId)
                    || isOwner(resource.data.assignedAgentId)
                    || isAgent();
    }

    // Agents
    match /agents/{agentId} {
      allow read: if true; // Public read for customer tracking
      allow write: if isOwner(agentId);
    }

    // Chats
    match /chats/{chatId} {
      allow read, write: if isAuthenticated();

      match /messages/{messageId} {
        allow read, create: if isAuthenticated();
      }
    }

    // Earnings (agent only)
    match /earnings/{earningId} {
      allow read: if isOwner(resource.data.agentId);
      allow create: if isAgent();
    }
  }
}
```

---

## 🎨 Applying Dark Mode to Existing Screens

Every screen should use the `useTheme()` hook:

```tsx
import { useTheme } from '@/contexts/ThemeContext';

export default function SomeScreen() {
  const { theme, spacing, borderRadius } = useTheme();

  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Hello</Text>
      <TouchableOpacity
        style={{
          backgroundColor: theme.primary,
          padding: spacing.md,
          borderRadius: borderRadius.md
        }}
      >
        <Text style={{ color: theme.textInverse }}>Button</Text>
      </TouchableOpacity>
    </View>
  );
}
```

**Screens to update**:
- `app/agent/dashboard.tsx`
- `app/agent/activeDeliveries.tsx`
- `app/agent/earnings.tsx`
- `app/agent/profile.tsx`
- All customer-facing screens

---

## 📊 Testing Your Implementation

### 1. Firebase Console Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Open your `lava-pizza` project
3. Create Firestore database (production mode initially)
4. Add test data manually or use the Firestore emulator

### 2. Test Real-time Features
```tsx
// In any component
useEffect(() => {
  const unsubscribe = subscribeToPendingOrders((orders) => {
    console.log('📦 New orders:', orders);
  });
  return unsubscribe;
}, []);
```

### 3. Test Location Tracking
- Run on physical device (location doesn't work well in simulators)
- Check Firestore console to see `currentLocation` updating

---

## 🔧 Common Integration Points

### Creating an Order (Customer)
```typescript
const orderId = await createOrder({
  customerId: user.id,
  customerName: user.name,
  items: cartItems,
  subtotal: calculateSubtotal(),
  deliveryFee: 5.99,
  tip: 0,
  tax: calculateTax(),
  total: calculateTotal(),
  status: 'pending',
  deliveryAddress: selectedAddress,
  restaurantAddress: RESTAURANT_LOCATION,
  statusHistory: [{
    status: 'pending',
    timestamp: Timestamp.now()
  }]
});

router.push(`/order_tracking/${orderId}`);
```

### Agent Going Online
```typescript
await setAgentOnline(user.id, true);
await startLocationTracking(user.id);
```

### Agent Accepting Order
```typescript
await assignAgentToOrder(orderId, agentId, agentName);
await updateOrderStatus(orderId, 'assigned');
```

---

## 🚀 Cloud Functions (Optional but Recommended)

Create `functions/src/index.ts`:

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Auto-assign nearby agent when order is created
export const autoAssignAgent = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();

    if (order.status !== 'pending') return;

    // Find nearby available agents
    const agentsSnapshot = await admin.firestore()
      .collection('agents')
      .where('status', '==', 'available')
      .where('isOnline', '==', true)
      .limit(5)
      .get();

    if (agentsSnapshot.empty) {
      console.log('No available agents');
      return;
    }

    // Assign to first available agent
    const agent = agentsSnapshot.docs[0];
    await snap.ref.update({
      assignedAgentId: agent.id,
      assignedAgentName: agent.data().name,
      status: 'assigned'
    });

    // Send push notification to agent
    // ...
  });

// Send notification when order status changes
export const notifyStatusChange = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status === after.status) return;

    // Send notification to customer
    await admin.firestore().collection('notifications').add({
      userId: after.customerId,
      type: `order_${after.status}`,
      title: `Order ${after.status}`,
      body: getStatusMessage(after.status),
      createdAt: admin.firestore.Timestamp.now(),
      read: false
    });
  });
```

---

## 📝 Key Files Reference

| File | Purpose |
|------|---------|
| `types/models.ts` | All TypeScript interfaces |
| `lib/firebase.ts` | Firebase initialization |
| `lib/services/firestoreService.ts` | Database operations |
| `constants/designTokens.ts` | Theme colors & spacing |
| `contexts/ThemeContext.tsx` | Dark mode provider |

---

## 💡 Pro Tips

1. **Always use real-time listeners** for orders and agent location - never poll!
2. **Use geohashes** for efficient nearby agent queries (already set up)
3. **Implement optimistic UI updates** - update UI immediately, sync to Firestore in background
4. **Add loading states** everywhere with Firestore operations
5. **Handle offline mode** - Firestore has built-in offline support, but add UI indicators
6. **Test with multiple devices** - Use two phones to test agent-customer interactions

---

## 🎯 Immediate Next Actions

1. **Update agent dashboard** to use `subscribeToPendingOrders()`
2. **Implement location tracking** in `app/agent/dashboard.tsx`
3. **Connect order tracking** map to real agent location
4. **Add chat button** to order tracking screen
5. **Implement tip modal** on delivery completion
6. **Apply dark mode** to all remaining screens

---

## 🤝 Need Help?

All the foundation is built. The remaining work is primarily:
- **Connecting UI to Firestore** (use the provided service functions)
- **Implementing real-time subscriptions** (use onSnapshot listeners)
- **Adding location tracking** (expo-location + geohash)

Every service function is fully typed and documented. IntelliSense will guide you!

---

Generated by Claude Code 🤖
