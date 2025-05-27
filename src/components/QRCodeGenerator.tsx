'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

function QRCodeGenerator() {
    const [qrValue, setQrValue] = useState("");
    const [showQR, setShowQR] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Handle deep link
        const urlParams = new URLSearchParams(window.location.search);
        const deepLinkUrl = urlParams.get('url');
        if (deepLinkUrl) {
            setQrValue(deepLinkUrl);
            if (validateURL(deepLinkUrl)) {
                setShowQR(true);
                setError(null);
            } else {
                setError('Invalid URL from deep link');
                setShowQR(false);
            }
        }
    }, []);

    const validateURL = (value: string): boolean => {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    };

    const handleGenerateQR = () => {
        if (!validateURL(qrValue)) {
            setError('Please enter a valid URL');
            setShowQR(false);
            return;
        }

        setError(null);
        setShowQR(true);
    };

    const handleDeepLinkTest = () => {
        if (!validateURL(qrValue)) {
            setError('Please enter a valid URL');
            setShowQR(false);
            return;
        }

        // Attempt to open PWA via custom URL scheme
        window.location.href = `myapp://open?url=${encodeURIComponent(qrValue)}`;
    };

    return (
        <div className="w-full">
            <Input
                type="text"
                value={qrValue}
                onChange={(e) => {
                    setQrValue(e.target.value);
                    setError(null); // Clear error on input change
                    setShowQR(false); // Hide QR until generate is clicked
                }}
                placeholder="Enter a valid URL (e.g., https://example.com)"
                className="mb-2 w-full"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <Button onClick={handleGenerateQR} className="w-full mb-2">
                Generate QR Code
            </Button>
            <Button onClick={handleDeepLinkTest} className="w-full mb-2">
                Test Deep Link
            </Button>
            {showQR && qrValue && (
                <div className="flex justify-center">
                    <QRCodeSVG value={qrValue} size={200} />
                </div>
            )}
        </div>
    );
}

export default QRCodeGenerator;
