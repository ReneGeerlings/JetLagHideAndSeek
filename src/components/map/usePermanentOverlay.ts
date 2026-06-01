import type { FeatureCollection } from "geojson";
import * as L from "leaflet";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { useTranslation } from "@/i18n";

/**
 * Tekent een optionele permanente GeoJSON-overlay onder de andere lagen.
 * Verwijdert hem netjes als de overlay verandert of op null wordt gezet.
 */
export const usePermanentOverlay = (
    map: L.Map | null,
    overlay: FeatureCollection | null,
) => {
    const t = useTranslation();

    useEffect(() => {
        if (!map) return;

        map.eachLayer((layer: any) => {
            if (layer.permanentGeoJSON) map.removeLayer(layer);
        });

        if (overlay === null) return;

        try {
            const layer = L.geoJSON(overlay, {
                interactive: false,
                // @ts-expect-error Leaflet accepteert null, types vereisen Layer
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                pointToLayer(geoJsonPoint, latlng) {
                    return null;
                },
                style(feature) {
                    return {
                        color: feature?.properties?.stroke,
                        weight: feature?.properties?.["stroke-width"],
                        opacity: feature?.properties?.["stroke-opacity"],
                        fillColor: feature?.properties?.fill,
                        fillOpacity: feature?.properties?.["fill-opacity"],
                    };
                },
            });
            // @ts-expect-error markeren zodat alleen deze laag herkend wordt
            layer.permanentGeoJSON = true;
            layer.addTo(map);
            layer.bringToBack();
        } catch (e) {
            toast.error(t("map.toastOverlayFailed", { error: String(e) }));
        }
    }, [overlay, map, t]);
};
