import { persistentAtom } from "@nanostores/persistent";
import { useStore } from "@nanostores/react";

import { en, type Translations } from "./en";
import { nl } from "./nl";

export type Language = "en" | "nl";

export const SUPPORTED_LANGUAGES: { code: Language; label: string }[] = [
    { code: "en", label: "English" },
    { code: "nl", label: "Nederlands" },
];

const dictionaries: Record<Language, Translations> = { en, nl };

export const language = persistentAtom<Language>("language", "nl");

if (typeof window !== "undefined") {
    const MIGRATION_KEY = "defaultLanguageMigration";
    if (localStorage.getItem(MIGRATION_KEY) !== "nl-v1") {
        if (language.get() === "en") {
            language.set("nl");
        }
        localStorage.setItem(MIGRATION_KEY, "nl-v1");
    }
}

type Join<K, P> = K extends string
    ? P extends string
        ? `${K}.${P}`
        : never
    : never;

type Leaves<T> = T extends string
    ? never
    : {
          [K in keyof T]: T[K] extends string ? K : Join<K, Leaves<T[K]>>;
      }[keyof T];

export type TranslationKey = Leaves<Translations>;

function lookup(dict: unknown, path: string): string | undefined {
    const value = path
        .split(".")
        .reduce<unknown>(
            (acc, segment) =>
                acc && typeof acc === "object"
                    ? (acc as Record<string, unknown>)[segment]
                    : undefined,
            dict,
        );
    return typeof value === "string" ? value : undefined;
}

function interpolate(
    template: string,
    vars?: Record<string, string | number>,
): string {
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (_, key) =>
        key in vars ? String(vars[key]) : `{${key}}`,
    );
}

export function translate(
    lang: Language,
    key: TranslationKey,
    vars?: Record<string, string | number>,
): string {
    const value =
        lookup(dictionaries[lang], key) ?? lookup(dictionaries.en, key);
    return interpolate(value ?? key, vars);
}

/**
 * Korte non-React helper: vertaalt met de huidige actieve taal. Bedoeld voor
 * losse modules zoals `src/maps/api/overpass.ts` die geen React-hook kunnen
 * gebruiken. In React-componenten blijf `useTranslation()` gebruiken zodat
 * de UI automatisch mee-rendert bij een taalwissel.
 */
export function tt(
    key: TranslationKey,
    vars?: Record<string, string | number>,
): string {
    return translate(language.get(), key, vars);
}

export function useTranslation() {
    const lang = useStore(language);
    return (
        key: TranslationKey,
        vars?: Record<string, string | number>,
    ): string => translate(lang, key, vars);
}
