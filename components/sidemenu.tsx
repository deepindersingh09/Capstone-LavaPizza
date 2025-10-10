// components/SideMenu.tsx
import React from 'react';
import {
  DrawerContentScrollView,
  createDrawerNavigator,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, withLayoutContext } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
const Drawer = createDrawerNavigator();
export const DrawerLayout = withLayoutContext(Drawer.Navigator);


const Row = ({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View style={styles.rowLeft}>
      {icon}
      <Text style={styles.rowText}>{label}</Text>
    </View>
    {/* right chevron could be added here if desired */}
  </TouchableOpacity>
);

export default function SideMenu(props: DrawerContentComponentProps) {
  const router = useRouter();

  const go = (path: Parameters<typeof router.push>[0]) => {
    props.navigation.closeDrawer();
    router.push(path);
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.scroll}
    >
      {/* Close (X) */}
      <View style={styles.top}>
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
          <Ionicons name="close" size={28} color="#111" />
        </TouchableOpacity>
      </View>

      {/* User block */}
      <View style={styles.user}>
        <Image
          // replace with your own avatar if needed
          source={require('../assets/images/profile_picture.png')}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>Zaiden</Text>
          <Text style={styles.sub}>password</Text>
        </View>
      </View>

      {/* Menu card */}
      <View style={styles.menuCard}>
        <Row
          icon={<Ionicons name="heart-outline" size={22} color="#111" />}
          label="Favourites"
          onPress={() => go('/favourites')}
        />
        <Row
          icon={<MaterialCommunityIcons name="wallet-outline" size={22} color="#111" />}
          label="My Wallet"
          onPress={() => go('/wallet')}
        />
        <Row
          icon={<Ionicons name="help-circle-outline" size={22} color="#111" />}
          label="FAQs"
          onPress={() => go('/faq')}
        />
        <Row
          icon={<Ionicons name="call-outline" size={22} color="#111" />}
          label="Support"
          onPress={() => go('/support')}
        />
        <Row
          icon={<Ionicons name="settings-outline" size={22} color="#111" />}
          label="Settings"
          onPress={() => go('/settings')}
        />
        <Row
          icon={<Ionicons name="time-outline" size={22} color="#111" />}
          label="Order History"
          onPress={() => go('/history')}
        />
        <Row
          icon={<Ionicons name="log-out-outline" size={22} color="#111" />}
          label="Logout"
          onPress={async () => {
            // If using Firebase auth, do this:
            // try { await signOut(auth); router.replace('/auth/login'); }
            // catch (e) { console.warn('Logout failed', e); }
            // Temporary placeholder:
            router.replace('/auth/login');
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: '#faf6ea' },
  top: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 8 },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#eee' },
  name: { fontSize: 18, fontWeight: '700', color: '#111' },
  sub: { fontSize: 12, color: '#777' },

  menuCard: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rowText: { fontSize: 18, color: '#111' },
});
