'use client';

import { useEffect } from "react";

function useServiceWorker() {
    useEffect(() => {
        if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log("Service Worker registered:", registration);

                    // Check updates
                    setInterval(() => {
                        registration.update();
                    }, 10 * 60 * 1000);
                })
                .catch((error) => console.error("Service Worker registration failed:", error));
        }
    }, []);
}

export default useServiceWorker;
