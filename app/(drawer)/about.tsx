import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function About() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/general')}>
  <Ionicons name="arrow-back" size={24} color="#111" />
</TouchableOpacity>
        <Text style={styles.headerTitle}>About Lava Pizza YYC</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <Ionicons name="flame" size={48} color="#E53935" />
          <Text style={styles.heroTitle}>LAVA PIZZA YYC</Text>
          <Text style={styles.heroSubtitle}>From Canada with Canadian Love</Text>
        </View>

        {/* About Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About Our Food</Text>
          <Text style={styles.cardText}>
            Some of the world's best cheese is made close to home! All our 
            deliciously melty Mozzarella is made with 100% Canadian milk. 
            We're proud to support Canadian dairy farmers.
          </Text>
          <Text style={styles.cardText}>
            We make freshly baked delicious pizzas for every customer. We use 
            fresh veggies, meats, and halal meat on request. Our dips are very 
            famous among our customers.
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <MaterialCommunityIcons name="leaf" size={32} color="#4CAF50" />
            <Text style={styles.featureTitle}>Always Fresh</Text>
            <Text style={styles.featureText}>
              Made with fresh ingredients daily
            </Text>
          </View>

          <View style={styles.featureCard}>
            <MaterialCommunityIcons name="food-halal" size={32} color="#FF9800" />
            <Text style={styles.featureTitle}>Halal Available</Text>
            <Text style={styles.featureText}>
              حلال meat on request
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="timer-outline" size={32} color="#2196F3" />
            <Text style={styles.featureTitle}>Fast Service</Text>
            <Text style={styles.featureText}>
              Quick preparation and delivery
            </Text>
          </View>

          <View style={styles.featureCard}>
            <MaterialCommunityIcons name="cheese" size={32} color="#FFC107" />
            <Text style={styles.featureTitle}>100% Canadian</Text>
            <Text style={styles.featureText}>
              Made with Canadian milk
            </Text>
          </View>
        </View>

        {/* What We Offer */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What We Offer</Text>
          <View style={styles.offerItem}>
            <Ionicons name="pizza" size={20} color="#E53935" />
            <Text style={styles.offerText}>House Pizzas & Gourmet Options</Text>
          </View>
          <View style={styles.offerItem}>
            <MaterialCommunityIcons name="food-variant" size={20} color="#E53935" />
            <Text style={styles.offerText}>Fast Food Meals & Appetizers</Text>
          </View>
          <View style={styles.offerItem}>
            <MaterialCommunityIcons name="leaf" size={20} color="#E53935" />
            <Text style={styles.offerText}>Fresh Salads & Healthy Options</Text>
          </View>
          <View style={styles.offerItem}>
            <MaterialCommunityIcons name="french-fries" size={20} color="#E53935" />
            <Text style={styles.offerText}>Shahi Fries & Poutines</Text>
          </View>
          <View style={styles.offerItem}>
            <MaterialCommunityIcons name="food-drumstick" size={20} color="#E53935" />
            <Text style={styles.offerText}>Chicken Wings & More</Text>
          </View>
        </View>

        {/* Locations */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Locations</Text>
          
          <View style={styles.locationItem}>
            <Ionicons name="location" size={20} color="#E53935" />
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>Saddlestone Location</Text>
              <Text style={styles.locationAddress}>
                Unit 112, 20 Saddlestone Dr NE{"\n"}Calgary, AB
              </Text>
            </View>
          </View>

          <View style={styles.locationItem}>
            <Ionicons name="location" size={20} color="#E53935" />
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>Beltline Location</Text>
              <Text style={styles.locationAddress}>
                1211 14 St SW #4{"\n"}Calgary, AB
              </Text>
            </View>
          </View>
        </View>

        {/* Hours */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hours of Operation</Text>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Monday - Thursday</Text>
            <Text style={styles.hoursTime}>11:00 AM - 10:00 PM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Friday - Saturday</Text>
            <Text style={styles.hoursTime}>11:00 AM - 12:00 AM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Sunday</Text>
            <Text style={styles.hoursTime}>12:00 PM - 9:00 PM</Text>
          </View>
        </View>

        {/* Mission Statement */}
        <View style={[styles.card, styles.missionCard]}>
          <Text style={styles.missionText}>
            "Made Right. Made Delicious. Made Especially For You."
          </Text>
        </View>

        {/* Contact Button */}
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => router.push("/support")}
        >
          <Ionicons name="mail-outline" size={20} color="#111" />
          <Text style={styles.contactButtonText}>Contact Us</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },

  // Hero Card
  heroCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#E53935",
    marginTop: 12,
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },

  // Card Styles
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
    marginBottom: 12,
  },

  // Features Grid
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  featureText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },

  // Offer Items
  offerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 12,
  },
  offerText: {
    fontSize: 14,
    color: "#444",
    flex: 1,
  },

  // Location Items
  locationItem: {
    flexDirection: "row",
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },

  // Hours
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  hoursDay: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  hoursTime: {
    fontSize: 14,
    color: "#666",
  },

  // Mission Card
  missionCard: {
    backgroundColor: "#FFF8E1",
    borderColor: "#FFE082",
    alignItems: "center",
  },
  missionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E53935",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 24,
  },

  // Contact Button
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  // Version
  version: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 16,
  },
});