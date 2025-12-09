// app/chat/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function LavaChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro-1',
      role: 'assistant',
      content:
        "Hey! I’m Lava, your pizza assistant 🔥🍕 How can I help you today?",
    },
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('http://10.0.2.2:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      const botMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content:
          data.reply ||
          "Hmm… I couldn't understand that. Try asking in another way!",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        content:
          "Oops! Something went wrong talking to the server. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.botMessageContainer,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.botBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.botText,
            ]}
          >
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>{"<"} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lava Assistant</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Chat List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Input Row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask something..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.sendText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ---------------------------------------------
      LAVA PIZZA PROFILE COLOR MATCH
--------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // match profile background
  },

  /* Header */
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFD700", // gold like logout button
    borderBottomWidth: 1,
    borderBottomColor: "#FFE082", // soft yellow border (banner style)
  },
  backText: {
    color: "#92400E", // warm brown, like banner subtitle tone
    fontSize: 16,
  },
  headerTitle: {
    color: "#333", // dark text
    fontSize: 20,
    fontWeight: "700",
  },

  /* Messages List */
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },

  /* Message Bubble Containers */
  messageContainer: {
    marginVertical: 6,
    flexDirection: "row",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  botMessageContainer: {
    justifyContent: "flex-start",
  },

  /* Bubbles */
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },

  // User = stronger gold like actions
  userBubble: {
    marginLeft: "20%",
    backgroundColor: "#FFD700", // same as logout button
    borderBottomRightRadius: 6,
  },

  // Bot = soft yellow card like banner
  botBubble: {
    marginRight: "20%",
    backgroundColor: "#FFF8E1", // banner background
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: "#FFE082",
  },

  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },

  userText: {
    color: "#333", // dark text
    fontWeight: "600",
  },

  botText: {
    color: "#92400E", // warm text (banner subtitle color)
  },

  /* Input Section */
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    backgroundColor: "#FFF8E1", // light yellow like banner
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    color: "#333",
    borderRadius: 16,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  /* Send Button */
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#E53935", // same red as guest name
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
