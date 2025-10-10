import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Browse the menu, add items to your cart, then proceed to checkout to confirm payment and delivery details.",
    },
    {
      question: "Can I track my order in real-time?",
      answer:
        "Yes! Use the 'Order Status' page in the app to see live updates on your order's preparation and delivery.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept credit/debit cards, digital wallets.",
    },
    {
      question: "How can I update my delivery address?",
      answer:
        "Go to 'Account' → 'Update Delivery Info' to add or edit your saved delivery addresses.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Frequently Asked Questions</Text>
      {faqs.map((faq, index) => (
        <View key={index} style={styles.faqItem}>
          <Pressable
            style={styles.questionRow}
            onPress={() => toggleFAQ(index)}
          >
            <Text style={styles.question}>{faq.question}</Text>
            <Ionicons
              name={activeIndex === index ? "chevron-up" : "chevron-down"}
              size={20}
              color="black"
            />
          </Pressable>
          {activeIndex === index && (
            <Text style={styles.answer}>{faq.answer}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },
  answer: {
    marginTop: 8,
    fontSize: 14,
    color: "gray",
    lineHeight: 20,
  },
});
