import { GameData } from "@/constants/interfaces";
import { getGameSettings, parseGameDataJSON, replaceSpacesWithUnderscores } from "@/lib/utils";

export const getNewGame = async (): Promise<GameData | false> => {
    const gameSettings = getGameSettings();
    const params = new URLSearchParams({
        game_type: replaceSpacesWithUnderscores(gameSettings.gameMode),
        number_of_items: "10",
        game_duration: gameSettings.gameDuration.toString(), // in hours
    });

    const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/new-game?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
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
        let gameId = body["game_id"];
        let gameDateCreated = body["date_created"];
        let gameDuration = body["game_duration"]; // in hours
        const time = new Date(
            Date.parse(gameDateCreated) + gameDuration * 60 * 60 * 1000,
        );
        localStorage.setItem("expiryTime", time.toISOString());
        window.location.reload();
        console.warn("Game already in progress with ID:", gameId);
        return false;
    }

    console.log("Game started successfully:");
    return parseGameDataJSON(data.body);
};
