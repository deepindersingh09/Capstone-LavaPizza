import React from 'react';
import { Switch, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { useTheme } from '@/lib/ThemeContext'; 

export function ThemeToggle() {
    const { theme, isDark, setThemeMode } = useTheme();

    const handleToggle = () => {
        const newMode = isDark ? 'light' : 'dark';
        setThemeMode(newMode); 
    };
    
    const isChecked = isDark; 
    const accentColor = '#FF4500'; // Fiery orange accent for the Lava theme

    return (
        <View style={styles.toggleContainer}>
            <Feather 
                name="sun" 
                size={22} 
                color={isChecked ? theme.textSecondary : accentColor} 
            />
            <Switch
                trackColor={{ false: theme.textSecondary, true: accentColor }}
                thumbColor={theme.cardBackground} 
                onValueChange={handleToggle}
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
