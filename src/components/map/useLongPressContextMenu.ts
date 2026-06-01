import * as L from "leaflet";
import { useEffect } from "react";

const LONG_PRESS_MS = 600;
const MOVE_TOLERANCE_PX = 10;

/**
 * Long-press → context-menu (D1). iOS Safari kent geen rechter-muisklik, dus
 * zonder dit blijft het hele kaart-context-menu (Add Radius/Thermometer/.../
 * Exclude Country/Copy Coordinates) onbereikbaar op iPad. We luisteren op
 * native touchstart en triggeren na 600 ms Leaflet's 'contextmenu' event
 * handmatig; de leaflet-contextmenu-plugin pikt dat op.
 */
export const useLongPressContextMenu = (map: L.Map | null) => {
    useEffect(() => {
        if (!map) return;
        const container = map.getContainer();

        let pressTimer: ReturnType<typeof setTimeout> | null = null;
        let startX = 0;
        let startY = 0;
        let startLatLng: L.LatLng | null = null;

        const cancel = () => {
            if (pressTimer !== null) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length !== 1) {
                cancel();
                return;
            }
            const target = e.target as HTMLElement | null;
            if (target && target.closest(".leaflet-control")) return;

            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            const rect = container.getBoundingClientRect();
            const point = L.point(
                touch.clientX - rect.left,
                touch.clientY - rect.top,
            );
            startLatLng = map.containerPointToLatLng(point);

            cancel();
            pressTimer = setTimeout(() => {
                pressTimer = null;
                if (!startLatLng) return;
                map.fire("contextmenu", {
                    latlng: startLatLng,
                    layerPoint: map.latLngToLayerPoint(startLatLng),
                    containerPoint: map.latLngToContainerPoint(startLatLng),
                    originalEvent: e,
                } as L.LeafletMouseEvent);
            }, LONG_PRESS_MS);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (pressTimer === null || e.touches.length !== 1) {
                cancel();
                return;
            }
            const touch = e.touches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            if (dx * dx + dy * dy > MOVE_TOLERANCE_PX * MOVE_TOLERANCE_PX) {
                cancel();
            }
        };

        container.addEventListener("touchstart", handleTouchStart, {
            passive: true,
        });
        container.addEventListener("touchmove", handleTouchMove, {
            passive: true,
        });
        container.addEventListener("touchend", cancel, { passive: true });
        container.addEventListener("touchcancel", cancel, { passive: true });

        return () => {
            cancel();
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", cancel);
            container.removeEventListener("touchcancel", cancel);
        };
    }, [map]);
};
