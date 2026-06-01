import { useStore } from "@nanostores/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { language, useTranslation } from "@/i18n";
import { formatZodError } from "@/i18n/zod-errors";
import {
    additionalMapGeoLocations,
    allowGooglePlusCodes,
    alwaysUsePastebin,
    animateMapMovements,
    autoSave,
    autoZoom,
    baseTileLayer,
    customInitPreference,
    customPresets,
    customStations,
    defaultCustomQuestions,
    defaultUnit,
    disabledStations,
    displayHidingZonesOptions,
    followMe,
    hiderMode,
    hidingRadius,
    hidingRadiusUnits,
    hidingZone,
    includeDefaultStations,
    leafletMapContext,
    mapGeoJSON,
    mapGeoLocation,
    pastebinApiKey,
    permanentOverlay,
    planningModeEnabled,
    polyGeoJSON,
    questions,
    save,
    showTutorial,
    thunderforestApiKey,
    triggerLocalRefresh,
    useCustomStations,
} from "@/lib/context";
import { logger } from "@/lib/logger";
import {
    cn,
    compress,
    decompress,
    fetchFromPastebin,
    shareOrFallback,
    uploadToPastebin,
} from "@/lib/utils";
import { questionsSchema } from "@/maps/schema";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { LatitudeLongitude } from "./LatLngPicker";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { Separator } from "./ui/separator";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar-l";
import { UnitSelect } from "./UnitSelect";

const HIDING_ZONE_URL_PARAM = "hz";
const HIDING_ZONE_COMPRESSED_URL_PARAM = "hzc";
const PASTEBIN_URL_PARAM = "pb";

export const OptionDrawers = ({ className }: { className?: string }) => {
    const t = useTranslation();
    useStore(triggerLocalRefresh);
    const $defaultCustomQuestions = useStore(defaultCustomQuestions);
    const $allowGooglePlusCodes = useStore(allowGooglePlusCodes);
    const $defaultUnit = useStore(defaultUnit);
    const $animateMapMovements = useStore(animateMapMovements);
    const $autoZoom = useStore(autoZoom);
    const $hiderMode = useStore(hiderMode);
    const $autoSave = useStore(autoSave);
    const $hidingZone = useStore(hidingZone);
    const $planningMode = useStore(planningModeEnabled);
    const $baseTileLayer = useStore(baseTileLayer);
    const $thunderforestApiKey = useStore(thunderforestApiKey);
    const $pastebinApiKey = useStore(pastebinApiKey);
    const $alwaysUsePastebin = useStore(alwaysUsePastebin);
    const $followMe = useStore(followMe);
    const $customInitPref = useStore(customInitPreference);
    const lastDefaultUnit = useRef($defaultUnit);
    const hasSyncedInitialUnit = useRef(false);
    const [isOptionsOpen, setOptionsOpen] = useState(false);

    useEffect(() => {
        const currentDefault = $defaultUnit;

        if (!hasSyncedInitialUnit.current) {
            hasSyncedInitialUnit.current = true;
            if (hidingRadiusUnits.get() !== currentDefault) {
                hidingRadiusUnits.set(currentDefault);
            }
        } else if (lastDefaultUnit.current !== currentDefault) {
            hidingRadiusUnits.set(currentDefault);
        }

        lastDefaultUnit.current = currentDefault;
    }, [$defaultUnit]);

    useEffect(() => {
        const params = new URL(window.location.toString()).searchParams;
        const hidingZoneOld = params.get(HIDING_ZONE_URL_PARAM);
        const hidingZoneCompressed = params.get(
            HIDING_ZONE_COMPRESSED_URL_PARAM,
        );
        const pastebinId = params.get(PASTEBIN_URL_PARAM);

        if (hidingZoneOld !== null) {
            // Legacy base64 encoding
            try {
                loadHidingZone(atob(hidingZoneOld));
                // Remove hiding zone parameter after initial load
                window.history.replaceState({}, "", window.location.pathname);
            } catch (e) {
                toast.error(
                    t("optionDrawers.toastInvalidHidingZone", {
                        error: formatZodError(e, language.get()),
                    }),
                );
            }
        } else if (hidingZoneCompressed !== null) {
            // Modern compressed format
            decompress(hidingZoneCompressed).then((data) => {
                try {
                    loadHidingZone(data);
                    // Remove hiding zone parameter after initial load
                    window.history.replaceState(
                        {},
                        "",
                        window.location.pathname,
                    );
                } catch (e) {
                    toast.error(
                        t("optionDrawers.toastInvalidHidingZone", {
                            error: formatZodError(e, language.get()),
                        }),
                    );
                }
            });
        } else if (pastebinId !== null) {
            fetchFromPastebin(pastebinId)
                .then((data) => {
                    try {
                        loadHidingZone(data);
                        // Remove pb parameter after initial load
                        window.history.replaceState(
                            {},
                            "",
                            window.location.pathname,
                        );
                        toast.success(t("optionDrawers.toastHidingZoneLoaded"));
                    } catch (e) {
                        toast.error(
                            t("optionDrawers.toastInvalidPastebinData", {
                                error: formatZodError(e, language.get()),
                            }),
                        );
                    }
                })
                .catch((error) => {
                    logger.error("Failed to fetch from Pastebin:", error);
                    toast.error(
                        t("optionDrawers.toastPastebinFetchFailed", {
                            error: error.message,
                        }),
                    );
                });
        }
    }, []);

    const loadHidingZone = (hidingZone: string) => {
        try {
            const geojson = JSON.parse(hidingZone);

            if (
                geojson.properties &&
                geojson.properties.isHidingZone === true
            ) {
                questions.set(
                    questionsSchema.parse(geojson.properties.questions ?? []),
                );
                mapGeoLocation.set(geojson);
                mapGeoJSON.set(null);
                polyGeoJSON.set(null);

                if (geojson.alternateLocations) {
                    additionalMapGeoLocations.set(geojson.alternateLocations);
                } else {
                    additionalMapGeoLocations.set([]);
                }
            } else {
                if (geojson.questions) {
                    questions.set(questionsSchema.parse(geojson.questions));
                    delete geojson.questions;

                    mapGeoJSON.set(geojson);
                    polyGeoJSON.set(geojson);
                } else {
                    questions.set([]);
                    mapGeoJSON.set(geojson);
                    polyGeoJSON.set(geojson);
                }
            }

            const incomingPresets =
                geojson.presets ?? geojson.properties?.presets;
            if (incomingPresets && Array.isArray(incomingPresets)) {
                try {
                    const normalized = (incomingPresets as any[])
                        .filter((p) => p && p.data)
                        .map((p) => {
                            return {
                                id:
                                    p.id ??
                                    (typeof crypto !== "undefined" &&
                                    typeof (crypto as any).randomUUID ===
                                        "function"
                                        ? (crypto as any).randomUUID()
                                        : String(Date.now()) + Math.random()),
                                name: p.name ?? "Imported preset",
                                type: p.type ?? "custom",
                                data: p.data,
                                createdAt:
                                    p.createdAt ?? new Date().toISOString(),
                            };
                        });
                    if (normalized.length > 0) {
                        customPresets.set(normalized);
                        toast.info(
                            t("optionDrawers.toastPresetsImported", {
                                count: normalized.length,
                            }),
                        );
                    }
                } catch (err) {
                    logger.warn("Failed to import presets", err);
                }
            }

            if (
                geojson.disabledStations !== null &&
                geojson.disabledStations.constructor === Array
            ) {
                disabledStations.set(geojson.disabledStations);
            }

            if (geojson.hidingRadius !== null) {
                hidingRadius.set(geojson.hidingRadius);
            }

            if (geojson.zoneOptions) {
                displayHidingZonesOptions.set(geojson.zoneOptions ?? []);
            }

            if (typeof geojson.useCustomStations === "boolean") {
                useCustomStations.set(geojson.useCustomStations);
            }

            if (
                geojson.customStations &&
                geojson.customStations.constructor === Array
            ) {
                customStations.set(geojson.customStations);
            }

            if (typeof geojson.includeDefaultStations === "boolean") {
                includeDefaultStations.set(geojson.includeDefaultStations);
            }

            if (geojson.permanentOverlay) {
                permanentOverlay.set(geojson.permanentOverlay);
            } else {
                permanentOverlay.set(null);
            }

            toast.success(t("optionDrawers.toastHidingZoneLoaded"), {
                autoClose: 2000,
            });
        } catch (e) {
            toast.error(
                t("optionDrawers.toastInvalidHidingZone", {
                    error: formatZodError(e, language.get()),
                }),
            );
        }
    };

    return (
        <div
            className={cn(
                "flex justify-end gap-2 max-[412px]:!mb-4 max-[340px]:flex-col",
                className,
            )}
        >
            <Button
                className="shadow-md"
                onClick={async () => {
                    const hidingZoneString = JSON.stringify($hidingZone);
                    let compressedData;
                    try {
                        compressedData = await compress(hidingZoneString);
                    } catch (error) {
                        logger.error("Compression failed:", error);
                        toast.error(t("optionDrawers.toastShareFailed"));
                        return;
                    }

                    const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
                    let shareUrl = `${baseUrl}?${HIDING_ZONE_COMPRESSED_URL_PARAM}=${compressedData}`;

                    if ($alwaysUsePastebin || shareUrl.length > 2000) {
                        if (!$pastebinApiKey) {
                            toast.error(t("optionDrawers.toastShareTooLarge"));
                            return;
                        }
                        try {
                            toast.info(
                                t("optionDrawers.toastSharingViaPastebin"),
                            );
                            const pastebinUrl = await uploadToPastebin(
                                $pastebinApiKey,
                                hidingZoneString,
                            );
                            const pasteId = pastebinUrl.substring(
                                pastebinUrl.lastIndexOf("/") + 1,
                            );
                            shareUrl = `${baseUrl}?${PASTEBIN_URL_PARAM}=${pasteId}`;
                            toast.success(
                                t("optionDrawers.toastPastebinSuccess"),
                            );
                        } catch (error) {
                            logger.error("Pastebin upload failed:", error);
                            toast.error(t("optionDrawers.toastPastebinFailed"));
                            return;
                        }
                    }

                    // Show platform native share sheet if possible
                    await shareOrFallback(shareUrl).then((result) => {
                        logger.log(`result ${result}`);
                        if (result === false) {
                            return toast.error(
                                t("optionDrawers.toastShareClipboardFallback", {
                                    url: shareUrl,
                                }),
                                { className: "p-0 w-[1000px]" },
                            );
                        }

                        if (result === "clipboard") {
                            toast.success(t("optionDrawers.toastShareCopied"), {
                                autoClose: 2000,
                            });
                        }
                    });
                }}
                data-tutorial-id="share-questions-button"
            >
                {t("optionDrawers.share")}
            </Button>
            <Button
                className="w-24 shadow-md"
                onClick={() => {
                    showTutorial.set(true);
                }}
            >
                {t("optionDrawers.tutorial")}
            </Button>
            <Drawer open={isOptionsOpen} onOpenChange={setOptionsOpen}>
                <DrawerTrigger className="w-24" asChild>
                    <Button
                        className="w-24 shadow-md"
                        data-tutorial-id="option-questions-button"
                    >
                        {t("optionDrawers.options")}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="flex flex-col items-center gap-4 mb-4">
                        <DrawerHeader>
                            <DrawerTitle className="text-4xl font-semibold font-poppins">
                                {t("optionDrawers.title")}
                            </DrawerTitle>
                        </DrawerHeader>
                        <div className="overflow-y-scroll max-h-[40vh] flex flex-col items-center gap-4 max-w-[1000px] px-12">
                            <LanguageSwitcher />
                            <Separator className="bg-slate-300 w-[280px]" />
                            <div className="flex flex-row max-[330px]:flex-col gap-4">
                                <Button
                                    onClick={() => {
                                        if (!navigator || !navigator.clipboard)
                                            return toast.error(
                                                t(
                                                    "optionDrawers.toastClipboardUnsupported",
                                                ),
                                            );
                                        navigator.clipboard.writeText(
                                            JSON.stringify($hidingZone),
                                        );
                                        toast.success(
                                            t(
                                                "optionDrawers.toastHidingZoneCopied",
                                            ),
                                            {
                                                autoClose: 2000,
                                            },
                                        );
                                    }}
                                >
                                    {t("optionDrawers.copyHidingZone")}
                                </Button>
                                <Button
                                    onClick={() => {
                                        if (!navigator || !navigator.clipboard)
                                            return toast.error(
                                                t(
                                                    "optionDrawers.toastClipboardUnsupported",
                                                ),
                                            );
                                        navigator.clipboard
                                            .readText()
                                            .then(loadHidingZone);
                                    }}
                                >
                                    {t("optionDrawers.pasteHidingZone")}
                                </Button>
                            </div>
                            <Separator className="bg-slate-300 w-[280px]" />
                            <Label>{t("optionDrawers.defaultUnit")}</Label>
                            <UnitSelect
                                unit={$defaultUnit}
                                onChange={defaultUnit.set}
                            />
                            <Separator className="bg-slate-300 w-[280px]" />
                            <Label>
                                {t("optionDrawers.newCustomQuestionDefaults")}
                            </Label>
                            <Select
                                trigger="New custom default"
                                options={{
                                    ask: t("optionDrawers.defaultsAskEachTime"),
                                    blank: t(
                                        "optionDrawers.defaultsStartBlank",
                                    ),
                                    prefill: t(
                                        "optionDrawers.defaultsCopyFromCurrent",
                                    ),
                                }}
                                value={$customInitPref}
                                onValueChange={(v) =>
                                    customInitPreference.set(v as any)
                                }
                            />
                            <Separator className="bg-slate-300 w-[280px]" />
                            <Label>{t("optionDrawers.baseMapStyle")}</Label>
                            <Select
                                trigger="Base map style"
                                options={{
                                    voyager: "CARTO Voyager",
                                    light: "CARTO Light",
                                    dark: "CARTO Dark",
                                    transport: "Thunderforest Transport",
                                    neighbourhood:
                                        "Thunderforest Neighbourhood",
                                    osmcarto: "OpenStreetMap Carto",
                                }}
                                value={$baseTileLayer}
                                onValueChange={(v) =>
                                    baseTileLayer.set(v as any)
                                }
                            />
                            <div className="flex flex-col items-center gap-2">
                                <Label>
                                    {t("optionDrawers.thunderforestApiKey")}
                                </Label>
                                <Input
                                    type="text"
                                    value={$thunderforestApiKey}
                                    id="thunderforestApiKey"
                                    onChange={(e) =>
                                        thunderforestApiKey.set(e.target.value)
                                    }
                                    placeholder={t(
                                        "optionDrawers.thunderforestPlaceholder",
                                    )}
                                />
                                <p className="text-xs text-gray-500">
                                    Needed for Thunderforest map styles. Create
                                    a key{" "}
                                    <a
                                        href="https://manage.thunderforest.com/users/sign_up?price=hobby-project-usd"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 cursor-pointer"
                                    >
                                        here.
                                    </a>{" "}
                                    Don&apos;t worry, it&apos;s free.
                                </p>
                            </div>
                            <Separator className="bg-slate-300 w-[280px]" />
                            <div className="flex flex-col items-center gap-2">
                                <Label>
                                    {t("optionDrawers.pastebinApiKey")}
                                </Label>
                                <Input
                                    type="text"
                                    value={$pastebinApiKey}
                                    id="pastebinApiKey"
                                    onChange={(e) =>
                                        pastebinApiKey.set(e.target.value)
                                    }
                                    placeholder={t(
                                        "optionDrawers.pastebinPlaceholder",
                                    )}
                                />
                                <p className="text-xs text-gray-500">
                                    Needed for sharing large game data. Create a
                                    key{" "}
                                    <a
                                        href="https://pastebin.com/doc_api"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 cursor-pointer"
                                    >
                                        here
                                    </a>
                                    .
                                </p>
                            </div>
                            <Separator className="bg-slate-300 w-[280px]" />
                            <Label>
                                {t("optionDrawers.permanentMapOverlay")}
                            </Label>
                            <div className="flex flex-row max-[330px]:flex-col gap-4">
                                <Button
                                    onClick={() => permanentOverlay.set(null)}
                                >
                                    {t("common.remove")}
                                </Button>
                                <Button
                                    onClick={async () => {
                                        if (!navigator || !navigator.clipboard)
                                            return toast.error(
                                                t(
                                                    "optionDrawers.toastClipboardUnsupported",
                                                ),
                                            );

                                        try {
                                            const clipboard =
                                                await navigator.clipboard.readText();
                                            const geojson =
                                                JSON.parse(clipboard);
                                            permanentOverlay.set(geojson);
                                        } catch (e) {
                                            toast.error(
                                                `Invalid GeoJSON overlay: ${e}`,
                                            );
                                        }
                                    }}
                                >
                                    {t("optionDrawers.pasteGeoJSON")}
                                </Button>
                            </div>
                            <Separator className="bg-slate-300 w-[280px]" />
                            <div className="flex flex-row items-center gap-2">
                                <label className="text-2xl font-semibold font-poppins">
                                    {t("optionDrawers.animateMapMovements")}
                                </label>
                                <Checkbox
                                    checked={$animateMapMovements}
                                    onCheckedChange={() => {
                                        animateMapMovements.set(
                                            !$animateMapMovements,
                                        );
                                    }}
                                />
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <label className="text-2xl font-semibold font-poppins">
                                    {t("optionDrawers.forcePastebin")}
                                </label>
                                <Checkbox
                                    checked={$alwaysUsePastebin}
                                    onCheckedChange={() =>
                                        alwaysUsePastebin.set(
                                            !$alwaysUsePastebin,
                                        )
                                    }
                                />
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <label className="text-2xl font-semibold font-poppins">
                                    {t("optionDrawers.enablePlanningMode")}
                                </label>
                                <Checkbox
                                    checked={$planningMode}
                                    onCheckedChange={() => {
                                        if ($planningMode === true) {
                                            const map = leafletMapContext.get();

                                            if (map) {
                                                map.eachLayer((layer: any) => {
                                                    if (
                                                        layer.questionKey ||
                                                        layer.questionKey === 0
                                                    ) {
                                                        map.removeLayer(layer);
                                                    }
                                                });
                                            }
                                        } else {
                                            questions.set([...questions.get()]); // I think that this should always be auto-saved
                                        }

                                        planningModeEnabled.set(!$planningMode);
                                    }}
                                />
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <label className="text-2xl font-semibold font-poppins">
                                    {t("optionDrawers.autoSave")}
                                </label>
                                <Checkbox
                                    checked={$autoSave}
                                    onCheckedChange={() =>
                                        autoSave.set(!$autoSave)
                                    }
                                />
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <label className="text-2xl font-semibold font-poppins">
                                    {t("optionDrawers.autoZoom")}
                                </label>
                                <Checkbox
                                    checked={$autoZoom}
                                    onCheckedChange={() =>
                                        autoZoom.set(!$autoZoom)
                                    }
                                />
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <label className="text-2xl font-semibold font-poppins">
                                    {t("optionDrawers.followMe")}
                                </label>
                                <Checkbox
                                    checked={$followMe}
                                    onCheckedChange={() =>
                                        followMe.set(!$followMe)
                                    }
                                />
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <label className="text-2xl font-semibold font-poppins">
                                    {t(
                                        "optionDrawers.defaultToCustomQuestions",
                                    )}
                                </label>
                                <Checkbox
                                    checked={$defaultCustomQuestions}
                                    onCheckedChange={() =>
                                        defaultCustomQuestions.set(
                                            !$defaultCustomQuestions,
                                        )
                                    }
                                />
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <label className="text-2xl font-semibold font-poppins">
                                    {t("optionDrawers.allowGooglePlusCodes")}
                                </label>
                                <Checkbox
                                    checked={$allowGooglePlusCodes}
                                    onCheckedChange={() =>
                                        allowGooglePlusCodes.set(
                                            !$allowGooglePlusCodes,
                                        )
                                    }
                                />
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <label className="text-2xl font-semibold font-poppins">
                                    {t("optionDrawers.hiderMode")}
                                </label>
                                <Checkbox
                                    checked={!!$hiderMode}
                                    onCheckedChange={() => {
                                        if ($hiderMode === false) {
                                            const $leafletMapContext =
                                                leafletMapContext.get();

                                            if ($leafletMapContext) {
                                                const center =
                                                    $leafletMapContext.getCenter();
                                                hiderMode.set({
                                                    latitude: center.lat,
                                                    longitude: center.lng,
                                                });
                                            } else {
                                                hiderMode.set({
                                                    latitude: 0,
                                                    longitude: 0,
                                                });
                                            }
                                        } else {
                                            hiderMode.set(false);
                                        }
                                    }}
                                />
                            </div>
                            {$hiderMode !== false && (
                                <SidebarMenu>
                                    <LatitudeLongitude
                                        latitude={$hiderMode.latitude}
                                        longitude={$hiderMode.longitude}
                                        inlineEdit
                                        onChange={(latitude, longitude) => {
                                            $hiderMode.latitude =
                                                latitude ?? $hiderMode.latitude;
                                            $hiderMode.longitude =
                                                longitude ??
                                                $hiderMode.longitude;

                                            if ($autoSave) {
                                                hiderMode.set({
                                                    ...$hiderMode,
                                                });
                                            } else {
                                                triggerLocalRefresh.set(
                                                    Math.random(),
                                                );
                                            }
                                        }}
                                        label={t("optionDrawers.hiderLocation")}
                                    />
                                    {!autoSave && (
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                className="bg-blue-600 p-2 rounded-md font-semibold font-poppins transition-shadow duration-500 mt-2"
                                                onClick={save}
                                            >
                                                {t("common.save")}
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )}
                                </SidebarMenu>
                            )}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};
