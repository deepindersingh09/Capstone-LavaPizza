/**
 * Location Tracking Service
 * Handles GPS tracking and geohash generation for delivery agents
 */

import * as Location from "expo-location";
import { encode as encodeGeohash } from "ngeohash";
import { updateAgentLocation } from "./firestoreService";

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationSubscription {
  remove: () => void;
}

/**
 * Request location permissions
 */
export const requestLocationPermissions = async (): Promise<boolean> => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

  if (foregroundStatus !== "granted") {
    return false;
  }

  // Request background permissions for continuous tracking
  const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

  return backgroundStatus === "granted";
};

/**
 * Get current location once
 */
export const getCurrentLocation = async (): Promise<LocationCoords | null> => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error getting current location:", error);
    return null;
  }
};

/**
 * Start continuous location tracking for delivery agent
 * Updates Firestore every 10 seconds or 10 meters
 */
export const startLocationTracking = async (
  agentId: string
): Promise<LocationSubscription | null> => {
  const hasPermission = await requestLocationPermissions();

  if (!hasPermission) {
    console.error("Location permission denied");
    return null;
  }

  try {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10, // Update every 10 meters
        timeInterval: 10000, // Update every 10 seconds
      },
      async (location) => {
        const { latitude, longitude } = location.coords;

        // Generate geohash for efficient nearby queries (7 chars = ~153m precision)
        const geohash = encodeGeohash(latitude, longitude, 7);

        console.log(`📍 Location update: ${latitude}, ${longitude} (geohash: ${geohash})`);

        // Update Firestore
        try {
          await updateAgentLocation(agentId, { latitude, longitude }, geohash);
        } catch (error) {
          console.error("Error updating agent location:", error);
        }
      }
    );

    return subscription;
  } catch (error) {
    console.error("Error starting location tracking:", error);
    return null;
  }
};

/**
 * Calculate distance between two coordinates in kilometers
 */
export const calculateDistance = (
  coord1: LocationCoords,
  coord2: LocationCoords
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.latitude)) *
      Math.cos(toRad(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculate estimated time of arrival in minutes
 * Assumes average speed of 30 km/h for delivery
 */
export const calculateETA = (distanceKm: number): number => {
  const avgSpeedKmH = 30;
  const timeHours = distanceKm / avgSpeedKmH;
  return Math.ceil(timeHours * 60); // Convert to minutes and round up
};

/**
 * Format location coordinates for display
 */
export const formatCoordinates = (coords: LocationCoords): string => {
  return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
};

// Helper function
const toRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};
