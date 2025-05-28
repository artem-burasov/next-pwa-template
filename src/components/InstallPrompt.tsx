'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

function InstallPrompt() {
    const [isMobile, setIsMobile] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        // Detect mobile device
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
        setIsMobile(isMobileDevice);

        // Check if already installed (standalone mode)
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        } else {
            // Check if banner is hidden
            const hideUntil = localStorage.getItem('hideUntil');
            if (hideUntil && new Date().getTime() < parseInt(hideUntil)) {
                setIsHidden(true);
            }

            // Listen for beforeinstallprompt
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                setInstallPrompt(e);
            });
        }

        // Cleanup event listener
        return () => {
            window.removeEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                setInstallPrompt(e);
            });
        };
    }, []);

    const handleInstall = async () => {
        if (installPrompt) {
            // @ts-expect-error: Prompt type is not fully supported
            await installPrompt.prompt();
            // @ts-expect-error: Prompt type is not fully supported
            const { outcome } = await installPrompt.userChoice;
            if (outcome === 'accepted') {
                setIsInstalled(true);
                setInstallPrompt(null);
            }
        }
    };

    const handleOpen = () => {
        // Redirect to PWA or main page (simplified)
        window.location.href = '/';
    };

    const handleClose = () => {
        // Hide banner and set expiration time (24 hours)
        const hideUntil = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem('hideUntil', hideUntil.toString());
        setIsHidden(true);
    };

    if (!isMobile || (isInstalled && !installPrompt) || isHidden) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg flex flex-col items-center z-50">
            <button
                onClick={handleClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                aria-label="Close install prompt"
            >
                ×
            </button>
            <p className="mb-2 text-center text-black">Install our app for a better experience!</p>
            <div className="flex space-x-4">
                <Button onClick={handleInstall}>Install Now</Button>
                <Button onClick={handleOpen}>Open</Button>
            </div>
        </div>
    );
}

export default InstallPrompt;
