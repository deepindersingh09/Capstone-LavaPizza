import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/lib/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

export default function Profile() {
  const router = useRouter();
  const [userName, setUserName] = useState('Guest');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isGuest, setIsGuest] = useState(false);

  // ✅ Load user data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      console.log('👤 Account Page: Loading user data...');

      // Check if user is in guest mode FIRST
      const guestMode = await AsyncStorage.getItem('@guest_mode');
      console.log('👤 Guest mode value:', guestMode);

      if (guestMode === '1') {
        console.log('👤 User is in GUEST mode');
        setUserName('Guest');
        setUserEmail('');
        setUserPhone('');
        setIsGuest(true);
        return;
      }

      // Not guest mode, load actual user data
      const firstName = await AsyncStorage.getItem('@user_first_name');
      const lastName = await AsyncStorage.getItem('@user_last_name');

      // Get email and other info from Firebase auth
      const currentUser = auth.currentUser;

      if (firstName) {
        const fullName = lastName ? `${firstName} ${lastName}` : firstName;
        setUserName(fullName);
        setUserEmail(currentUser?.email || '');
        setUserPhone(currentUser?.phoneNumber || '');
        setIsGuest(false);
        console.log('👤 Loaded user:', fullName);
      } else {
        // Fallback to Guest if no data
        console.log('👤 No user data found, showing Guest');
        setUserName('Guest');
        setUserEmail('');
        setUserPhone('');
        setIsGuest(true);
      }
    } catch (e) {
      console.error('❌ Failed to load user data', e);
      setUserName('Guest');
      setIsGuest(true);
    }
  };

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      if (auth.currentUser) {
        await signOut(auth);
      }

      // Clear local storage
      await AsyncStorage.removeItem('@guest_mode');
      await AsyncStorage.removeItem('@user_first_name');
      await AsyncStorage.removeItem('@user_last_name');
      await AsyncStorage.removeItem('@order_mode');

      // Navigate to login
      router.replace('/auth/login');
    } catch (e) {
      console.warn('Logout failed', e);
    }
  };

  const options = [
    "Notifications",
    "General",
    "Payment",
    "Order History",
    "Track Order",
    "Update Delivery Info",
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileCard}>
          <View style={styles.profileText}>
            {isGuest ? (
              <View style={styles.guestInfo}>
                <Text style={styles.welcomeText}>Welcome,</Text>
                <Text style={styles.guestText}>Guest!</Text>
              </View>
            ) : (
              <>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{userName}</Text>
                  <TouchableOpacity>
                    <MaterialIcons name="edit" size={20} color="black" />
                  </TouchableOpacity>
                </View>
                {userEmail ? <Text style={styles.email}>{userEmail}</Text> : null}
                {userPhone ? <Text style={styles.phone}>{userPhone}</Text> : null}
              </>
            )}
          </View>
        </View>

        {/* Guest Mode Login Prompt Banner */}
        {isGuest && (
          <TouchableOpacity
            style={styles.loginPromptBanner}
            onPress={() => router.push('/auth/login')}
          >
            <View style={styles.bannerContent}>
              <Ionicons name="person-circle-outline" size={24} color="#D97706" />
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>Sign in to your account</Text>
                <Text style={styles.bannerSubtitle}>Access your orders and saved items</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D97706" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Options Menu */}
      <View style={styles.options}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.optionRow}
            onPress={() => {
              if (option === "General") router.push("/general");
              else if (option === "Notifications")
                router.push("/notification_setting");
              else if (option === "Payment") router.push("/payment");
              else if (option === "Order History")
                router.push("/orders");
              else if (option === "Track Order")
                router.push("/order_tracking/12345");
              else if (option === "Update Delivery Info")
                router.push("/delivery_address");
            }}
          >
            <Text style={styles.optionText}>{option}</Text>
            <Ionicons name="chevron-forward" size={22} color="black" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#333" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>
          {isGuest ? 'Exit Guest Mode' : 'Log Out of Account'}
        </Text>
      </TouchableOpacity>

      {/* Bottom Spacing */}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 16,
  },
  profileSection: {
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  profilepicture: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    marginLeft: 10,
  },
  profileText: {
    flex: 1,
    marginLeft: 10
  },

  // Guest Mode Styles
  guestInfo: {
    flexDirection: 'column',
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  guestText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E53935',
    marginTop: 2,
  },

  // Login Prompt Banner
  loginPromptBanner: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#FFE082',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D97706',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#92400E',
  },

  // User Info Styles
  nameRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
    marginLeft: 2
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 2,
    marginTop: 4,
  },
  phone: {
    fontSize: 16,
    fontWeight: "600",
    color: "gray",
    marginLeft: 2,
    marginTop: 2,
  },

  // Options Menu
  options: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    marginTop: 10,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  optionText: {
    fontSize: 16
  },

  // Logout Button
  logoutButton: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold"
  },
});