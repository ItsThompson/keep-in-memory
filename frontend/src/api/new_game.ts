import { GameData } from "@/constants/interfaces";
import { getGameSettings, parseGameDataJSON } from "@/lib/utils";
import { refreshAccessToken } from "./auth";
import { googleLogout } from "@react-oauth/google";

export const getNewGame = async (
    token: string | null,
    setToken: (token: string | null) => void,
    withNewAccessToken: boolean = false,
): Promise<GameData | false | null> => {
    if (!token) {
        console.warn("No token found, redirecting to sign-in page.");
        return null;
    }

    const gameSettings = getGameSettings();
    const params = new URLSearchParams({
        game_type: "recall_all",
        number_of_items: gameSettings.itemCount.toString(),
        game_duration: gameSettings.gameDuration.toString(), // in hours
    });

    const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/new-game?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (response.status === 403 || response.status === 401) {
        if (withNewAccessToken) {
            console.warn("Token expired or invalid, redirecting to sign-in.");
            return null;
        }

        const newAccessToken = await refreshAccessToken();
        if (!newAccessToken) {
            console.warn("Token refresh failed, redirecting to sign-in.");
            setToken(null);
            googleLogout();
            return null;
        }

        setToken(newAccessToken);
        return getNewGame(newAccessToken, setToken, true);
    }

    const data = await response.json();
    if (!response.ok) {
        console.error("Failed to start game:", data);
        return false;
    }

    if (data.statusCode == 500) {
        console.error(data);
        return false;
    }

    if (data.statusCode == 409) {
        const body = JSON.parse(data.body);
        const gameId = body["game_id"];
        const gameDateCreated = body["date_created"];
        const gameDuration = body["game_duration"]; // in hours
        const time = new Date(
            Date.parse(gameDateCreated) + gameDuration * 1000,
        );
        localStorage.setItem("expiryTime", time.toISOString());
        window.location.reload();
        console.warn("Game already in progress with ID:", gameId);
        return false;
    }

    console.log("Game started successfully:");
    return parseGameDataJSON(data.body);
};
