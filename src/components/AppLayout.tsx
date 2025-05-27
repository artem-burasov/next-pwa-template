'use client';

import type { ReactNode } from "react";

import useServiceWorker from "@/hooks/useServiceWorker";

function AppLayout({
   children,
}: Readonly<{
    children: ReactNode;
}>) {
    useServiceWorker();

    return (
        <>
            { children }
        </>
    );
}

export default AppLayout;
