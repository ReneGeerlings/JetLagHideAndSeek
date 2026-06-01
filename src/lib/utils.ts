import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import {
    PASTEBIN_API_POST_URL,
    PASTEBIN_API_RAW_URL,
    PASTEBIN_API_RAW_URL_PROXIED,
} from "@/maps/api/constants";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Punt 2: question keys waren `Math.random()`, wat met snel-achter-elkaar
 * toevoegen of bij share/import-merge een (kleine) collision-kans heeft.
 * Deze helper kombineert ms-tijd met een sub-ms-teller voor monotoon
 * stijgende en (binnen dezelfde browsersessie) gegarandeerd unieke keys.
 * Blijft een `number` zodat het bestaande schema en oude state werken;
 * oude `Math.random`-keys liggen in [0,1) en kunnen dus niet collisen
 * met deze tijd-gebaseerde keys (ms-tijd > 1e12).
 */
let _lastKeyTime = 0;
let _lastKeyCounter = 0;
export function nextQuestionKey(): number {
    const now = Date.now();
    if (now === _lastKeyTime) {
        _lastKeyCounter = (_lastKeyCounter + 1) % 1000;
    } else {
        _lastKeyTime = now;
        _lastKeyCounter = 0;
    }
    return now * 1000 + _lastKeyCounter;
}

/**
 * Formatteer een km²-waarde compact voor in de zijbalk. Kleine waarden
 * (<10 km²) krijgen één decimaal, grotere worden afgerond, en boven de
 * duizend wordt naar "k" geschaald.
 */
export function formatKm2(km2: number): string {
    if (!Number.isFinite(km2)) return "0";
    if (km2 < 10) return km2.toFixed(1);
    if (km2 < 1000) return Math.round(km2).toString();
    return (km2 / 1000).toFixed(1) + "k";
}

export const mapToObj = <T, K extends string, V>(
    arr: T[],
    fn: (item: T) => [K, V],
) => Object.fromEntries(arr.map(fn));

export const compress = async (
    str: string,
    encoding = "deflate" as CompressionFormat,
): Promise<string> => {
    const byteArray = new TextEncoder().encode(str);
    const cs = new CompressionStream(encoding);
    const writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    const arrayBuffer = await new Response(cs.readable).arrayBuffer();

    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
};

export const decompress = async (
    base64String: string,
    encoding = "deflate" as CompressionFormat,
): Promise<string> => {
    const regularBase64 = base64String.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 =
        regularBase64 + "=".repeat((4 - (regularBase64.length % 4)) % 4);

    const binaryString = atob(paddedBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    const cs = new DecompressionStream(encoding);
    const writer = cs.writable.getWriter();
    writer.write(bytes);
    writer.close();
    const arrayBuffer = await new Response(cs.readable).arrayBuffer();
    return new TextDecoder().decode(arrayBuffer);
};

export async function uploadToPastebin(
    apiKey: string,
    data: string,
): Promise<string> {
    const formData = new FormData();
    formData.append("api_option", "paste");
    formData.append("api_dev_key", apiKey);
    formData.append("api_paste_code", data);
    formData.append("api_paste_private", "1"); // 1 for unlisted
    formData.append("api_paste_expire_date", "N"); // N for never

    const response = await fetch(PASTEBIN_API_POST_URL, {
        method: "POST",
        body: formData,
    });

    const responseText = await response.text();
    if (!response.ok || responseText.startsWith("Bad API request,")) {
        throw new Error("Pastebin API error: " + responseText);
    }

    return responseText;
}

export async function fetchFromPastebin(pasteId: string): Promise<string> {
    let response;
    try {
        // prefer querying Pastebin directly since CORS proxy is unreliable
        response = await fetch(PASTEBIN_API_RAW_URL + pasteId);
    } catch {
        // CORS error; happens if the paste is not owned by a Pastebin Pro user
        response = await fetch(PASTEBIN_API_RAW_URL_PROXIED + pasteId);
    }

    if (!response.ok) {
        throw new Error(
            "Failed to fetch from Pastebin: " + response.statusText,
        );
    }

    return response.text();
}

/**
 * Open native share sheet or fallback to sending to clipboard
 * @param url URL to share
 * @param forceClipboard Whether to force usage of the clipboard (instead of share sheet)
 * @returns `true` for native success, `false` for both native and fallback failure and `"clipboard"` for clipboard success
 */
export async function shareOrFallback(
    url: string,
    forceClipboard = false,
): Promise<boolean | "clipboard"> {
    if (forceClipboard) {
        if (!navigator || !navigator.clipboard) {
            // Clipboard not supported
            return false;
        }

        navigator.clipboard.writeText(url);
        return "clipboard";
    }

    if (!navigator.share) return shareOrFallback(url, true); // Fallback to clipboard

    return await navigator
        .share({ url })
        .then(() => true)
        .catch(() => {
            // Try again with clipboard
            return shareOrFallback(url, true);
        });
}
