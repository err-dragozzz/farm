"use client";

export async function requestNotificationToken() {
  if (!("Notification" in window)) return null;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const configured =
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (!configured) return null;

  return {
    status: "ready",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  };
}
