import { useState, useEffect, useCallback } from 'react';

interface PushNotificationData {
    isSupported: boolean; // Added isSupported
    isSubscribed: boolean;
    subscribe: () => Promise<void>;
    unsubscribe: () => Promise<void>;
    sendMessage: (message: string) => Promise<void>;
}

function usePushNotification(): PushNotificationData {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;

    useEffect(() => {
        async function checkSubscription() {
            if (isSupported) {
                const registration = await navigator.serviceWorker.ready;
                const existingSubscription = await registration.pushManager.getSubscription();
                if (existingSubscription) {
                    setSubscription(existingSubscription);
                    setIsSubscribed(true);
                }
            }
        }

        if (isSupported && Notification.permission === 'granted') {
            checkSubscription();
        }
    }, [isSupported]);

    const subscribe = useCallback(async () => {
        if (!isSupported) {
            console.error('Push notifications are not supported in this browser');
            return;
        }

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
    }, [isSupported]);

    const unsubscribe = useCallback(async () => {
        if (!isSupported) {
            console.error('Push notifications are not supported in this browser');
            return;
        }

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
    }, [isSupported]);

    const sendMessage = useCallback(async (message: string) => {
        if (!isSupported) {
            console.error('Push notifications are not supported in this browser');
            return;
        }

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
    }, [subscription, isSupported]);

    return { isSupported, isSubscribed, subscribe, unsubscribe, sendMessage };
}

export default usePushNotification;
