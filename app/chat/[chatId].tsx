import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToChatMessages, sendMessage } from "@/lib/services/firestoreService";
import type { Message } from "@/types/models";

export default function ChatScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { theme, spacing, borderRadius, fontSize } = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = subscribeToChatMessages(chatId, (newMessages) => {
      setMessages(newMessages);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    return unsubscribe;
  }, [chatId]);

  const handleSend = async () => {
    if (!inputText.trim() || !user || !chatId) return;

    const text = inputText.trim();
    setInputText("");

    try {
      await sendMessage(chatId, user.id, user.role as "customer" | "agent", text);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === user?.id;

    return (
      <View
        style={[
          styles.messageContainer,
          {
            alignSelf: isMe ? "flex-end" : "flex-start",
            maxWidth: "75%",
            marginBottom: spacing.sm,
          },
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isMe ? theme.primary : theme.surface,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              borderBottomRightRadius: isMe ? 0 : borderRadius.md,
              borderBottomLeftRadius: isMe ? borderRadius.md : 0,
            },
          ]}
        >
          <Text style={[styles.messageText, { color: isMe ? theme.textInverse : theme.text, fontSize: fontSize.md }]}>
            {item.text}
          </Text>
        </View>
        <Text
          style={[
            styles.timestamp,
            {
              color: theme.textTertiary,
              fontSize: fontSize.xs,
              marginTop: 4,
              alignSelf: isMe ? "flex-end" : "flex-start",
            },
          ]}
        >
          {item.createdAt.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top"]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.primary,
            padding: spacing.lg,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textInverse} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textInverse, fontSize: fontSize.lg }]}>
          {user?.role === "agent" ? "Customer" : "Delivery Agent"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.lg }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <View
          style={[
            styles.inputContainer,
            {
              flexDirection: "row",
              padding: spacing.md,
              backgroundColor: theme.surface,
              borderTopWidth: 1,
              borderTopColor: theme.border,
              gap: spacing.sm,
            },
          ]}
        >
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={theme.textTertiary}
            style={[
              styles.input,
              {
                flex: 1,
                backgroundColor: theme.background,
                color: theme.text,
                padding: spacing.md,
                borderRadius: borderRadius.full,
                fontSize: fontSize.md,
              },
            ]}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[
              styles.sendButton,
              {
                backgroundColor: theme.primary,
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Ionicons name="send" size={20} color={theme.textInverse} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontWeight: "700",
    flex: 1,
    marginLeft: 16,
  },
  messageContainer: {
    // Dynamic
  },
  messageBubble: {
    // Dynamic
  },
  messageText: {
    // Dynamic
  },
  timestamp: {
    // Dynamic
  },
  inputContainer: {
    // Dynamic
  },
  input: {
    // Dynamic
  },
  sendButton: {
    // Dynamic
  },
});
