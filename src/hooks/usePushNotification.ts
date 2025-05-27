import { useState, useEffect, useCallback } from 'react';

interface PushNotificationData {
    isSubscribed: boolean;
    subscribe: () => Promise<void>;
    unsubscribe: () => Promise<void>;
    sendMessage: (message: string) => Promise<void>;
}

function usePushNotification(): PushNotificationData {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);

    useEffect(() => {
        async function checkSubscription() {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                const registration = await navigator.serviceWorker.ready;
                const existingSubscription = await registration.pushManager.getSubscription();
                if (existingSubscription) {
                    setSubscription(existingSubscription);
                    setIsSubscribed(true);
                }
            }
        }

        if (Notification.permission === 'granted') {
            checkSubscription();
        }
    }, []);

    const subscribe = useCallback(async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') return;

                const registration = await navigator.serviceWorker.ready;
                const existingSubscription = await registration.pushManager.getSubscription();

                if (!existingSubscription) {
                    const newSubscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
                    });

                    setSubscription(newSubscription);
                    setIsSubscribed(true);
                }
            } catch (error) {
                console.error('Subscription error:', error);
            }
        }
    }, []);

    const unsubscribe = useCallback(async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                const currentSubscription = await registration.pushManager.getSubscription();
                if (currentSubscription) {
                    await currentSubscription.unsubscribe();
                    setSubscription(null);
                    setIsSubscribed(false);
                }
            } catch (error) {
                console.error('Unsubscribe error:', error);
            }
        }
    }, []);

    const sendMessage = useCallback(async (message: string) => {
        if (!message || !subscription) {
            console.error('No subscription or message provided');
            return;
        }

        try {
            const response = await fetch('/api/push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription, message }),
            });

            if (!response.ok) {
                throw new Error('Failed to send notification');
            }
        } catch (error) {
            console.error('Send message error:', error);
        }
    }, [subscription]);

    return { isSubscribed, subscribe, unsubscribe, sendMessage };
}

export default usePushNotification;
