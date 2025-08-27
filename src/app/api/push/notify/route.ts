// IMPORTANT: This is a test endpoint to trigger a notification.
// In a real application, this would be secured and likely triggered by a backend event (e.g., a new article is published).

import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { subscriptions } from '../subscribe/route'; // In-memory store for demo

export async function POST(req: NextRequest) {
  if (
    !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    !process.env.VAPID_PRIVATE_KEY
  ) {
    return NextResponse.json(
      { error: 'VAPID keys are not configured.' },
      { status: 500 }
    );
  }

  webpush.setVapidDetails(
    'mailto:your-email@example.com', // Replace with your email
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  const { title, body, url } = await req.json();

  if (!title || !body) {
    return NextResponse.json(
      { error: 'Title and body are required.' },
      { status: 400 }
    );
  }

  const notificationPayload = JSON.stringify({
    title,
    body,
    url,
  });

  const promises = subscriptions.map((sub) =>
    webpush.sendNotification(sub, notificationPayload).catch((err) => {
      // If a subscription is invalid, you might want to remove it from your store
      console.error(`Failed to send notification to ${sub.endpoint}:`, err);
    })
  );

  try {
    await Promise.all(promises);
    return NextResponse.json({
      message: `${subscriptions.length} notifications sent.`,
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications.' },
      { status: 500 }
    );
  }
}
