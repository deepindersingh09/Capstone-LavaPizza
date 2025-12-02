// services/OrderService.js
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

const ORDERS_COLLECTION = "orders";

/**
 * Remove undefined fields
 */
function cleanObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
}

/**
 * Clean nested cart items
 */
function sanitizeItems(items = []) {
  return items.map((item) => cleanObject(item));
}

class OrderService {
  /**
   * Create new order
   */
  async createOrder(orderData) {
    try {
      if (!db) throw new Error("Firestore not initialized");

      const safeData = cleanObject({
        userId: orderData.userId || "guest",
        customerName:
          orderData.customerName || orderData.email?.split("@")[0] || "Customer",
        items: sanitizeItems(orderData.items), // 🔥 FIXED
        total: orderData.total || 0,
        phone: orderData.phone || "",
        address: orderData.address || "",
        paymentMethod: orderData.paymentMethod || "Cash",
        notes: orderData.notes || "",
        status: "pending",
        timestamp: Timestamp.now(),
        updatedAt: Timestamp.now(),
        statusHistory: {
          pending: Timestamp.now(),
        },
      });

      const docRef = await addDoc(collection(db, ORDERS_COLLECTION), safeData);

      return { success: true, orderId: docRef.id };
    } catch (error) {
      console.error("❌ Error creating order:", error);
      throw new Error("Failed to place order: " + error.message);
    }
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId) {
    if (!userId) throw new Error("User ID required");
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      timestamp: d.data()?.timestamp?.toDate(),
    }));
  }

  /**
   * Real-time orders
   */
  subscribeToUserOrders(userId, callback) {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    return onSnapshot(
      q,
      (snap) => {
        const orders = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          timestamp: d.data()?.timestamp?.toDate(),
        }));
        callback(orders, null);
      },
      (err) => callback([], err)
    );
  }

  /**
   * Single order
   */
  async getOrderById(orderId) {
    const ref = doc(db, ORDERS_COLLECTION, orderId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Order not found");

    return {
      id: snap.id,
      ...snap.data(),
      timestamp: snap.data()?.timestamp?.toDate(),
    };
  }

  /**
   * Subscribe to one order
   */
  subscribeToOrder(orderId, callback) {
    const ref = doc(db, ORDERS_COLLECTION, orderId);

    return onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) return callback(null, new Error("Order not found"));
        callback(
          {
            id: snap.id,
            ...snap.data(),
            timestamp: snap.data()?.timestamp?.toDate(),
          },
          null
        );
      },
      (err) => callback(null, err)
    );
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId) {
    const ref = doc(db, ORDERS_COLLECTION, orderId);
    const snap = await getDoc(ref);

    if (!snap.exists()) throw new Error("Order not found");
    if (snap.data().status !== "pending")
      throw new Error("Only pending orders can be cancelled");

    await updateDoc(ref, {
      status: "cancelled",
      updatedAt: Timestamp.now(),
      "statusHistory.cancelled": Timestamp.now(),
    });

    return { success: true };
  }
}

export default new OrderService();
