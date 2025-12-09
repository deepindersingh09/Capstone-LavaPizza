// app/agent/faq.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const categories = ["All", "Getting Started", "Orders", "Payments", "Technical"];
const SUPPORT_PHONE_NUMBER = "1-800-528-2749";

const FaqItemComponent = ({
  faq,
  isExpanded,
  onPress,
}: {
  faq: FAQItem;
  isExpanded: boolean;
  onPress: () => void;
}) => {
  const { theme, spacing, borderRadius, fontSize, elevation } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.faqCard,
        {
          backgroundColor: theme.surface,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          marginBottom: spacing.md,
          borderWidth: 1,
          borderColor: theme.border,
          ...elevation.sm,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.questionRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.categoryBadge, { color: theme.primary, fontSize: fontSize.xs }]}>
            {faq.category}
          </Text>
          <Text
            style={[styles.question, { color: theme.text, fontSize: fontSize.sm, marginTop: 4 }]}
          >
            {faq.question}
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.textSecondary}
        />
      </View>
      {isExpanded && (
        <Text
          style={[
            styles.answer,
            {
              color: theme.textSecondary,
              fontSize: fontSize.sm,
              marginTop: spacing.sm,
              paddingTop: spacing.sm,
              borderTopWidth: 1,
              borderTopColor: theme.border,
            },
          ]}
        >
          {faq.answer}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default function FAQ() {
  const { theme, spacing, borderRadius, fontSize, elevation } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const faqs: FAQItem[] = [
    {
      id: "1",
      question: "How do I start receiving delivery orders?",
      answer:
        "To start receiving orders, make sure you're online by toggling your availability status in the Profile page. Once online, new orders will appear in your Available Orders section.",
      category: "Getting Started",
    },
    {
      id: "2",
      question: "How do I update my vehicle information?",
      answer:
        "Go to Help & Support from the menu, then tap on Vehicle Information. You can update your vehicle type (bike, scooter, or car) from there.",
      category: "Getting Started",
    },
    {
      id: "3",
      question: "What happens if I accept an order by mistake?",
      answer:
        "If you've just accepted an order and need to cancel, contact support immediately through Live Chat. Note that frequent cancellations may affect your rating.",
      category: "Orders",
    },
    {
      id: "4",
      question: "How do I mark an order as delivered?",
      answer:
        "Once you've delivered the order to the customer, open the order details and tap the 'Mark as Delivered' button. Make sure to confirm delivery with the customer first.",
      category: "Orders",
    },
    {
      id: "5",
      question: "When will I receive my earnings?",
      answer:
        "Earnings are processed weekly and deposited directly to your registered bank account every Monday for the previous week's deliveries.",
      category: "Payments",
    },
    {
      id: "6",
      question: "How are tips handled?",
      answer:
        "Tips are added to your earnings immediately after delivery. You receive 100% of the tip amount. Tips are included in your weekly payout.",
      category: "Payments",
    },
    {
      id: "7",
      question: "The app is not showing new orders. What should I do?",
      answer:
        "First, check your internet connection. Then verify you're set to 'Available' in your profile. If issues persist, try closing and reopening the app, or contact support.",
      category: "Technical",
    },
    {
      id: "8",
      question: "How do I report a technical issue?",
      answer:
        "Go to Help & Support from the menu, then tap 'Report an Issue'. Describe the problem in detail and our technical team will assist you.",
      category: "Technical",
    },
    {
      id: "9",
      question: "Can I schedule my shifts in advance?",
      answer:
        "Yes! Go to Shift Schedule from the menu to view and manage your shifts. You can also request time off or swap shifts with other agents.",
      category: "Getting Started",
    },
    {
      id: "10",
      question: "What should I do in case of an emergency during delivery?",
      answer:
        "Your safety is our priority. Use the 911 Emergency button on the dashboard for immediate emergencies. For less urgent issues, contact support through Live Chat.",
      category: "Getting Started",
    },
  ];

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFAQs = useMemo(() => {
    if (selectedCategory === "All") return faqs;
    return faqs.filter((faq) => faq.category === selectedCategory);
  }, [selectedCategory, faqs]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary, ...elevation.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textInverse} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textInverse, fontSize: fontSize.lg }]}>
          FAQ & Help
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginBottom: spacing.lg }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === category ? theme.primary : theme.surface,
                  borderRadius: borderRadius.full,
                  borderWidth: 1,
                  borderColor: selectedCategory === category ? theme.primary : theme.border,
                  marginRight: spacing.sm,
                },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category ? theme.textInverse : theme.text,
                    fontSize: fontSize.sm,
                  },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FAQ List */}
        {filteredFAQs.map((faq) => (
          <FaqItemComponent
            key={faq.id}
            faq={faq}
            isExpanded={expandedId === faq.id}
            onPress={() => toggleExpand(faq.id)}
          />
        ))}

        {/* Still Need Help Section */}
        <View
          style={[
            styles.helpCard,
            {
              backgroundColor: theme.primary + "15",
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginTop: spacing.md,
              borderWidth: 1,
              borderColor: theme.primary + "40",
            },
          ]}
        >
          <View style={styles.helpHeader}>
            <Ionicons name="help-circle" size={32} color={theme.primary} />
            <Text
              style={[
                styles.helpTitle,
                { color: theme.text, fontSize: fontSize.md, marginLeft: spacing.sm },
              ]}
            >
              Still Need Help?
            </Text>
          </View>
          <Text
            style={[
              styles.helpText,
              { color: theme.textSecondary, fontSize: fontSize.sm, marginTop: spacing.sm },
            ]}
          >
            Can't find the answer you're looking for? Our support team is here to help!
          </Text>

          <View style={{ marginTop: spacing.md }}>
            <TouchableOpacity
              style={[
                styles.contactButton,
                {
                  backgroundColor: theme.primary,
                  borderRadius: borderRadius.md,
                  padding: spacing.sm,
                  marginBottom: spacing.sm,
                },
              ]}
              onPress={() => router.push("/agent/live-chat" as any)}
            >
              <Ionicons name="chatbubbles" size={20} color={theme.textInverse} />
              <Text
                style={[styles.contactText, { color: theme.textInverse, fontSize: fontSize.sm }]}
              >
                Live Chat Support
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.contactButton,
                {
                  backgroundColor: theme.surface,
                  borderRadius: borderRadius.md,
                  padding: spacing.sm,
                  borderWidth: 1,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => Linking.openURL(`tel:${SUPPORT_PHONE_NUMBER}`)}
            >
              <Ionicons name="call" size={20} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.text, fontSize: fontSize.sm }]}>
                Call: {SUPPORT_PHONE_NUMBER}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Video Tutorials Section */}
        <View
          style={[
            styles.tutorialSection,
            {
              backgroundColor: theme.surface,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginTop: spacing.lg,
              borderWidth: 1,
              borderColor: theme.border,
              ...elevation.sm,
            },
          ]}
        >
          <View style={styles.tutorialHeader}>
            <Ionicons name="play-circle" size={28} color={theme.primary} />
            <Text
              style={[
                styles.tutorialTitle,
                { color: theme.text, fontSize: fontSize.md, marginLeft: spacing.sm },
              ]}
            >
              Video Tutorials
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.tutorialItem, { marginTop: spacing.md }]}
            onPress={() => Linking.openURL("https://youtube.com")}
          >
            <View
              style={[
                styles.playIconContainer,
                { backgroundColor: theme.primary + "20", borderRadius: borderRadius.md },
              ]}
            >
              <Ionicons name="play" size={20} color={theme.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={[styles.tutorialName, { color: theme.text, fontSize: fontSize.sm }]}>
                Getting Started as a Delivery Agent
              </Text>
              <Text
                style={[
                  styles.tutorialDuration,
                  { color: theme.textTertiary, fontSize: fontSize.xs },
                ]}
              >
                5:30 mins
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tutorialItem, { marginTop: spacing.md }]}
            onPress={() => Linking.openURL("https://youtube.com")}
          >
            <View
              style={[
                styles.playIconContainer,
                { backgroundColor: theme.primary + "20", borderRadius: borderRadius.md },
              ]}
            >
              <Ionicons name="play" size={20} color={theme.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={[styles.tutorialName, { color: theme.text, fontSize: fontSize.sm }]}>
                How to Handle Orders Efficiently
              </Text>
              <Text
                style={[
                  styles.tutorialDuration,
                  { color: theme.textTertiary, fontSize: fontSize.xs },
                ]}
              >
                8:15 mins
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tutorialItem, { marginTop: spacing.md }]}
            onPress={() => Linking.openURL("https://youtube.com")}
          >
            <View
              style={[
                styles.playIconContainer,
                { backgroundColor: theme.primary + "20", borderRadius: borderRadius.md },
              ]}
            >
              <Ionicons name="play" size={20} color={theme.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={[styles.tutorialName, { color: theme.text, fontSize: fontSize.sm }]}>
                Understanding Your Earnings
              </Text>
              <Text
                style={[
                  styles.tutorialDuration,
                  { color: theme.textTertiary, fontSize: fontSize.xs },
                ]}
              >
                4:45 mins
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontWeight: "700",
    flex: 1,
    marginLeft: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryText: {
    fontWeight: "600",
  },
  faqCard: {
    // Styles applied inline
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  categoryBadge: {
    fontWeight: "700",
    textTransform: "uppercase",
  },
  question: {
    fontWeight: "600",
    lineHeight: 20,
  },
  answer: {
    lineHeight: 20,
  },
  helpCard: {
    // Styles applied inline
  },
  helpHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  helpTitle: {
    fontWeight: "700",
    flex: 1,
  },
  helpText: {
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  contactText: {
    fontWeight: "600",
  },
  tutorialSection: {
    // Styles applied inline
  },
  tutorialHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  tutorialTitle: {
    fontWeight: "700",
  },
  tutorialItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  playIconContainer: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  tutorialName: {
    fontWeight: "600",
    lineHeight: 18,
  },
  tutorialDuration: {
    marginTop: 2,
  },
});
