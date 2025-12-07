/**
 * Notification Service
 * Handles push notifications with Expo Notifications
 */

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Configure how notifications are handled when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register device for push notifications and save token to user profile
 */
export const registerForPushNotifications = async (userId: string): Promise<string | null> => {
  try {
    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Push notification permission denied");
      return null;
    }

    // Configure Android notification channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#f8a831",
      });
    }

    // Get Expo push token
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Push notification token:", token);

    // Save token to user document
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      pushToken: token,
      pushTokenUpdatedAt: new Date(),
    });

    return token;
  } catch (error) {
    console.error("Error registering for push notifications:", error);
    return null;
  }
};

/**
 * Schedule a local notification (for testing)
 */
export const scheduleLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, any>,
  delaySeconds: number = 0
) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: delaySeconds > 0 ? { seconds: delaySeconds } : null,
    });
  } catch (error) {
    console.error("Error scheduling notification:", error);
  }
};

/**
 * Send immediate local notification
 */
export const sendLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, any>
) => {
  await scheduleLocalNotification(title, body, data, 0);
};

/**
 * Add notification listener for when notification is tapped
 */
export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

/**
 * Add notification listener for when notification is received while app is open
 */
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
) => {
  return Notifications.addNotificationReceivedListener(callback);
};

/**
 * Get notification permissions status
 */
export const getNotificationPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
};

/**
 * Clear all notifications from notification center
 */
export const clearAllNotifications = async () => {
  await Notifications.dismissAllNotificationsAsync();
};

/**
 * Get notification count (badge)
 */
export const getBadgeCount = async () => {
  return await Notifications.getBadgeCountAsync();
};

/**
 * Set notification badge count
 */
export const setBadgeCount = async (count: number) => {
  await Notifications.setBadgeCountAsync(count);
};
