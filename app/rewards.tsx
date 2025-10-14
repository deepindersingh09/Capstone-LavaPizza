// app/policy/rewards.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RewardsTerms() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rewards Terms & Conditions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <Ionicons name="gift" size={48} color="#E53935" />
          <Text style={styles.heroTitle}>LAVA PIZZA REWARDS</Text>
          <Text style={styles.heroSubtitle}>Earn points, get free pizza!</Text>
        </View>

        {/* Program Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Program Overview</Text>
          <Text style={styles.cardText}>
            Welcome to Lava Pizza YYC Rewards! Our loyalty program rewards you 
            for every order. Earn points with each purchase and redeem them for 
            delicious rewards, exclusive offers, and special perks.
          </Text>
        </View>

        {/* How It Works */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How It Works</Text>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Earn Points:</Text> Get 1 point for every 
              $1 spent on eligible menu items
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Bonus Points:</Text> Receive 50 bonus points 
              when you sign up for the first time
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Birthday Reward:</Text> Get a special birthday 
              offer during your birthday month
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Redeem:</Text> Use points for discounts, 
              free items, or exclusive menu offerings
            </Text>
          </View>
        </View>

        {/* Rewards Tiers */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rewards Tiers</Text>
          
          <View style={styles.tierCard}>
            <Text style={styles.tierTitle}>🍕 Bronze (0-499 points)</Text>
            <Text style={styles.tierText}>• Standard earning rate: 1 point per $1</Text>
            <Text style={styles.tierText}>• Birthday reward</Text>
          </View>

          <View style={styles.tierCard}>
            <Text style={styles.tierTitle}>🔥 Silver (500-999 points)</Text>
            <Text style={styles.tierText}>• 1.25 points per $1 spent</Text>
            <Text style={styles.tierText}>• Early access to new menu items</Text>
            <Text style={styles.tierText}>• Birthday reward + bonus points</Text>
          </View>

          <View style={styles.tierCard}>
            <Text style={styles.tierTitle}>⭐ Gold (1000+ points)</Text>
            <Text style={styles.tierText}>• 1.5 points per $1 spent</Text>
            <Text style={styles.tierText}>• Exclusive Gold member deals</Text>
            <Text style={styles.tierText}>• Priority customer support</Text>
            <Text style={styles.tierText}>• Birthday reward + extra special gift</Text>
          </View>
        </View>

        {/* Redemption Options */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Redemption Options</Text>
          
          <View style={styles.rewardItem}>
            <Text style={styles.rewardPoints}>100 points</Text>
            <Text style={styles.rewardDesc}>$5 off any order</Text>
          </View>

          <View style={styles.rewardItem}>
            <Text style={styles.rewardPoints}>150 points</Text>
            <Text style={styles.rewardDesc}>Free garlic bread or dip</Text>
          </View>

          <View style={styles.rewardItem}>
            <Text style={styles.rewardPoints}>250 points</Text>
            <Text style={styles.rewardDesc}>Free medium pizza</Text>
          </View>

          <View style={styles.rewardItem}>
            <Text style={styles.rewardPoints}>400 points</Text>
            <Text style={styles.rewardDesc}>Free large pizza</Text>
          </View>

          <View style={styles.rewardItem}>
            <Text style={styles.rewardPoints}>500 points</Text>
            <Text style={styles.rewardDesc}>$25 off your order</Text>
          </View>
        </View>

        {/* Terms & Conditions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Terms & Conditions</Text>
          
          <Text style={styles.sectionHeader}>Eligibility</Text>
          <Text style={styles.cardText}>
            • Rewards program is open to residents of Alberta, Canada, aged 13 and older{"\n"}
            • Valid email address and phone number required for enrollment{"\n"}
            • One account per person{"\n"}
            • Account must remain in good standing
          </Text>

          <Text style={styles.sectionHeader}>Earning Points</Text>
          <Text style={styles.cardText}>
            • Points are earned on eligible purchases only{"\n"}
            • Taxes, delivery fees, and tips do not earn points{"\n"}
            • Points are credited to your account within 24-48 hours of purchase{"\n"}
            • Promotional or discounted items may earn reduced or no points{"\n"}
            • Points cannot be earned on purchases made with gift cards
          </Text>

          <Text style={styles.sectionHeader}>Redeeming Points</Text>
          <Text style={styles.cardText}>
            • Points can be redeemed for rewards as listed in the app{"\n"}
            • Minimum redemption: 100 points{"\n"}
            • Rewards are subject to availability{"\n"}
            • Rewards cannot be combined with other offers unless specified{"\n"}
            • Rewards are non-transferable and have no cash value{"\n"}
            • Redeemed rewards are valid for 30 days unless otherwise stated
          </Text>

          <Text style={styles.sectionHeader}>Point Expiration</Text>
          <Text style={styles.cardText}>
            • Points remain valid for 12 months from the date earned{"\n"}
            • Points will expire if there is no account activity for 6 consecutive months{"\n"}
            • We will send reminders before points expire{"\n"}
            • Expired points cannot be reinstated
          </Text>

          <Text style={styles.sectionHeader}>Account Management</Text>
          <Text style={styles.cardText}>
            • You are responsible for maintaining account security{"\n"}
            • Lost or stolen rewards cannot be replaced{"\n"}
            • Lava Pizza YYC reserves the right to suspend or terminate accounts 
            for suspected fraud or abuse{"\n"}
            • Points cannot be transferred between accounts
          </Text>

          <Text style={styles.sectionHeader}>Program Changes</Text>
          <Text style={styles.cardText}>
            • Lava Pizza YYC reserves the right to modify or discontinue the 
            rewards program at any time{"\n"}
            • We will provide notice of significant changes via email or app notification{"\n"}
            • Reward values and point requirements may change{"\n"}
            • Continued participation constitutes acceptance of modified terms
          </Text>
        </View>

        {/* Exclusions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Exclusions</Text>
          <Text style={styles.cardText}>
            • Delivery fees and service charges{"\n"}
            • Taxes (GST, PST){"\n"}
            • Tips and gratuities{"\n"}
            • Gift card purchases{"\n"}
            • Third-party delivery orders (Skip, Uber Eats, DoorDash){"\n"}
            • Catering orders may have different earning rates
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Questions?</Text>
          <Text style={styles.cardText}>
            For questions about the Lava Pizza Rewards program, please contact us:
          </Text>
          <Text style={styles.contactText}>
            📧 Email: rewards@lavapizzayyc.com{"\n"}
            📞 Phone: (403) 555-0123{"\n"}
            🏪 Visit any Lava Pizza YYC location
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footerCard}>
          <Text style={styles.footerText}>
            By participating in Lava Pizza Rewards, you agree to these terms 
            and conditions.
          </Text>
          <Text style={styles.footerDate}>
            Last Updated: October 2024
          </Text>
        </View>

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#111" />
          <Text style={styles.backButtonText}>Back to Settings</Text>
        </TouchableOpacity>
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
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    flex: 1,
    textAlign: "center",
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
    fontSize: 22,
    fontWeight: "900",
    color: "#E53935",
    marginTop: 12,
    letterSpacing: 0.5,
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
    marginBottom: 8,
  },

  // Bullet Points
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  bold: {
    fontWeight: "700",
    color: "#111",
  },

  // Tier Cards
  tierCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  tierTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E53935",
    marginBottom: 8,
  },
  tierText: {
    fontSize: 13,
    color: "#444",
    marginBottom: 4,
  },

  // Reward Items
  rewardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rewardPoints: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E53935",
  },
  rewardDesc: {
    fontSize: 14,
    color: "#444",
    flex: 1,
    textAlign: "right",
  },

  // Sections
  sectionHeader: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginTop: 12,
    marginBottom: 6,
  },

  // Contact
  contactText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 24,
    marginTop: 8,
  },

  // Footer
  footerCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
  },
  footerDate: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },

  // Back Button
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD700",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
});