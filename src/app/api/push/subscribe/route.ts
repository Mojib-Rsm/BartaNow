// This is a simple in-memory store for push subscriptions for demonstration purposes.
// In a production application, you should store these subscriptions in a persistent database (e.g., DynamoDB, Firestore, etc.).
import { NextRequest, NextResponse } from 'next/server';
import type { PushSubscription } from 'web-push';

export let subscriptions: PushSubscription[] = [];

export async function POST(req: NextRequest) {
  try {
    const subscription = (await req.json()) as PushSubscription;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription object' },
        { status: 400 }
      );
    }
    
    // Avoid storing duplicate subscriptions
    if (!subscriptions.some(s => s.endpoint === subscription.endpoint)) {
        subscriptions.push(subscription);
        console.log('Subscription added:', subscription);
    } else {
        console.log('Subscription already exists:', subscription);
    }

    return NextResponse.json({ success: true, message: 'Subscription saved.' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription.' },
      { status: 500 }
    );
  }
}
