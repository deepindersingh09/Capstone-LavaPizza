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
        "Hey! I’m Lava, your pizza assistant 🔥🍕 Ask me about the menu, deals, or help building your perfect pizza.",
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
      // 🔥 Replace with your actual backend URL
      const res = await fetch('https://YOUR_BACKEND_URL/api/chat', {
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

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      const botMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content:
          data.reply ||
          "Sorry, I couldn’t understand that. Can you try asking in a different way?",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: `assistant-error-${Date.now()}`,
        role: 'assistant',
        content:
          'Oops, something went wrong talking to the server. Please try again in a moment.',
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>{'<'} Back</Text>
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

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about menu, deals, hours..."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.sendText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020', // you can swap to your Lava background
  },
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A3164', // Lava navy
  },
  backText: {
    color: '#FFF2B8',
    fontSize: 16,
  },
  headerTitle: {
    color: '#FFC800',
    fontSize: 18,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  messageContainer: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  userBubble: {
    marginLeft: '20%',
    backgroundColor: '#FFC800',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    marginRight: '20%',
    backgroundColor: '#1F2937',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
  },
  userText: {
    color: '#1A1A1A',
  },
  botText: {
    color: '#F9FAFB',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#111827',
    backgroundColor: '#020617',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#111827',
    color: '#F9FAFB',
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B00', // Lava orange
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
