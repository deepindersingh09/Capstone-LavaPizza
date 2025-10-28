// components/ThemeSettings.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../lib/ThemeContext';

export default function ThemeSettings() {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();

  const options: Array<{ value: 'light' | 'dark' | 'auto'; label: string; icon: string }> = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'auto', label: 'Auto', icon: '🔄' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.title, { color: theme.text }]}>Theme</Text>
      
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              { 
                backgroundColor: theme.inputBackground,
                borderColor: themeMode === option.value ? theme.primary : theme.border,
                borderWidth: themeMode === option.value ? 2 : 1,
              }
            ]}
            onPress={() => setThemeMode(option.value)}
          >
            <Text style={styles.icon}>{option.icon}</Text>
            <Text style={[styles.label, { color: theme.text }]}>{option.label}</Text>
            {themeMode === option.value && (
              <View style={[styles.checkmark, { backgroundColor: theme.primary }]}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.info, { color: theme.textSecondary }]}>
        {themeMode === 'auto' 
          ? `Following system theme (${isDark ? 'Dark' : 'Light'})`
          : `Using ${themeMode} theme`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    position: 'relative',
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  info: {
    marginTop: 12,
    fontSize: 12,
    textAlign: 'center',
  },
});