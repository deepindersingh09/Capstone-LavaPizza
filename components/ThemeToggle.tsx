import React from 'react';
import { Switch, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext'; 

export function ThemeToggle() {
    const { theme, isDark, toggleTheme } = useTheme();

    const isChecked = isDark;
    const accentColor = theme.primary; // Use theme primary color

    return (
        <View style={styles.toggleContainer}>
            <Feather
                name="sun"
                size={22}
                color={isChecked ? theme.textSecondary : accentColor}
            />
            <Switch
                trackColor={{ false: theme.borderDark, true: accentColor }}
                thumbColor={theme.surface}
                onValueChange={toggleTheme}
                value={isChecked}
                style={styles.switch}
            />
            <Feather
                name="moon"
                size={22}
                color={isChecked ? accentColor : theme.textSecondary}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        gap: 8,
    },
    switch: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] 
    }
});
