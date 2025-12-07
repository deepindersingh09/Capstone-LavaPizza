/**
 * Auth Context
 * Manages user authentication state and provides user data
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import type { User, DeliveryAgent, Customer } from "@/types/models";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAgent: boolean;
  isCustomer: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  agentData: DeliveryAgent | null;
  customerData: Customer | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [agentData, setAgentData] = useState<DeliveryAgent | null>(null);
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        // Load user data from Firestore
        await loadUserData(firebaseUser.uid);
      } else {
        setUser(null);
        setAgentData(null);
        setCustomerData(null);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Try to load from users collection first
      const userDoc = await getDoc(doc(db, "users", userId));

      if (userDoc.exists()) {
        const userData = { id: userDoc.id, ...userDoc.data() } as User;
        setUser(userData);

        // Load role-specific data
        if (userData.role === "agent") {
          const agentDoc = await getDoc(doc(db, "agents", userId));
          if (agentDoc.exists()) {
            setAgentData({ id: agentDoc.id, ...agentDoc.data() } as DeliveryAgent);
          }
        } else if (userData.role === "customer") {
          const customerDoc = await getDoc(doc(db, "customers", userId));
          if (customerDoc.exists()) {
            setCustomerData({ id: customerDoc.id, ...customerDoc.data() } as Customer);
          }
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const isAgent = user?.role === "agent";
  const isCustomer = user?.role === "customer";
  const isAdmin = user?.role === "admin";

  const value: AuthContextType = {
    user,
    firebaseUser,
    isAgent,
    isCustomer,
    isAdmin,
    isLoading,
    agentData,
    customerData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
