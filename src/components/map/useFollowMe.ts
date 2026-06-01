import * as L from "leaflet";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { useTranslation } from "@/i18n";
import { followMe } from "@/lib/context";

/**
 * Volgt de positie van de gebruiker met een blauwe stip op de kaart, zolang
 * de 'followMe'-store true is. Bij weigering of fout: store uitzetten en
 * vertaalde foutmelding tonen.
 */
export const useFollowMe = (
    map: L.Map | null,
    enabled: boolean | { latitude: number; longitude: number },
) => {
    const markerRef = useRef<L.Marker | null>(null);
    const watchIdRef = useRef<number | null>(null);
    const t = useTranslation();

    useEffect(() => {
        if (!map) return;

        if (!enabled) {
            if (markerRef.current) {
                map.removeLayer(markerRef.current);
                markerRef.current = null;
            }
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            return;
        }

        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                if (markerRef.current) {
                    markerRef.current.setLatLng([lat, lng]);
                } else {
                    const marker = L.marker([lat, lng], {
                        icon: L.divIcon({
                            html: `<div class="text-blue-700 bg-white rounded-full border-2 border-blue-700 shadow w-5 h-5 flex items-center justify-center"><svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="#2A81CB" opacity="0.5"/><circle cx="8" cy="8" r="3" fill="#2A81CB"/></svg></div>`,
                            className: "",
                        }),
                        zIndexOffset: 1000,
                    });
                    marker.addTo(map);
                    markerRef.current = marker;
                }
            },
            () => {
                toast.error(t("map.toastUnableToAccessLocation"));
                followMe.set(false);
            },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 },
        );

        return () => {
            if (markerRef.current) {
                map.removeLayer(markerRef.current);
                markerRef.current = null;
            }
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
        };
    }, [enabled, map, t]);
};
