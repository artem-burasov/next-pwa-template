'use server';

import { NextResponse } from 'next/server';
import webPush, { PushSubscription } from 'web-push';

webPush.setVapidDetails(
    process.env.NEXT_PUBLIC_VAPID_SUBJECT as string,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string
);

let subscription: PushSubscription | null = null;

export async function POST(request: Request) {
    const { action, data } = await request.json();

    if (action === 'subscribe') {
        subscription = data;
        // In a production environment, store in a database
        return NextResponse.json({ success: true });
    }

    if (action === 'unsubscribe') {
        subscription = null;
        // In a production environment, remove from database
        return NextResponse.json({ success: true });
    }

    if (action === 'send') {
        if (!subscription) {
            return NextResponse.json(
                { success: false, error: 'No subscription available' },
                { status: 400 }
            );
        }

        try {
            await webPush.sendNotification(
                subscription,
                JSON.stringify({
                    title: 'QR PWA Notification',
                    body: data.message,
                    icon: '/icon-192x192.png',
                })
            );
            return NextResponse.json({ success: true });
        } catch (error) {
            console.error('Error sending push notification:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to send notification' },
                { status: 500 }
            );
        }
    }

    return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
    );
}
