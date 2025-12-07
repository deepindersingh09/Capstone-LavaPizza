/**
 * Firestore Service Layer
 * Handles all database operations with type safety
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  writeBatch,
  addDoc,
  WhereFilterOp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  Order,
  DeliveryAgent,
  Chat,
  Message,
  Earning,
  PayoutRequest,
  Notification,
} from "@/types/models";

// ============================================================================
// ORDERS
// ============================================================================

export const ordersCollection = collection(db, "orders");

export const createOrder = async (orderData: Omit<Order, "id">) => {
  const docRef = await addDoc(ordersCollection, {
    ...orderData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getOrder = async (orderId: string): Promise<Order | null> => {
  const docRef = doc(db, "orders", orderId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Order;
  }
  return null;
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"],
  location?: { latitude: number; longitude: number }
) => {
  const orderRef = doc(db, "orders", orderId);
  const statusChange = {
    status,
    timestamp: Timestamp.now(),
    location,
  };

  await updateDoc(orderRef,{
    status,
    updatedAt: Timestamp.now(),
    statusHistory: [...(await getOrder(orderId))!.statusHistory, statusChange],
  });
};

export const assignAgentToOrder = async (orderId: string, agentId: string, agentName: string) => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    assignedAgentId: agentId,
    assignedAgentName: agentName,
    status: "assigned",
    updatedAt: Timestamp.now(),
  });
};

// Real-time listener for pending orders
export const subscribeToPendingOrders = (callback: (orders: Order[]) => void) => {
  const q = query(ordersCollection, where("status", "==", "pending"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
    callback(orders);
  });
};

// Real-time listener for agent's assigned orders
export const subscribeToAgentOrders = (agentId: string, callback: (orders: Order[]) => void) => {
  const q = query(
    ordersCollection,
    where("assignedAgentId", "==", agentId),
    where("status", "in", ["assigned", "picked_up", "enroute"]),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
    callback(orders);
  });
};

// ============================================================================
// DELIVERY AGENTS
// ============================================================================

export const agentsCollection = collection(db, "agents");

export const createAgent = async (agentData: Omit<DeliveryAgent, "id">) => {
  const docRef = doc(db, "agents", agentData.id); // Use auth UID as document ID
  await setDoc(docRef, {
    ...agentData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getAgent = async (agentId: string): Promise<DeliveryAgent | null> => {
  const docRef = doc(db, "agents", agentId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as DeliveryAgent;
  }
  return null;
};

export const updateAgentLocation = async (
  agentId: string,
  location: { latitude: number; longitude: number },
  geohash: string
) => {
  const agentRef = doc(db, "agents", agentId);
  await updateDoc(agentRef, {
    currentLocation: location,
    geohash,
    lastLocationUpdate: Timestamp.now(),
  });
};

export const updateAgentStatus = async (agentId: string, status: DeliveryAgent["status"]) => {
  const agentRef = doc(db, "agents", agentId);
  await updateDoc(agentRef, {
    status,
    updatedAt: Timestamp.now(),
  });
};

export const setAgentOnline = async (agentId: string, isOnline: boolean) => {
  const agentRef = doc(db, "agents", agentId);
  await updateDoc(agentRef, {
    isOnline,
    status: isOnline ? "available" : "offline",
    updatedAt: Timestamp.now(),
  });
};

// Get nearby available agents (requires geohash filtering)
export const getNearbyAgents = async (
  geohashPrefix: string,
  radiusKm: number = 5
): Promise<DeliveryAgent[]> => {
  // This is a simplified version - in production, use geofirestore-js library
  const q = query(
    agentsCollection,
    where("isOnline", "==", true),
    where("status", "==", "available"),
    limit(10)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DeliveryAgent[];
};

// Real-time listener for agent data
export const subscribeToAgent = (agentId: string, callback: (agent: DeliveryAgent | null) => void) => {
  const docRef = doc(db, "agents", agentId);
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() } as DeliveryAgent);
    } else {
      callback(null);
    }
  });
};

// ============================================================================
// CHAT & MESSAGES
// ============================================================================

export const chatsCollection = collection(db, "chats");

export const createChat = async (orderId: string, customerId: string, agentId: string) => {
  const chatData = {
    orderId,
    participants: { customerId, agentId },
    unreadCount: { customer: 0, agent: 0 },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(chatsCollection, chatData);
  return docRef.id;
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  senderRole: "customer" | "agent",
  text: string,
  imageUrl?: string
) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const messageData = {
    chatId,
    senderId,
    senderRole,
    text,
    imageUrl,
    status: "sent",
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(messagesRef, messageData);

  // Update chat's last message
  const chatRef = doc(db, "chats", chatId);
  const recipientRole = senderRole === "customer" ? "agent" : "customer";
  await updateDoc(chatRef, {
    lastMessage: text,
    lastMessageTimestamp: Timestamp.now(),
    [`unreadCount.${recipientRole}`]: (await getDoc(chatRef)).data()?.unreadCount[recipientRole] + 1 || 1,
  });

  return docRef.id;
};

// Real-time listener for chat messages
export const subscribeToChatMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];
    callback(messages);
  });
};

// ============================================================================
// EARNINGS & PAYOUTS
// ============================================================================

export const earningsCollection = collection(db, "earnings");

export const createEarning = async (earningData: Omit<Earning, "id">) => {
  const docRef = await addDoc(earningsCollection, {
    ...earningData,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getAgentEarnings = async (
  agentId: string,
  startDate?: Date,
  endDate?: Date
): Promise<Earning[]> => {
  let q = query(earningsCollection, where("agentId", "==", agentId), orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Earning[];
};

export const requestPayout = async (payoutData: Omit<PayoutRequest, "id">) => {
  const payoutsRef = collection(db, "payoutRequests");
  const docRef = await addDoc(payoutsRef, {
    ...payoutData,
    requestedAt: Timestamp.now(),
  });
  return docRef.id;
};

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const notificationsCollection = collection(db, "notifications");

export const createNotification = async (notificationData: Omit<Notification, "id">) => {
  const docRef = await addDoc(notificationsCollection, {
    ...notificationData,
    read: false,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const subscribeToUserNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
  const q = query(
    notificationsCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notification[];
    callback(notifications);
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  const notifRef = doc(db, "notifications", notificationId);
  await updateDoc(notifRef, {
    read: true,
  });
};
