import { useStore } from "@nanostores/react";

import {
    type Language,
    language,
    SUPPORTED_LANGUAGES,
    useTranslation,
} from "@/i18n";

import { Label } from "./ui/label";
import { Select } from "./ui/select";

export const LanguageSwitcher = () => {
    const t = useTranslation();
    const $language = useStore(language);

    const options = Object.fromEntries(
        SUPPORTED_LANGUAGES.map(({ code, label }) => [code, label]),
    ) as Record<Language, string>;

    return (
        <div className="flex flex-col items-center gap-2">
            <Label>{t("languageSwitcher.label")}</Label>
            <Select
                trigger={t("languageSwitcher.label")}
                options={options}
                value={$language}
                onValueChange={(v) => language.set(v as Language)}
            />
        </div>
    );
};
