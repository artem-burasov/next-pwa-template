'use client';

import { useEffect, useState } from 'react';
import Button from "@/components/ui/Button";
import Input from '@/components/ui/Input';

function PushSubscription() {
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        async function subscribe() {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                const registration = await navigator.serviceWorker.ready;
                const existingSubscription = await registration.pushManager.getSubscription();

                if (existingSubscription) {
                    setIsSubscribed(true);
                    return;
                }

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
                });

                const response = await fetch('/api/push', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'subscribe', data: subscription }),
                });

                if (response.ok) {
                    setIsSubscribed(true);
                }
            }
        }

        if (Notification.permission === 'default') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    subscribe();
                }
            });
        } else if (Notification.permission === 'granted') {
            subscribe();
        }
    }, []);

    const handleUnsubscribe = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await subscription.unsubscribe();
                await fetch('/api/push', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'unsubscribe' }),
                });
                setIsSubscribed(false);
            }
        }
    };

    const handleSendNotification = async () => {
        if (!notificationMessage) return;
        await fetch('/api/push', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'send', data: { message: notificationMessage } }),
        });
        setNotificationMessage('');
    };

    return (
        <div className="w-full">
            {isSubscribed ? (
                <>
                    <Button onClick={handleUnsubscribe} className="w-full mb-2">
                        Unsubscribe from Notifications
                    </Button>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            value={notificationMessage}
                            onChange={(e) => setNotificationMessage(e.target.value)}
                            placeholder="Enter notification message"
                        />
                        <Button onClick={handleSendNotification}>Send Test Notification</Button>
                    </div>
                </>
            ) : (
                <Button
                    onClick={() =>
                        Notification.requestPermission().then((permission) => {
                            if (permission === 'granted') {
                                window.location.reload();
                            }
                        })
                    }
                >
                    Enable Push Notifications
                </Button>
            )}
        </div>
    );
}

export default PushSubscription;
