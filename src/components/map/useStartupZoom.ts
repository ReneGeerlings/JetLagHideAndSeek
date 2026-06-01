import type { Map as LeafletMap } from "leaflet";
import { useEffect } from "react";

import {
    animateMapMovements,
    autoZoom,
    mapGeoLocation,
    polyGeoJSON,
} from "@/lib/context";

type GeoLocationLike = ReturnType<typeof mapGeoLocation.get>;

/**
 * Twee gerelateerde effects:
 *
 * 1) Wanneer de play-area-extent verandert (gebruiker kiest een ander land),
 *    de kaart fitten op die bounding box. Wachten één animation frame zodat
 *    Leaflet de container-grootte heeft.
 *
 * 2) Bij opstart, alleen als 'auto-zoom' aan staat én er geen eigen polygoon
 *    is, GPS opvragen om naar de gebruiker te zoomen. Op iOS Safari is "weiger"
 *    permanent, dus we vragen alleen als de gebruiker auto-zoom expliciet aan
 *    heeft staan.
 */
export const useStartupZoom = (
    map: LeafletMap | null,
    geoLocation: GeoLocationLike,
) => {
    // 1) fitBounds op country-extent bij geo-wijziging
    useEffect(() => {
        if (!map) return;
        const extent = geoLocation.properties?.extent;
        if (!extent || extent.length < 4) return;
        const [north, west, south, east] = extent;
        const bounds: [[number, number], [number, number]] = [
            [south, west],
            [north, east],
        ];
        const id = requestAnimationFrame(() => {
            map.invalidateSize();
            if (animateMapMovements.get()) {
                map.flyToBounds(bounds);
            } else {
                map.fitBounds(bounds);
            }
        });
        return () => cancelAnimationFrame(id);
    }, [map, geoLocation]);

    // 2) GPS-prompt — alleen als autoZoom aan staat en er nog geen eigen
    //    polygoon is. Voorkomt ongevraagde locatie-dialogen op iPad.
    useEffect(() => {
        if (!map) return;
        if (!autoZoom.get()) return;
        if (polyGeoJSON.get()) return;
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                map.setView([pos.coords.latitude, pos.coords.longitude], 9, {
                    animate: animateMapMovements.get(),
                });
            },
            () => {
                // permission denied / unavailable — keep extent fallback
            },
            { timeout: 10000, maximumAge: 60_000 },
        );
    }, [map]);
};
