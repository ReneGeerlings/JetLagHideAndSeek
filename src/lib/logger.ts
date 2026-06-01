// Minimal logger. In productie (Vite zet import.meta.env.PROD = true bij
// `pnpm build`) zijn alle aanroepen no-ops; tijdens `pnpm dev` werken ze
// als normale console-aanroepen. Vervangt directe console.log/warn/error.

const isDev = import.meta.env.DEV;

type LogArgs = Parameters<typeof console.log>;

export const logger = {
    log: (...args: LogArgs) => {
        if (isDev) console.log(...args);
    },
    warn: (...args: LogArgs) => {
        if (isDev) console.warn(...args);
    },
    error: (...args: LogArgs) => {
        if (isDev) console.error(...args);
    },
};
