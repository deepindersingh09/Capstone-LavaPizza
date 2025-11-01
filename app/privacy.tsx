
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

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <Ionicons name="shield-checkmark" size={48} color="#4CAF50" />
          <Text style={styles.heroTitle}>YOUR PRIVACY MATTERS</Text>
          <Text style={styles.heroSubtitle}>We protect your personal information</Text>
        </View>

        {/* Introduction */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Introduction</Text>
          <Text style={styles.cardText}>
            Lava Pizza YYC ("we," "us," or "our") respects your privacy and is 
            committed to protecting your personal information. This Privacy Policy 
            explains how we collect, use, disclose, and safeguard your information 
            when you use our mobile application and services.
          </Text>
          <Text style={styles.cardText}>
            By using our app and services, you agree to the collection and use of 
            information in accordance with this policy. If you do not agree with 
            our policies and practices, please do not use our services.
          </Text>
        </View>

        {/* Information We Collect */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Information We Collect</Text>
          
          <Text style={styles.sectionHeader}>Personal Information</Text>
          <Text style={styles.cardText}>
            When you create an account or place an order, we may collect:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Name and contact information (email, phone number)</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Delivery address(es)</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Payment information (processed securely through third-party processors)</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Order history and preferences</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Birthday (for rewards program)</Text>
          </View>

          <Text style={styles.sectionHeader}>Usage Information</Text>
          <Text style={styles.cardText}>
            We automatically collect certain information when you use our app:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Device information (type, operating system, unique identifiers)</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>App usage data (features used, time spent, interactions)</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Location data (with your permission, for delivery purposes)</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>IP address and browser information</Text>
          </View>
        </View>

        {/* How We Use Your Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How We Use Your Information</Text>
          
          <Text style={styles.cardText}>We use your information to:</Text>

          <View style={styles.purposeCard}>
            <Ionicons name="restaurant" size={20} color="#E53935" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.purposeTitle}>Process Orders</Text>
              <Text style={styles.purposeText}>
                Fulfill your orders, process payments, and arrange delivery or pickup
              </Text>
            </View>
          </View>

          <View style={styles.purposeCard}>
            <Ionicons name="notifications" size={20} color="#E53935" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.purposeTitle}>Communicate With You</Text>
              <Text style={styles.purposeText}>
                Send order confirmations, delivery updates, and customer service responses
              </Text>
            </View>
          </View>

          <View style={styles.purposeCard}>
            <Ionicons name="gift" size={20} color="#E53935" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.purposeTitle}>Rewards Program</Text>
              <Text style={styles.purposeText}>
                Manage your rewards account and send promotional offers (with your consent)
              </Text>
            </View>
          </View>

          <View style={styles.purposeCard}>
            <Ionicons name="trending-up" size={20} color="#E53935" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.purposeTitle}>Improve Services</Text>
              <Text style={styles.purposeText}>
                Analyze usage patterns to enhance our app and menu offerings
              </Text>
            </View>
          </View>

          <View style={styles.purposeCard}>
            <Ionicons name="shield-checkmark" size={20} color="#E53935" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.purposeTitle}>Security & Fraud Prevention</Text>
              <Text style={styles.purposeText}>
                Protect against fraudulent transactions and ensure account security
              </Text>
            </View>
          </View>
        </View>

        {/* Information Sharing */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How We Share Your Information</Text>
          
          <Text style={styles.cardText}>
            We do not sell your personal information. We may share your information with:
          </Text>

          <Text style={styles.sectionHeader}>Service Providers</Text>
          <Text style={styles.cardText}>
            Third-party vendors who help us operate our business, including:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Payment processors (Stripe, Square)</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Delivery service providers</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Cloud hosting and data storage services</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Analytics and marketing platforms</Text>
          </View>

          <Text style={styles.sectionHeader}>Legal Requirements</Text>
          <Text style={styles.cardText}>
            We may disclose your information if required by law or in response to 
            valid legal requests from public authorities.
          </Text>

          <Text style={styles.sectionHeader}>Business Transfers</Text>
          <Text style={styles.cardText}>
            In the event of a merger, acquisition, or sale of assets, your 
            information may be transferred as part of that transaction.
          </Text>
        </View>

        {/* Data Security */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Security</Text>
          <Text style={styles.cardText}>
            We implement appropriate technical and organizational security measures 
            to protect your personal information, including:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Encryption of data in transit and at rest</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Secure payment processing through PCI-compliant providers</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Regular security audits and updates</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Access controls and authentication requirements</Text>
          </View>
          <Text style={styles.cardText}>
            However, no method of transmission over the internet is 100% secure. 
            While we strive to protect your information, we cannot guarantee 
            absolute security.
          </Text>
        </View>

        {/* Your Rights */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Privacy Rights</Text>
          
          <Text style={styles.cardText}>
            Under Canadian privacy laws (PIPEDA), you have the right to:
          </Text>

          <View style={styles.rightCard}>
            <Text style={styles.rightTitle}>Access Your Information</Text>
            <Text style={styles.rightText}>
              Request a copy of the personal information we hold about you
            </Text>
          </View>

          <View style={styles.rightCard}>
            <Text style={styles.rightTitle}>Correct Your Information</Text>
            <Text style={styles.rightText}>
              Update or correct inaccurate information in your account
            </Text>
          </View>

          <View style={styles.rightCard}>
            <Text style={styles.rightTitle}>Delete Your Information</Text>
            <Text style={styles.rightText}>
              Request deletion of your account and personal data (subject to legal obligations)
            </Text>
          </View>

          <View style={styles.rightCard}>
            <Text style={styles.rightTitle}>Opt-Out of Marketing</Text>
            <Text style={styles.rightText}>
              Unsubscribe from promotional emails and text messages at any time
            </Text>
          </View>

          <View style={styles.rightCard}>
            <Text style={styles.rightTitle}>Data Portability</Text>
            <Text style={styles.rightText}>
              Request your data in a structured, commonly used format
            </Text>
          </View>

          <Text style={styles.cardText}>
            To exercise these rights, contact us at privacy@lavapizzayyc.com
          </Text>
        </View>

        {/* Cookies and Tracking */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cookies and Tracking Technologies</Text>
          <Text style={styles.cardText}>
            We use cookies and similar technologies to enhance your experience:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}><Text style={styles.bold}>Essential cookies:</Text> Required for app functionality</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}><Text style={styles.bold}>Analytics cookies:</Text> Help us understand app usage</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}><Text style={styles.bold}>Marketing cookies:</Text> Deliver relevant offers (with consent)</Text>
          </View>
          <Text style={styles.cardText}>
            You can manage cookie preferences through your device settings.
          </Text>
        </View>

        {/* Children's Privacy */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Children's Privacy</Text>
          <Text style={styles.cardText}>
            Our services are not directed to individuals under the age of 13. We 
            do not knowingly collect personal information from children under 13. 
            If you believe we have inadvertently collected such information, please 
            contact us immediately, and we will take steps to delete it.
          </Text>
          <Text style={styles.cardText}>
            Users between 13-18 must have parental consent to use our services.
          </Text>
        </View>

        {/* Data Retention */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Data Retention</Text>
          <Text style={styles.cardText}>
            We retain your personal information for as long as necessary to:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Provide our services and maintain your account</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Comply with legal and regulatory requirements</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Resolve disputes and enforce our agreements</Text>
          </View>
          <Text style={styles.cardText}>
            Order history is typically retained for 7 years for tax and accounting 
            purposes. After account deletion, we may retain certain information as 
            required by law or for legitimate business purposes.
          </Text>
        </View>

        {/* Third-Party Links */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Third-Party Links</Text>
          <Text style={styles.cardText}>
            Our app may contain links to third-party websites or services. We are 
            not responsible for the privacy practices of these third parties. We 
            encourage you to review their privacy policies before providing any 
            personal information.
          </Text>
        </View>

        {/* Changes to Policy */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Changes to This Privacy Policy</Text>
          <Text style={styles.cardText}>
            We may update this Privacy Policy from time to time to reflect changes 
            in our practices or legal requirements. We will notify you of any 
            material changes by:
          </Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Posting the updated policy in the app</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Sending an email notification</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>In-app notification</Text>
          </View>
          <Text style={styles.cardText}>
            Your continued use of our services after any changes constitutes 
            acceptance of the updated policy.
          </Text>
        </View>

        {/* Contact Us */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Us</Text>
          <Text style={styles.cardText}>
            If you have questions, concerns, or requests regarding this Privacy 
            Policy or our data practices, please contact us:
          </Text>
          
          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <Ionicons name="mail" size={18} color="#E53935" />
              <Text style={styles.contactText}>privacy@lavapizzayyc.com</Text>
            </View>
            
            <View style={styles.contactRow}>
              <Ionicons name="call" size={18} color="#E53935" />
              <Text style={styles.contactText}>(403) 555-0123</Text>
            </View>
            
            <View style={styles.contactRow}>
              <Ionicons name="location" size={18} color="#E53935" />
              <View style={{ flex: 1 }}>
                <Text style={styles.contactText}>Lava Pizza YYC</Text>
                <Text style={styles.contactText}>Unit 112, 20 Saddlestone Dr NE</Text>
                <Text style={styles.contactText}>Calgary, AB T3J 0K9</Text>
              </View>
            </View>
          </View>

          <Text style={styles.cardText}>
            For privacy-related complaints or concerns, you may also contact the 
            Office of the Privacy Commissioner of Canada:
          </Text>
          <Text style={styles.contactText}>
            📧 info@priv.gc.ca{"\n"}
            🌐 www.priv.gc.ca{"\n"}
            📞 1-800-282-1376
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footerCard}>
          <Text style={styles.footerText}>
            By using Lava Pizza YYC's services, you acknowledge that you have 
            read and understood this Privacy Policy.
          </Text>
          <Text style={styles.footerDate}>
            Last Updated: October 2024{"\n"}
            Effective Date: October 2024
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
    fontSize: 18,
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
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#A5D6A7",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#2E7D32",
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

  // Section Headers
  sectionHeader: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginTop: 12,
    marginBottom: 6,
  },

  // Bullet Points
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 14,
    color: "#E53935",
    marginRight: 8,
    fontWeight: "700",
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

  // Purpose Cards
  purposeCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  purposeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  purposeText: {
    fontSize: 13,
    color: "#444",
    lineHeight: 18,
  },

  // Rights Cards
  rightCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
  },
  rightTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  rightText: {
    fontSize: 13,
    color: "#444",
    lineHeight: 18,
  },

  // Contact Card
  contactCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#FFE082",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 10,
  },
  contactText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
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
    textAlign: "center",
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