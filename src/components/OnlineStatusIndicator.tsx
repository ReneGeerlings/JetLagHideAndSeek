import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useTranslation } from "@/i18n";

/**
 * Punt 7: kleine status-indicator rechts-boven op de kaart die laat zien of
 * de app online of offline is. In een spel buiten wisselt het netwerk
 * continu; zonder dit denk je "de app is traag" terwijl er gewoon geen
 * signaal is. Toont ook een toast bij de wissel zelf.
 */
export const OnlineStatusIndicator = () => {
    const t = useTranslation();
    const [online, setOnline] = useState<boolean>(
        typeof navigator === "undefined" ? true : navigator.onLine,
    );

    useEffect(() => {
        const handleOnline = () => {
            setOnline(true);
            toast.success(t("network.backOnline"), {
                toastId: "network-online",
                autoClose: 2500,
            });
        };
        const handleOffline = () => {
            setOnline(false);
            toast.warning(t("network.goneOffline"), {
                toastId: "network-offline",
                autoClose: 5000,
            });
        };
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [t]);

    // Online: helemaal niet tonen — minder visuele ruis.
    if (online) return null;

    return (
        <div
            className="fixed bottom-2 left-2 z-[2000] flex items-center gap-1 rounded-md bg-amber-500/90 px-2 py-1 text-xs font-semibold text-amber-950 shadow"
            title={t("network.offlineTooltip")}
            aria-live="polite"
        >
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
            {t("network.offline")}
        </div>
    );
};
