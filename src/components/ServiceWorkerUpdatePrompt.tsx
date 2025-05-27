'use client';

import { useState, useEffect } from 'react';

import Button from '@/components/ui/Button';

function ServiceWorkerUpdatePrompt() {
    const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                setWaitingWorker(newWorker);
                                setShowPrompt(true);
                            }
                        });
                    }
                });
            });

            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });
        }
    }, []);

    const handleUpdate = () => {
        if (waitingWorker) {
            waitingWorker.postMessage({ type: 'SKIP_WAITING' });
            setShowPrompt(false);
        }
    };

    if (!showPrompt) {
        return null;
    }

    return (
        <div className="fixed top-4 md:left-1/2 md:transform md:-translate-x-1/2 bg-white p-4 rounded shadow-lg flex flex-col items-center z-50">
            <p className="mb-2 text-center">New version of the application is available!</p>
            <Button onClick={handleUpdate}>Update now</Button>
        </div>
    );
}

export default ServiceWorkerUpdatePrompt;
