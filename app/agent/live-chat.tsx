// app/agent/live-chat.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

type Message = {
  id: string;
  text: string;
  sender: "agent" | "support";
  timestamp: Date;
};

export default function LiveChat() {
  const { theme, spacing, borderRadius, fontSize, elevation } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to Lava Pizza support. How can I help you today?",
      sender: "support",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "agent",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    // Simulate support response after 2 seconds
    setTimeout(() => {
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message. A support representative will respond shortly.",
        sender: "support",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportResponse]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary, ...elevation.md }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textInverse} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={[styles.headerTitle, { color: theme.textInverse, fontSize: fontSize.lg }]}>
            Live Support
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: theme.textInverse + "CC", fontSize: fontSize.xs },
            ]}
          >
            Usually replies within minutes
          </Text>
        </View>
        <Ionicons name="information-circle-outline" size={24} color={theme.textInverse} />
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ padding: spacing.md, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.sender === "agent" ? styles.agentMessage : styles.supportMessage,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  {
                    backgroundColor: message.sender === "agent" ? theme.primary : theme.surface,
                    borderRadius: borderRadius.lg,
                    ...elevation.sm,
                  },
                  message.sender === "support" && { borderWidth: 1, borderColor: theme.border },
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    {
                      color: message.sender === "agent" ? theme.textInverse : theme.text,
                      fontSize: fontSize.sm,
                    },
                  ]}
                >
                  {message.text}
                </Text>
              </View>
              <Text
                style={[
                  styles.timestamp,
                  {
                    color: theme.textTertiary,
                    fontSize: fontSize.xs,
                    marginTop: 4,
                    textAlign: message.sender === "agent" ? "right" : "left",
                  },
                ]}
              >
                {formatTime(message.timestamp)}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.surface,
              borderTopColor: theme.border,
              ...elevation.lg,
            },
          ]}
        >
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: theme.background,
                borderRadius: borderRadius.lg,
                borderColor: theme.border,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: theme.text, fontSize: fontSize.sm }]}
              placeholder="Type your message..."
              placeholderTextColor={theme.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: inputText.trim() ? theme.primary : theme.border,
                  borderRadius: borderRadius.full,
                },
              ]}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? theme.textInverse : theme.textTertiary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  },
  headerSubtitle: {
    marginTop: 2,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "75%",
  },
  agentMessage: {
    alignSelf: "flex-end",
  },
  supportMessage: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    padding: 12,
    paddingHorizontal: 16,
  },
  messageText: {
    lineHeight: 20,
  },
  timestamp: {
    marginHorizontal: 4,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: 6,
    paddingRight: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
