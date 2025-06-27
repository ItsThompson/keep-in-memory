import {
    GameData,
    NonSensitiveUserInfo,
    RecallResult,
    UserStats,
} from "@/constants/interfaces";
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

export function parseUserStatsJSON(body: string): UserStats {
    try {
        const parsedJson = JSON.parse(body);
        return {
            totalGamesPlayed: parsedJson.total_games_played,
            averageAccuracy: parseFloat(parsedJson.average_accuracy),
            averagePrecision: parseFloat(parsedJson.average_precision),
            averageRecall: parseFloat(parsedJson.average_recall),
        };
    } catch (error) {
        console.error("Error parsing UserStats JSON:", error);
        throw new Error("Invalid UserStats format");
    }
}

export function parseNonSensitiveUserInfoJSON(
    body: string,
): NonSensitiveUserInfo {
    try {
        const parsedJson = JSON.parse(body);
        return {
            email: parsedJson.email,
            name: parsedJson.name,
            picture: parsedJson.picture,
        };
    } catch (error) {
        console.error("Error parsing NonSensitiveUserInfo JSON:", error);
        throw new Error("Invalid NonSensitiveUserInfo format");
    }
}

export function parseGameDataJSON(body: string): GameData {
    try {
        const parsedJson = JSON.parse(body);
        return {
            gameId: parsedJson.ID,
            playerId: parsedJson.player_id,
            dateCreated: new Date(Date.parse(parsedJson.date_created)),
            gameDuration: parseInt(parsedJson.game_duration),
            currentGame: parsedJson.current_game,
            gameMode: parsedJson.game_mode,
            gameType: parsedJson.game_type,
            items: parsedJson.items.map(
                (item: {
                    object_url: string;
                    ID: number;
                    names: string[];
                }) => ({
                    objectUrl: item.object_url,
                    id: item.ID,
                    names: item.names,
                }),
            ),
            recallResult: parsedJson.recall_results?.map(
                (result: { name: string; classification: string }) => ({
                    recalledItemName: result.name,
                    classification: result.classification as string,
                }),
            ),
        };
    } catch (error) {
        console.error("Error parsing GameData JSON:", error);
        throw new Error("Invalid GameData format");
    }
}

export function parseRecallResultJSON(body: string): RecallResult[] {
    try {
        const parsedJson = JSON.parse(body);
        return parsedJson.recall_results.map(
            (result: { name: string; classification: string }) => ({
                recalledItemName: result.name,
                classification: result.classification as string,
            }),
        );
    } catch (error) {
        console.error("Error parsing RecallResult JSON:", error);
        throw new Error("Invalid RecallResult format");
    }
}
