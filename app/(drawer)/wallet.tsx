import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type CardItem = {
  id: string;
  cardholderName: string;
  cardNumber: string;
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  isDefault: boolean;
};

const STORAGE_KEY = '@lava_wallet_v1';

export default function Wallet() {
  const router = useRouter();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsedCards = JSON.parse(raw);
        setCards(parsedCards);
        console.log('💳 Loaded', parsedCards.length, 'cards');
      }
    } catch (e) {
      console.warn('Failed to load cards', e);
    } finally {
      setIsLoading(false);
    }
  };

  const persist = async (nextCards: CardItem[]) => {
    try {
      setCards(nextCards);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextCards));
      console.log('💾 Cards saved');
    } catch (e) {
      console.warn('Failed to save cards', e);
    }
  };

  // Detect card brand from number
  const detectCardBrand = (number: string): string => {
    const cleanNumber = number.replace(/\s/g, '');
    if (/^4/.test(cleanNumber)) return 'Visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'Amex';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover';
    return 'Card';
  };

  // Format card number with spaces
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  // Validation
  const validateCard = (): boolean => {
    if (!cardholderName.trim()) {
      Alert.alert('Error', 'Please enter cardholder name');
      return false;
    }

    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      Alert.alert('Error', 'Please enter a valid card number');
      return false;
    }

    if (!expiryMonth || parseInt(expiryMonth) < 1 || parseInt(expiryMonth) > 12) {
      Alert.alert('Error', 'Please enter valid expiry month (01-12)');
      return false;
    }

    const currentYear = new Date().getFullYear() % 100;
    if (!expiryYear || parseInt(expiryYear) < currentYear) {
      Alert.alert('Error', 'Card has expired');
      return false;
    }

    if (cvv.length < 3 || cvv.length > 4) {
      Alert.alert('Error', 'Please enter valid CVV (3-4 digits)');
      return false;
    }

    return true;
  };

  const handleAddCard = async () => {
    if (!validateCard()) return;

    const cleanNumber = cardNumber.replace(/\s/g, '');
    const brand = detectCardBrand(cleanNumber);
    const last4 = cleanNumber.slice(-4);

    const newCard: CardItem = {
      id: Date.now().toString(),
      cardholderName: cardholderName.trim(),
      cardNumber: cleanNumber,
      brand,
      last4,
      expiryMonth,
      expiryYear,
      cvv,
      isDefault: cards.length === 0, // First card is default
    };

    const updatedCards = [...cards, newCard];
    await persist(updatedCards);

    // Reset form
    setCardholderName('');
    setCardNumber('');
    setExpiryMonth('');
    setExpiryYear('');
    setCvv('');
    setModalVisible(false);

    Alert.alert('Success! 💳', 'Card added successfully');
  };

  const handleSetDefault = async (id: string) => {
    const updatedCards = cards.map((card) => ({
      ...card,
      isDefault: card.id === id,
    }));
    await persist(updatedCards);
    Alert.alert('Success', 'Default card updated');
  };

  const handleRemove = (card: CardItem) => {
    Alert.alert(
      'Remove Card',
      `Remove ${card.brand} ending in ${card.last4}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const updatedCards = cards.filter((c) => c.id !== card.id);
            
            // If removed card was default, make first card default
            if (card.isDefault && updatedCards.length > 0) {
              updatedCards[0].isDefault = true;
            }
            
            await persist(updatedCards);
          },
        },
      ]
    );
  };

  const getCardIcon = (brand: string) => {
    switch (brand) {
      case 'Visa':
        return 'card';
      case 'Mastercard':
        return 'card';
      case 'Amex':
        return 'card';
      default:
        return 'card-outline';
    }
  };

  const renderCard = ({ item }: { item: CardItem }) => (
    <View style={[styles.cardRow, item.isDefault && styles.defaultCard]}>
      <View style={styles.cardLeft}>
        <Ionicons name={getCardIcon(item.brand) as any} size={24} color="#E53935" />
        <View style={styles.cardInfo}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardBrand}>{item.brand}</Text>
            {item.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>DEFAULT</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardNumber}>•••• •••• •••• {item.last4}</Text>
          <Text style={styles.cardExpiry}>
            Expires {item.expiryMonth}/{item.expiryYear}
          </Text>
          <Text style={styles.cardHolder}>{item.cardholderName}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        {!item.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(item.id)}
          >
            <Ionicons name="star-outline" size={20} color="#FFC107" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRemove(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Card List */}
      <FlatList
        data={cards}
        keyExtractor={(c) => c.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={80} color="#E8E8E8" />
            <Text style={styles.emptyTitle}>No cards added yet</Text>
            <Text style={styles.emptyText}>
              Add your payment cards for quick checkout
            </Text>
          </View>
        }
      />

      {/* Add Card Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#111" />
          <Text style={styles.addText}>Add Payment Card</Text>
        </TouchableOpacity>
      </View>

      {/* Add Card Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Payment Card</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#111" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Cardholder Name */}
              <Text style={styles.label}>Cardholder Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#999"
                value={cardholderName}
                onChangeText={setCardholderName}
                autoCapitalize="words"
              />

              {/* Card Number */}
              <Text style={styles.label}>Card Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#999"
                value={cardNumber}
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D/g, '');
                  if (cleaned.length <= 16) {
                    setCardNumber(formatCardNumber(cleaned));
                  }
                }}
                keyboardType="number-pad"
                maxLength={19} // 16 digits + 3 spaces
              />

              {/* Expiry & CVV */}
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Expiry Month *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM"
                    placeholderTextColor="#999"
                    value={expiryMonth}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/\D/g, '');
                      if (cleaned.length <= 2) {
                        setExpiryMonth(cleaned);
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>

                <View style={styles.halfInput}>
                  <Text style={styles.label}>Expiry Year *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YY"
                    placeholderTextColor="#999"
                    value={expiryYear}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/\D/g, '');
                      if (cleaned.length <= 2) {
                        setExpiryYear(cleaned);
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                </View>
              </View>

              {/* CVV */}
              <Text style={styles.label}>CVV *</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor="#999"
                value={cvv}
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D/g, '');
                  if (cleaned.length <= 4) {
                    setCvv(cleaned);
                  }
                }}
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
              />

              {/* Security Note */}
              <View style={styles.securityNote}>
                <Ionicons name="shield-checkmark" size={18} color="#4CAF50" />
                <Text style={styles.securityText}>
                  Your card information is encrypted and secure
                </Text>
              </View>

              {/* Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleAddCard}>
                  <Text style={styles.saveText}>Add Card</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fbf3e6',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE082',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },

  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Card Row
  cardRow: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  defaultCard: {
    borderColor: '#FFC107',
    backgroundColor: '#FFFBF5',
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  cardInfo: { flex: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardBrand: { fontSize: 15, fontWeight: '700', color: '#111' },
  defaultBadge: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: { fontSize: 10, fontWeight: '800', color: '#111' },
  cardNumber: { fontSize: 14, color: '#444', marginBottom: 2, fontWeight: '600' },
  cardExpiry: { fontSize: 12, color: '#666', marginBottom: 2 },
  cardHolder: { fontSize: 12, color: '#888', fontStyle: 'italic' },

  cardActions: { flexDirection: 'row', gap: 8 },
  actionButton: { padding: 8 },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    backgroundColor: '#fff',
  },
  addBtn: {
    backgroundColor: '#FFC107',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addText: { fontSize: 16, fontWeight: '700', color: '#111' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#111' },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#111',
  },

  row: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },

  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
    gap: 8,
  },
  securityText: { flex: 1, fontSize: 12, color: '#2E7D32', lineHeight: 16 },

  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, fontWeight: '700', color: '#666' },
  saveButton: {
    flex: 1,
    backgroundColor: '#FFC107',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: { fontSize: 16, fontWeight: '700', color: '#111' },
});