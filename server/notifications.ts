import admin from "firebase-admin";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "";
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY || "";
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || "";

let messaging: admin.messaging.Messaging | null = null;

export function initializeFirebase() {
  if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
    console.warn("Firebase credentials not configured. Notifications disabled.");
    return;
  }

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          clientEmail: FIREBASE_CLIENT_EMAIL,
        }),
      });
    }
    messaging = admin.messaging();
    console.log("Firebase messaging initialized");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

interface DeviceToken {
  token: string;
  platform: "web" | "android" | "ios";
  createdAt: string;
}

interface NotificationPreferences {
  rare: boolean;
  nearby: boolean;
  events: boolean;
  weather: boolean;
  radiusMeters: number;
}

interface Location {
  lat: number;
  lon: number;
  timestamp: string;
}

export async function saveDeviceToken(
  userId: string,
  token: string,
  platform: "web" | "android" | "ios"
): Promise<void> {
  if (!db) return;

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) return;

    const existingTokens = (user.deviceTokens as DeviceToken[]) || [];
    const tokenExists = existingTokens.some((t) => t.token === token);

    if (!tokenExists) {
      existingTokens.push({
        token,
        platform,
        createdAt: new Date().toISOString(),
      });
      await db
        .update(users)
        .set({ deviceTokens: existingTokens })
        .where(eq(users.id, userId));
    }
  } catch (error) {
    console.error("Error saving device token:", error);
  }
}

export async function saveUserLocation(
  userId: string,
  latitude: number,
  longitude: number
): Promise<void> {
  if (!db) return;

  try {
    await db
      .update(users)
      .set({
        lastKnownLocation: {
          lat: latitude,
          lon: longitude,
          timestamp: new Date().toISOString(),
        } as any,
      })
      .where(eq(users.id, userId));
  } catch (error) {
    console.error("Error saving user location:", error);
  }
}

export async function updateNotificationPreferences(
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<void> {
  if (!db) return;

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) return;

    const currentPrefs = (user.notificationPreferences as NotificationPreferences) || {
      rare: true,
      nearby: true,
      events: true,
      weather: true,
      radiusMeters: 500,
    };

    const updated = { ...currentPrefs, ...preferences };
    await db
      .update(users)
      .set({ notificationPreferences: updated })
      .where(eq(users.id, userId));
  } catch (error) {
    console.error("Error updating notification preferences:", error);
  }
}

export async function sendToTokens(
  tokens: string[],
  payload: {
    title: string;
    body: string;
    type: string;
    data?: Record<string, string>;
  }
): Promise<number> {
  if (!messaging || tokens.length === 0) return 0;

  try {
    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: {
        type: payload.type,
        ...payload.data,
      },
    };

    const response = await messaging.sendMulticast({
      ...message,
      tokens,
    });

    console.log(`Sent notifications to ${response.successCount} devices`);

    if (response.failureCount > 0) {
      console.log(`Failed to send to ${response.failureCount} devices`);
      await removeInvalidTokens(response.responses);
    }

    return response.successCount;
  } catch (error) {
    console.error("Error sending notifications:", error);
    return 0;
  }
}

async function removeInvalidTokens(
  responses: admin.messaging.SendResponse[]
): Promise<void> {
  const invalidTokens = responses
    .map((resp, idx) => (resp.error ? idx : -1))
    .filter((idx) => idx >= 0);

  if (invalidTokens.length > 0) {
    console.log("Removing invalid tokens:", invalidTokens);
  }
}

export async function getNearbyUsers(
  latitude: number,
  longitude: number,
  radiusMeters: number
): Promise<string[]> {
  if (!db) return [];

  try {
    const allUsers = await db.select().from(users);

    return allUsers
      .filter((user) => {
        const prefs = (user.notificationPreferences as NotificationPreferences) || {
          rare: true,
          nearby: true,
          events: true,
          weather: true,
          radiusMeters: 500,
        };

        if (!prefs.nearby) return false;

        const location = user.lastKnownLocation as Location | null;
        if (!location) return false;

        const distance = haversineDistance(
          latitude,
          longitude,
          location.lat,
          location.lon
        );

        return distance <= Math.min(radiusMeters, prefs.radiusMeters);
      })
      .flatMap((user) => {
        const tokens = (user.deviceTokens as DeviceToken[]) || [];
        return tokens.map((t) => t.token);
      });
  } catch (error) {
    console.error("Error getting nearby users:", error);
    return [];
  }
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function broadcastNotification(
  payload: {
    title: string;
    body: string;
    type: string;
    data?: Record<string, string>;
  },
  options?: {
    nearbyLat?: number;
    nearbyLon?: number;
    radiusMeters?: number;
    filterType?: "rare" | "nearby" | "all";
  }
): Promise<number> {
  if (!db) return 0;

  try {
    let tokens: string[] = [];

    if (
      options?.nearbyLat !== undefined &&
      options?.nearbyLon !== undefined &&
      options?.radiusMeters
    ) {
      tokens = await getNearbyUsers(
        options.nearbyLat,
        options.nearbyLon,
        options.radiusMeters
      );
    } else {
      const allUsers = await db.select().from(users);
      tokens = allUsers.flatMap((user) => {
        const deviceTokens = (user.deviceTokens as DeviceToken[]) || [];
        return deviceTokens.map((t) => t.token);
      });
    }

    return await sendToTokens(tokens, payload);
  } catch (error) {
    console.error("Error broadcasting notification:", error);
    return 0;
  }
}

export async function sendNearbySightingNotification(
  sightingId: string,
  speciesName: string,
  latitude: number,
  longitude: number,
  isRare: boolean
): Promise<number> {
  if (!db) return 0;

  try {
    if (isRare) {
      return await broadcastNotification(
        {
          title: "Rare Bird Spotted!",
          body: `${speciesName} sighting at Vedanthangal - Check it out!`,
          type: "rare_sighting",
          data: {
            sightingId,
            speciesName,
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          },
        },
        { filterType: "rare" }
      );
    }

    const nearbyTokens = await getNearbyUsers(latitude, longitude, 1000);

    if (nearbyTokens.length === 0) return 0;

    return await sendToTokens(nearbyTokens, {
      title: "Bird Spotted Near You",
      body: `${speciesName} spotted within 1km!`,
      type: "nearby_sighting",
      data: {
        sightingId,
        speciesName,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      },
    });
  } catch (error) {
    console.error("Error sending nearby sighting notification:", error);
    return 0;
  }
}
