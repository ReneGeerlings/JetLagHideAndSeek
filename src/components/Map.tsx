import "leaflet/dist/leaflet.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu.css";
import "leaflet-contextmenu";

import { useStore } from "@nanostores/react";
import * as turf from "@turf/turf";
import * as L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, ScaleControl } from "react-leaflet";
import { toast } from "react-toastify";

import { useTranslation } from "@/i18n";
import {
    additionalMapGeoLocations,
    animateMapMovements,
    autoZoom,
    baseTileLayer,
    followMe,
    hiderMode,
    isLoading,
    leafletMapContext,
    mapGeoJSON,
    mapGeoLocation,
    permanentOverlay,
    planningModeEnabled,
    polyGeoJSON,
    questionFinishedMapData,
    questions,
    thunderforestApiKey,
    triggerLocalRefresh,
} from "@/lib/context";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
import { applyQuestionsToMapGeoData, holedMask } from "@/maps";
import { hiderifyQuestion } from "@/maps";
import { determineMapBoundaries } from "@/maps/api";

import { DraggableMarkers } from "./DraggableMarkers";
import { LeafletFullScreenButton } from "./LeafletFullScreenButton";
import { buildMapContextMenu } from "./map/mapContextMenu";
import { MapTileLayer } from "./map/MapTileLayer";
import { useFollowMe } from "./map/useFollowMe";
import { useFullscreenClass } from "./map/useFullscreenClass";
import { useLongPressContextMenu } from "./map/useLongPressContextMenu";
import { usePermanentOverlay } from "./map/usePermanentOverlay";
import { useStartupZoom } from "./map/useStartupZoom";
import { MapPrint } from "./MapPrint";
import { PolygonDraw } from "./PolygonDraw";

export const Map = ({ className }: { className?: string }) => {
    const t = useTranslation();
    useStore(additionalMapGeoLocations);
    const $mapGeoLocation = useStore(mapGeoLocation);
    const $questions = useStore(questions);
    const $baseTileLayer = useStore(baseTileLayer);
    const $thunderforestApiKey = useStore(thunderforestApiKey);
    const $hiderMode = useStore(hiderMode);
    const $followMe = useStore(followMe);
    const $permanentOverlay = useStore(permanentOverlay);
    const map = useStore(leafletMapContext);

    // Race-fix (A1): als refresh al loopt, onthouden dat er nog een
    // update moet komen. Na de huidige run draaien we 'm meteen opnieuw.
    const pendingRefreshRef = useRef<boolean>(false);
    const pendingFocusRef = useRef<boolean>(false);

    const refreshQuestions = async (focus: boolean = false) => {
        if (!map) return;

        if (isLoading.get()) {
            pendingRefreshRef.current = true;
            if (focus) pendingFocusRef.current = true;
            return;
        }

        isLoading.set(true);

        // Was: cache wissen bij 0 vragen. Verwijderd zodat eerder opgehaalde
        // Overpass-data beschikbaar blijft.

        let mapGeoData = mapGeoJSON.get();

        if (!mapGeoData) {
            const polyGeoData = polyGeoJSON.get();
            if (polyGeoData) {
                mapGeoData = polyGeoData;
                mapGeoJSON.set(polyGeoData);
            } else {
                await toast.promise(
                    determineMapBoundaries()
                        .then((x) => {
                            mapGeoJSON.set(x);
                            mapGeoData = x;
                        })
                        .catch((error) => logger.log(error)),
                    {
                        error: "Error refreshing map data",
                    },
                );
            }
        }

        if ($hiderMode !== false) {
            for (const question of $questions) {
                await hiderifyQuestion(question);
            }
            triggerLocalRefresh.set(Math.random());
        }

        map.eachLayer((layer: any) => {
            if (layer.questionKey || layer.questionKey === 0) {
                map.removeLayer(layer);
            }
        });

        try {
            const playAreaGeoData = mapGeoData;
            mapGeoData = await applyQuestionsToMapGeoData(
                $questions,
                mapGeoData,
                planningModeEnabled.get(),
                (geoJSONObj, question) => {
                    const geoJSONPlane = L.geoJSON(geoJSONObj);
                    // @ts-expect-error markeren zodat alleen deze laag verwijderd wordt
                    geoJSONPlane.questionKey = question.key;
                    geoJSONPlane.addTo(map);
                },
            );

            mapGeoData = {
                type: "FeatureCollection",
                features: [holedMask(mapGeoData!)!],
            };

            map.eachLayer((layer: any) => {
                if (layer.eliminationGeoJSON) {
                    map.removeLayer(layer);
                }
            });

            const g = L.geoJSON(mapGeoData);
            // @ts-expect-error markeren zodat alleen deze laag verwijderd wordt
            g.eliminationGeoJSON = true;
            g.addTo(map);

            questionFinishedMapData.set(mapGeoData);

            if (autoZoom.get() && focus) {
                let bounds: [[number, number], [number, number]];
                if ($questions.length === 0 && !$hiderMode && playAreaGeoData) {
                    const bbox = turf.bbox(playAreaGeoData as any);
                    bounds = [
                        [bbox[1], bbox[0]],
                        [bbox[3], bbox[2]],
                    ];
                } else {
                    const bbox = turf.bbox(holedMask(mapGeoData) as any);
                    bounds = [
                        [bbox[1], bbox[0]],
                        [bbox[3], bbox[2]],
                    ];
                }

                if (animateMapMovements.get()) {
                    map.flyToBounds(bounds);
                } else {
                    map.fitBounds(bounds);
                }
            }
        } catch (error) {
            logger.log(error);

            isLoading.set(false);
            if (document.querySelectorAll(".Toastify__toast").length === 0) {
                return toast.error(t("map.toastNoSolutions"));
            }
        } finally {
            isLoading.set(false);
            // A1: pending refresh meteen oppakken.
            if (pendingRefreshRef.current) {
                pendingRefreshRef.current = false;
                const refocus = pendingFocusRef.current;
                pendingFocusRef.current = false;
                queueMicrotask(() => refreshQuestions(refocus));
            }
        }
    };

    const displayMap = useMemo(
        () => (
            <MapContainer
                center={$mapGeoLocation.geometry.coordinates}
                zoom={5}
                className={cn("w-full h-full", className)}
                ref={leafletMapContext.set}
                // @ts-expect-error react-contextmenu types lopen niet mee
                contextmenu={true}
                contextmenuWidth={140}
                contextmenuItems={buildMapContextMenu(t)}
            >
                <MapTileLayer
                    tileLayer={$baseTileLayer}
                    thunderforestApiKey={$thunderforestApiKey}
                />
                <DraggableMarkers />
                <div className="leaflet-top leaflet-right">
                    <div className="leaflet-control flex-col flex gap-2">
                        <LeafletFullScreenButton />
                    </div>
                </div>
                <PolygonDraw />
                <ScaleControl position="bottomleft" />
                <MapPrint
                    position="topright"
                    sizeModes={["Current", "A4Portrait", "A4Landscape"]}
                    hideControlContainer={false}
                    hideClasses={[
                        "leaflet-full-screen-specific-name",
                        "leaflet-top",
                        "leaflet-control-easyPrint",
                        "leaflet-draw",
                    ]}
                    title="Print"
                />
            </MapContainer>
        ),
        [map, $baseTileLayer, $thunderforestApiKey],
    );

    useEffect(() => {
        if (!map) return;
        refreshQuestions(true);
    }, [$questions, map, $hiderMode]);

    // Opgesplitste hooks (E1). Geen logica gewijzigd; alleen leesbaarheid.
    useStartupZoom(map, $mapGeoLocation);
    useFullscreenClass();
    useFollowMe(map, $followMe);
    usePermanentOverlay(map, $permanentOverlay);
    useLongPressContextMenu(map);

    return displayMap;
};
