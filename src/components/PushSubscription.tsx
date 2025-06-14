'use client';

import { useState } from 'react';

import usePushNotification from '@/hooks/usePushNotification';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

function PushNotification() {
    const { isSupported, isSubscribed, subscribe, unsubscribe, sendMessage } = usePushNotification();
    const [notificationMessage, setNotificationMessage] = useState('');

    const handleSendNotification = async () => {
        await sendMessage(notificationMessage);
        setNotificationMessage('');
    };

    if (!isSupported) {
        return (
            <div className="w-full">
                <p className="text-red-500">Push notifications are not supported in this browser.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {isSubscribed ? (
                <>
                    <Button onClick={unsubscribe} className="w-full mb-2">
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
                <Button onClick={subscribe}>Enable Push Notifications</Button>
            )}
        </div>
    );
}

export default PushNotification;
