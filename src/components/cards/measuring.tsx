import { useStore } from "@nanostores/react";
import { Label } from "@radix-ui/react-label";
import * as React from "react";

import CustomInitDialog from "@/components/CustomInitDialog";
import { LatitudeLongitude } from "@/components/LatLngPicker";
import PresetsDialog from "@/components/PresetsDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import {
    MENU_ITEM_CLASSNAME,
    SidebarMenuItem,
} from "@/components/ui/sidebar-l";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslation } from "@/i18n";
import { useSchemaDescription } from "@/i18n/schema";
import {
    customInitPreference,
    displayHidingZones,
    drawingQuestionKey,
    hiderMode,
    isLoading,
    questionModified,
    questions,
    triggerLocalRefresh,
} from "@/lib/context";
import { cn } from "@/lib/utils";
import { determineMeasuringBoundary } from "@/maps/questions/measuring";
import {
    determineUnionizedStrings,
    type MeasuringQuestion,
    measuringQuestionSchema,
    NO_GROUP,
} from "@/maps/schema";

import { QuestionCard } from "./base";

export const MeasuringQuestionComponent = ({
    data,
    questionKey,
    sub,
    className,
}: {
    data: MeasuringQuestion;
    questionKey: number;
    sub?: string;
    className?: string;
}) => {
    const t = useTranslation();
    const td = useSchemaDescription();
    useStore(triggerLocalRefresh);
    const $hiderMode = useStore(hiderMode);
    const $questions = useStore(questions);
    const $displayHidingZones = useStore(displayHidingZones);
    const $drawingQuestionKey = useStore(drawingQuestionKey);
    const $isLoading = useStore(isLoading);
    const $customInitPref = useStore(customInitPreference);
    const [customDialogOpen, setCustomDialogOpen] = React.useState(false);
    const label = `${t("cards.measuring.labelPrefix")}
    ${
        $questions
            .filter((q) => q.id === "measuring")
            .map((q) => q.key)
            .indexOf(questionKey) + 1
    }`;

    let questionSpecific = <></>;

    switch (data.type) {
        case "mcdonalds":
        case "seven11":
            questionSpecific = (
                <span className="px-2 text-center text-orange-500">
                    {t("cards.measuring.chainNote")}
                </span>
            );
            break;
        case "aquarium":
        case "hospital":
        case "peak":
        case "museum":
        case "theme_park":
        case "zoo":
        case "cinema":
        case "library":
        case "golf_course":
        case "consulate":
        case "park":
            questionSpecific = (
                <span className="px-2 text-center text-orange-500">
                    {t("cards.measuring.poiHidingZoneNote")}
                </span>
            );
            break;
        case "custom-measure":
            if (data.drag) {
                questionSpecific = (
                    <>
                        <p className="px-2 mb-1 text-center text-orange-500">
                            {t("cards.measuring.modifyEnable")}
                            <Checkbox
                                className="mx-1 my-1"
                                checked={$drawingQuestionKey === questionKey}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        drawingQuestionKey.set(questionKey);
                                    } else {
                                        drawingQuestionKey.set(-1);
                                    }
                                }}
                                disabled={!data.drag || $isLoading}
                            />
                            {t("cards.measuring.modifyButtons")}
                        </p>
                        <div className="flex justify-center mb-2">
                            <PresetsDialog
                                data={data}
                                presetTypeHint={data.type}
                            />
                        </div>
                    </>
                );
            }
            break;
    }

    return (
        <QuestionCard
            questionKey={questionKey}
            label={label}
            sub={sub}
            className={className}
            collapsed={data.collapsed}
            setCollapsed={(collapsed) => {
                data.collapsed = collapsed; // Doesn't trigger a re-render so no need for questionModified
            }}
            locked={!data.drag}
            setLocked={(locked) => questionModified((data.drag = !locked))}
        >
            <CustomInitDialog
                open={customDialogOpen}
                onOpenChange={setCustomDialogOpen}
                onBlank={async () => {
                    if (!(data as any).geo) {
                        (data as any).geo = {
                            type: "FeatureCollection",
                            features: [],
                        };
                    } else {
                        (data as any).geo.features = [];
                    }
                    data.type = "custom-measure";
                    questionModified();
                    setCustomDialogOpen(false);
                }}
                onPrefill={async () => {
                    const boundary = await determineMeasuringBoundary(data);
                    if (!(data as any).geo) {
                        (data as any).geo = {
                            type: "FeatureCollection",
                            features: [],
                        };
                    }
                    (data as any).geo.features = boundary ? boundary : [];
                    data.type = "custom-measure";
                    questionModified();
                    setCustomDialogOpen(false);
                }}
            />
            <SidebarMenuItem className={MENU_ITEM_CLASSNAME}>
                <Select
                    trigger={t("cards.measuring.measuringTypeTrigger")}
                    options={Object.fromEntries(
                        measuringQuestionSchema.options
                            .filter((x) => x.description === NO_GROUP)
                            .flatMap((x) =>
                                determineUnionizedStrings(x.shape.type),
                            )
                            .map((x) => [
                                (x._def as any).value,
                                td(x.description ?? ""),
                            ]),
                    )}
                    groups={measuringQuestionSchema.options
                        .filter((x) => x.description !== NO_GROUP)
                        .map((x) => [
                            td(x.description ?? ""),
                            Object.fromEntries(
                                determineUnionizedStrings(x.shape.type).map(
                                    (x) => [
                                        (x._def as any).value,
                                        td(x.description ?? ""),
                                    ],
                                ),
                            ),
                        ])
                        .reduce(
                            (acc, [key, value]) => {
                                const values = {
                                    disabled: !$displayHidingZones,
                                    options: value,
                                };

                                if (acc[key]) {
                                    acc[key].options = {
                                        ...acc[key].options,
                                        ...value,
                                    };
                                } else {
                                    acc[key] = values;
                                }

                                return acc;
                            },
                            {} as Record<
                                string,
                                {
                                    disabled: boolean;
                                    options: Record<string, string>;
                                }
                            >,
                        )}
                    value={data.type}
                    onValueChange={async (value) => {
                        if (value === "custom-measure") {
                            if ($customInitPref === "ask") {
                                setCustomDialogOpen(true);
                                return;
                            }
                            if ($customInitPref === "blank") {
                                if (!(data as any).geo) {
                                    (data as any).geo = {
                                        type: "FeatureCollection",
                                        features: [],
                                    };
                                } else {
                                    (data as any).geo.features = [];
                                }
                            } else if ($customInitPref === "prefill") {
                                const boundary =
                                    await determineMeasuringBoundary(data);
                                if (!(data as any).geo) {
                                    (data as any).geo = {
                                        type: "FeatureCollection",
                                        features: [],
                                    };
                                }
                                (data as any).geo.features = boundary
                                    ? boundary
                                    : [];
                            }
                            data.type = value;
                            questionModified();
                            return;
                        }
                        data.type = value;
                        questionModified();
                    }}
                    disabled={!data.drag || $isLoading}
                />
            </SidebarMenuItem>
            {questionSpecific}
            <LatitudeLongitude
                latitude={data.lat}
                longitude={data.lng}
                colorName={data.color}
                onChange={(lat, lng) => {
                    if (lat !== null) {
                        data.lat = lat;
                    }
                    if (lng !== null) {
                        data.lng = lng;
                    }
                    questionModified();
                }}
                disabled={!data.drag || $isLoading}
            />
            <div className="flex gap-2 items-center p-2">
                <Label
                    className={cn(
                        "font-semibold text-lg",
                        $isLoading && "text-muted-foreground",
                    )}
                >
                    {t("cards.common.result")}
                </Label>
                <ToggleGroup
                    className="grow"
                    type="single"
                    value={data.hiderCloser ? "closer" : "further"}
                    onValueChange={(value: "closer" | "further") =>
                        questionModified(
                            (data.hiderCloser = value === "closer"),
                        )
                    }
                    disabled={!!$hiderMode || !data.drag || $isLoading}
                >
                    <ToggleGroupItem value="further">
                        {t("cards.measuring.hiderFurther")}
                    </ToggleGroupItem>
                    <ToggleGroupItem value="closer">
                        {t("cards.measuring.hiderCloser")}
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        </QuestionCard>
    );
};
