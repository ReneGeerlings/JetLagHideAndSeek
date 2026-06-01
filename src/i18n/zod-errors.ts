import type { Language } from "./index";

// Engelse bron-strings die in src/maps/schema.ts via .min()/.max() als
// custom message zijn ingebakken. We laten ze daar staan (conform CLAUDE.md)
// en vertalen hier op het moment dat een ZodError aan de gebruiker wordt
// getoond. Niet-matchende messages vallen terug op het Engelse origineel.
const ZOD_MESSAGE_TRANSLATIONS: Record<Language, Record<string, string>> = {
    en: {},
    nl: {
        "Latitude must not overlap with the poles":
            "Breedtegraad moet tussen -90 en 90 liggen",
        "Longitude must not overlap with the antemeridian":
            "Lengtegraad moet tussen -180 en 180 liggen",
    },
};

const translateZodMessage = (message: string, lang: Language): string =>
    ZOD_MESSAGE_TRANSLATIONS[lang]?.[message] ?? message;

type ZodIssueLike = { path?: (string | number)[]; message?: string };
type ZodErrorLike = { issues?: ZodIssueLike[]; errors?: ZodIssueLike[] };

const getIssues = (e: unknown): ZodIssueLike[] | null => {
    if (!e || typeof e !== "object") return null;
    const ze = e as ZodErrorLike;
    if (Array.isArray(ze.issues)) return ze.issues;
    if (Array.isArray(ze.errors)) return ze.errors;
    return null;
};

/**
 * Maakt van een (eventuele) ZodError een leesbare string in de gevraagde taal.
 * Voor andere fouttypes: gewoon String(e).
 */
export const formatZodError = (error: unknown, lang: Language): string => {
    const issues = getIssues(error);
    if (!issues || issues.length === 0) return String(error);
    return issues
        .map((issue) => {
            const msg = translateZodMessage(issue.message ?? "", lang);
            const path = (issue.path ?? []).join(".");
            return path ? `${path}: ${msg}` : msg;
        })
        .join("; ");
};
