'use client';

import { useState, useEffect } from 'react';

import Button from '@/components/ui/Button';

function InstallPrompt() {
    const [isMobile, setIsMobile] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [installPrompt, setInstallPrompt] = useState<Event | null>(null);

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
            // Listen for beforeinstallprompt
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                setInstallPrompt(e);
            });

            // Check if prompt was already shown
            const promptShown = localStorage.getItem('installPromptShown');
            if (promptShown) setIsInstalled(true);
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
            // @ts-expect-error: FIXME
            await installPrompt.prompt();
            // @ts-expect-error: FIXME
            const { outcome } = await installPrompt.userChoice;
            if (outcome === 'accepted') {
                setIsInstalled(true);
                localStorage.setItem('installPromptShown', 'true');
                setInstallPrompt(null);
            }
        }
    };

    if (!isMobile || isInstalled || !installPrompt) {
        return null;
    }

    return (
        <div className="fixed bottom-4 md:left-1/2 transform md:-translate-x-1/2 bg-white p-4 rounded shadow-lg flex flex-col items-center">
            <p className="mb-2 text-center text-black">Install our app for a better experience!</p>
            <Button onClick={handleInstall}>Install Now</Button>
        </div>
    );
}

export default InstallPrompt;
