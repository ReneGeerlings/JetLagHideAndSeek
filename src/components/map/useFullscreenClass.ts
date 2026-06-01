import { useEffect } from "react";

/**
 * Voegt of verwijdert de class 'fullscreen' op het <main>-element wanneer de
 * fullscreen-modus aan- of uitgezet wordt. Daarmee kan Tailwind via
 * group-[.fullscreen] de UI-overlays verbergen.
 */
export const useFullscreenClass = () => {
    useEffect(() => {
        const handleFullscreenChange = () => {
            const mainElement: HTMLElement | null =
                document.querySelector("main");
            if (!mainElement) return;
            if (document.fullscreenElement) {
                mainElement.classList.add("fullscreen");
            } else {
                mainElement.classList.remove("fullscreen");
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            );
        };
    }, []);
};
