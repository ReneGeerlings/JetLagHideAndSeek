import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { useTranslation } from "@/i18n";
import { logger } from "@/lib/logger";

/**
 * Punt 6: bij `registerType: "prompt"` in astro.config moet de app zélf
 * een melding tonen wanneer de service worker een nieuwe versie heeft
 * gedownload. Zonder dit blijven gebruikers op een oude versie tot ze
 * toevallig hun tab refreshen. We tonen een "blijf staan"-toast met een
 * knop die de SW activeert en de pagina herlaadt.
 *
 * Dit component rendert niets visueels.
 */
export const PwaUpdatePrompt = () => {
    const t = useTranslation();
    const registered = useRef(false);

    useEffect(() => {
        if (registered.current) return;
        registered.current = true;

        // Vite-PWA's virtual module — alleen aanwezig na build.
        import("virtual:pwa-register")
            .then(({ registerSW }) => {
                const updateSW = registerSW({
                    immediate: true,
                    onNeedRefresh() {
                        toast.info(t("pwa.updateAvailable"), {
                            toastId: "pwa-update",
                            autoClose: false,
                            closeOnClick: false,
                            closeButton: ({ closeToast }) => (
                                <div className="flex flex-col gap-1 ml-2">
                                    <button
                                        className="rounded bg-blue-600 px-3 py-1 text-white text-sm font-semibold"
                                        onClick={() => {
                                            updateSW(true);
                                        }}
                                    >
                                        {t("pwa.reload")}
                                    </button>
                                    <button
                                        className="rounded border border-slate-500 px-3 py-1 text-slate-200 text-sm"
                                        onClick={closeToast}
                                    >
                                        {t("pwa.later")}
                                    </button>
                                </div>
                            ),
                        });
                    },
                    onOfflineReady() {
                        toast.success(t("pwa.offlineReady"), {
                            toastId: "pwa-offline-ready",
                            autoClose: 4000,
                        });
                    },
                    onRegisteredSW(swUrl) {
                        logger.log("SW geregistreerd:", swUrl);
                    },
                });
            })
            .catch((err) => {
                // In dev-mode bestaat virtual:pwa-register niet — geen probleem.
                logger.log("PWA register skipped:", err);
            });
    }, [t]);

    return null;
};
