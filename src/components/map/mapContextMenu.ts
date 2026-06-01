import * as turf from "@turf/turf";
import { toast } from "react-toastify";

import type { useTranslation } from "@/i18n";
import { addQuestion } from "@/lib/context";

type TranslateFn = ReturnType<typeof useTranslation>;

type ContextMenuItem = {
    text: string;
    callback: (e: { latlng: { lat: number; lng: number } }) => void;
};

/**
 * Bouwt de items-array voor leaflet-contextmenu. Wordt door rechter-muisklik
 * (desktop) en long-press (iPad, via useLongPressContextMenu) geactiveerd.
 * Logica identiek aan de oorspronkelijke inline-definitie in Map.tsx; alleen
 * de teksten lopen door de vertaal-functie.
 */
export const buildMapContextMenu = (t: TranslateFn): ContextMenuItem[] => [
    {
        text: t("addQuestionDialog.addRadius"),
        callback: (e) =>
            addQuestion({
                id: "radius",
                data: { lat: e.latlng.lat, lng: e.latlng.lng },
            }),
    },
    {
        text: t("addQuestionDialog.addThermometer"),
        callback: (e) => {
            const destination = turf.destination(
                [e.latlng.lng, e.latlng.lat],
                5,
                90,
                { units: "miles" },
            );
            addQuestion({
                id: "thermometer",
                data: {
                    latA: e.latlng.lat,
                    lngA: e.latlng.lng,
                    latB: destination.geometry.coordinates[1],
                    lngB: destination.geometry.coordinates[0],
                },
            });
        },
    },
    {
        text: t("addQuestionDialog.addTentacles"),
        callback: (e) =>
            addQuestion({
                id: "tentacles",
                data: { lat: e.latlng.lat, lng: e.latlng.lng },
            }),
    },
    {
        text: t("addQuestionDialog.addMatching"),
        callback: (e) =>
            addQuestion({
                id: "matching",
                data: { lat: e.latlng.lat, lng: e.latlng.lng },
            }),
    },
    {
        text: t("addQuestionDialog.addMeasuring"),
        callback: (e) =>
            addQuestion({
                id: "measuring",
                data: { lat: e.latlng.lat, lng: e.latlng.lng },
            }),
    },
    {
        text: t("map.contextMenu.excludeCountry"),
        callback: (e) =>
            addQuestion({
                id: "matching",
                data: {
                    lat: e.latlng.lat,
                    lng: e.latlng.lng,
                    same: false,
                    cat: { adminLevel: 2 },
                    type: "zone",
                },
            }),
    },
    {
        text: t("map.contextMenu.copyCoordinates"),
        callback: (e) => {
            if (!navigator || !navigator.clipboard) {
                toast.error(t("map.toastClipboardUnsupported"));
                return;
            }
            const latitude = e.latlng.lat;
            const longitude = e.latlng.lng;
            toast.promise(
                navigator.clipboard.writeText(
                    `${Math.abs(latitude)}°${latitude > 0 ? "N" : "S"}, ${Math.abs(
                        longitude,
                    )}°${longitude > 0 ? "E" : "W"}`,
                ),
                {
                    pending: t("map.toastWritingCoordinates"),
                    success: t("map.toastCoordinatesCopied"),
                    error: t("map.toastCoordinatesCopyError"),
                },
                { autoClose: 1000 },
            );
        },
    },
];
