import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@notification_settings_v1";

type Settings = {
  emailOffers: boolean;
  phoneNumber: string;
  textOffers: boolean;
};

export default function NotificationSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    emailOffers: true,
    phoneNumber: "825-123-0654",
    textOffers: true,
  });
  const [showPhone, setShowPhone] = useState(false);

  // Load saved settings
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setSettings(JSON.parse(raw));
      } catch (e) {
        console.warn("Failed to load settings", e);
      }
    })();
  }, []);

  // Save settings when changed
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (e) {
        console.warn("Failed to save settings", e);
      }
    })();
  }, [settings]);

  const toggleEmailOffers = () => {
    setSettings((prev) => ({ ...prev, emailOffers: !prev.emailOffers }));
  };

  const toggleTextOffers = () => {
    setSettings((prev) => ({ ...prev, textOffers: !prev.textOffers }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
            onPress={() => router.push('/(drawer)/(tabs)/account')} 
            style={styles.backButton}
        >     
           <Ionicons name="arrow-back" size={24} color="black" />
         </TouchableOpacity>
         <Text style={styles.headerTitle}>Notifications</Text>
       </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Push Notifications */}
        <TouchableOpacity style={styles.menuItem}>
          <View>
            <Text style={styles.menuTitle}>Push Notifications</Text>
            <Text style={styles.menuSubtitle}>Manage Push Notification Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#666" />
        </TouchableOpacity>

        {/* Email Offers */}
        <View style={styles.switchSection}>
          <Text style={styles.switchLabel}>Receive email offers and alerts</Text>
          <Switch
            value={settings.emailOffers}
            onValueChange={toggleEmailOffers}
            trackColor={{ false: "#ddd", true: "#FFD700" }}
            thumbColor="#fff"
            ios_backgroundColor="#ddd"
          />
        </View>

        {/* Phone Number */}
        <View style={styles.phoneSection}>
          <Text style={styles.phoneLabel}>Mobile Phone Number</Text>
          <View style={styles.phoneRow}>
            <Text style={styles.phoneNumber}>
              {showPhone ? settings.phoneNumber : settings.phoneNumber.replace(/\d(?=\d{4})/g, "*")}
            </Text>
            <TouchableOpacity onPress={() => setShowPhone(!showPhone)}>
              <Ionicons 
                name={showPhone ? "eye-off-outline" : "eye-outline"} 
                size={24} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Text Offers */}
        <View style={styles.textOffersSection}>
          <View style={styles.textOffersHeader}>
            <Text style={styles.textOffersTitle}>Receive text offers and alerts</Text>
            <TouchableOpacity>
              <MaterialIcons name="check-box" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={styles.textOffersDesc}>
            I agree to receive text offers from Lava Pizza YYC.
          </Text>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            By enabling the option, you agree to receive promotional text messages 
            from Lava Pizza YYC at the number provided above. Consent is not required 
            to make a purchase. Message frequency may vary. Standard message and data 
            rates may apply.
          </Text>

          <Text style={styles.termsText}>
            Consent is not required to make a purchase. You can opt out at any time 
            by replying STOP. For help, reply HELP.
          </Text>

          <Text style={styles.termsText}>
            See our{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>
            {" "}and{" "}
            <Text style={styles.linkText}>Terms & Conditions</Text>
            {" "}for more.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    paddingBottom: 32,
  },

  // Push Notifications Menu Item
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#666",
  },

  // Email Offers Switch
  switchSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  switchLabel: {
    fontSize: 16,
    color: "#000",
    flex: 1,
    marginRight: 16,
  },

  // Phone Number Section
  phoneSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  phoneLabel: {
    fontSize: 13,
    color: "#888",
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  phoneNumber: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },

  // Text Offers Section
  textOffersSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  textOffersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  textOffersTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    flex: 1,
  },
  textOffersDesc: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },

  // Terms Section
  termsSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    marginBottom: 12,
  },
  linkText: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});