import type { ReactNode } from "react";

export interface TutorialStep {
    title: string;
    content: ReactNode;
    targetSelector?: string;
    position?: "top" | "bottom" | "center";
    isDescription?: boolean;
}
