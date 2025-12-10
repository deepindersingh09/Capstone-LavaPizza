/**
 * Core Data Models for Lava Pizza Delivery System
 * These types define the structure of data in Firestore
 */

import { Timestamp } from "firebase/firestore";

// ============================================================================
// USER & AUTH
// ============================================================================

export type UserRole = "customer" | "agent" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  profilePhoto?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Customer extends User {
  role: "customer";
  defaultAddress?: Address;
  favoriteItems?: string[]; // Product IDs
}

// ============================================================================
// DELIVERY AGENT
// ============================================================================

export type AgentStatus = "offline" | "available" | "enroute" | "delivering";

export type VehicleType = "bike" | "scooter" | "car";

export interface DeliveryAgent extends User {
  role: "agent";
  status: AgentStatus;
  vehicleType: VehicleType;
  vehicleNumber: string;
  vehiclePhotoUrl?: string;
  currentLocation: GeoPoint | null;
  geohash?: string; // For nearby queries
  currentOrderId?: string;
  rating: number;
  totalDeliveries: number;
  totalEarnings: number;
  isOnline: boolean;
  lastLocationUpdate?: Timestamp;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

// ============================================================================
// ORDERS
// ============================================================================

export type OrderStatus =
  | "pending" // Order placed, waiting for agent assignment
  | "assigned" // Agent assigned, not yet picked up
  | "picked_up" // Agent picked up from restaurant
  | "enroute" // Agent on the way to customer
  | "delivered" // Successfully delivered
  | "cancelled"; // Order cancelled

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tip: number;
  tax: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: Address;
  restaurantAddress: Address;
  assignedAgentId?: string;
  assignedAgentName?: string;
  assignedAgentPhone?: string;
  estimatedDeliveryTime?: Timestamp;
  actualDeliveryTime?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  statusHistory: OrderStatusChange[];
  chatId?: string; // Reference to chat with agent
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  customizations?: string[];
}

export interface OrderStatusChange {
  status: OrderStatus;
  timestamp: Timestamp;
  location?: GeoPoint;
  note?: string;
}

export interface Address {
  street: string;
  aptSuiteFloor?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  location?: GeoPoint; // Geocoded coordinates
}

// ============================================================================
// CHAT & MESSAGES
// ============================================================================

export type MessageStatus = "sending" | "sent" | "delivered" | "read";

export interface Chat {
  id: string;
  orderId: string;
  participants: {
    customerId: string;
    agentId: string;
  };
  lastMessage?: string;
  lastMessageTimestamp?: Timestamp;
  unreadCount: {
    customer: number;
    agent: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderRole: "customer" | "agent";
  text: string;
  imageUrl?: string;
  status: MessageStatus;
  createdAt: Timestamp;
  readAt?: Timestamp;
}

// ============================================================================
// EARNINGS & PAYMENTS
// ============================================================================

export type PayoutStatus = "pending" | "processing" | "completed" | "failed";

export type PayoutMethod = "bank_transfer" | "debit_card" | "paypal";

export interface Earning {
  id: string;
  agentId: string;
  orderId: string;
  amount: number;
  tip: number;
  total: number;
  createdAt: Timestamp;
}

export interface PayoutRequest {
  id: string;
  agentId: string;
  amount: number;
  method: PayoutMethod;
  accountDetails: string; // Encrypted or masked
  status: PayoutStatus;
  requestedAt: Timestamp;
  processedAt?: Timestamp;
  transactionId?: string;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export type NotificationType =
  | "order_assigned"
  | "order_picked_up"
  | "order_enroute"
  | "order_delivered"
  | "new_message"
  | "tip_received"
  | "payout_completed";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Timestamp;
}

// ============================================================================
// ANALYTICS & TRACKING
// ============================================================================

export interface DeliveryMetrics {
  agentId: string;
  date: string; // YYYY-MM-DD
  totalDeliveries: number;
  totalEarnings: number;
  totalTips: number;
  averageDeliveryTime: number; // minutes
  rating: number;
  onlineHours: number;
}
