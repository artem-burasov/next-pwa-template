'use server';

import { NextResponse } from 'next/server';
import webPush from 'web-push';

webPush.setVapidDetails(
    process.env.NEXT_PUBLIC_VAPID_SUBJECT as string,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string
);

export async function POST(request: Request) {
    const { subscription, message } = await request.json();

    if (!subscription || !message) {
        return NextResponse.json(
            { success: false, error: 'Subscription or message missing' },
            { status: 400 }
        );
    }

    try {
        await webPush.sendNotification(
            subscription,
            JSON.stringify({
                title: 'QR PWA Notification',
                body: message,
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
