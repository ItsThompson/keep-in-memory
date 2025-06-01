import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getGameSettings(): {
    gameMode: string;
    gameItemType: string;
    gameDuration: number;
} {
    try {
        const settings = localStorage.getItem("gameSettings");

        if (!settings) {
            return {
                gameMode: "remove one",
                gameItemType: "colors & shapes",
                gameDuration: 24,
            }; // Default to 24 hours if settings are missing
        }

        const parsedSettings = JSON.parse(settings);

        // Ensure gameDuration is a valid number, otherwise default to 24
        const gameDuration =
            typeof parsedSettings.gameDuration === "number" &&
            parsedSettings.gameDuration > 0
                ? parsedSettings.gameDuration
                : 24;

        return { ...parsedSettings, gameDuration };
    } catch (error) {
        console.error("Error parsing gameSettings from localStorage:", error);
        return {
            gameMode: "remove one",
            gameItemType: "colors & shapes",
            gameDuration: 24,
        };
    }
}

export function replaceSpacesWithUnderscores(str: string): string {
    return str.replace(/\s+/g, "_");
}
