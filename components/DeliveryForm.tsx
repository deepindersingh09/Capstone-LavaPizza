import React from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export type DeliveryValues = {
  address?: string;
  apt?: string;
  city?: string;
  postal?: string;
  province?: string;
  country?: string;
};

type Props = {
  title?: string;
  values?: DeliveryValues;
  onSave?: (vals: DeliveryValues) => void;
  saveLabel?: string;
};

export default function DeliveryForm({ title = 'Delivery', values, onSave, saveLabel = 'SAVE' }: Props) {
  const [address, setAddress]   = React.useState(values?.address ?? '');
  const [apt, setApt]           = React.useState(values?.apt ?? '');
  const [city, setCity]         = React.useState(values?.city ?? '');
  const [postal, setPostal]     = React.useState(values?.postal ?? '');
  const [province, setProvince] = React.useState(values?.province ?? '');
  const [country, setCountry]   = React.useState(values?.country ?? '');

  const handleSave = () => {
    onSave?.({ address, apt, city, postal, province, country });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        {/* Address */}
        <View style={styles.field}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            placeholder="3301 – 1st Avenue Northwest"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />
          <View style={styles.underline} />
        </View>

        {/* Apt / Suite / Floor */}
        <View style={styles.field}>
          <Text style={styles.label}>Apt/Suite/Floor</Text>
          <TextInput
            placeholder="—"
            value={apt}
            onChangeText={setApt}
            style={styles.input}
          />
          <View style={styles.underline} />
        </View>

        {/* City / Postal */}
        <View style={[styles.row, { gap: 14 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>City</Text>
            <TextInput
              placeholder="Calgary"
              value={city}
              onChangeText={setCity}
              style={styles.input}
            />
            <View style={styles.underline} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Postal Code</Text>
            <TextInput
              placeholder="T2M 0L4"
              autoCapitalize="characters"
              value={postal}
              onChangeText={setPostal}
              style={styles.input}
            />
            <View style={styles.underline} />
          </View>
        </View>

        {/* Province */}
        <View style={styles.field}>
          <Text style={styles.label}>Province</Text>
          <TextInput
            placeholder="Alberta"
            value={province}
            onChangeText={setProvince}
            style={styles.input}
          />
          <View style={styles.underline} />
        </View>

        {/* Country */}
        <View style={styles.field}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            placeholder="Canada"
            value={country}
            onChangeText={setCountry}
            style={styles.input}
          />
          <View style={styles.underline} />
        </View>

        {/* Save */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>{saveLabel}</Text>
        </TouchableOpacity>

        {/* Scooter art */}
        <Image
          source={require('../assets/images/pickup-scooter.png')}
          resizeMode="contain"
          style={styles.scooter}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 40,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#FFF5D7',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginBottom: 10,
  },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  field: { marginTop: 8 },
  label: { fontSize: 12, color: '#444', marginBottom: 4 },
  input: { fontSize: 14, paddingVertical: 4 },
  underline: { height: 1, backgroundColor: '#dcdcdc', marginTop: 2 },
  row: { flexDirection: 'row' },
  saveBtn: {
    backgroundColor: '#FFC107',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 6,
    marginTop: 18,
  },
  saveText: { fontWeight: '700' },
  scooter: { width: '100%', height: 190, marginTop: 26, alignSelf: 'center' },
});
