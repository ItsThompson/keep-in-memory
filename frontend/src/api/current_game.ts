import { FullGameData } from "@/constants/interfaces";

const parseFullGameDataJSON = (data: string): FullGameData => {
    try {
        const parsedData = JSON.parse(data);
        return {
            gameId: parsedData.ID,
            playerId: parsedData.player_id,
            dateCreated: new Date(Date.parse(parsedData.date_created)),
            gameDuration: parseInt(parsedData.game_duration),
            currentGame: parsedData.current_game,
            gameMode: parsedData.game_mode,
            gameType: parsedData.game_type,
            itemIds: parsedData.item_ids,
            recallResult: parsedData.recall_results?.map((result: any) => ({
                recalledItemName: result.name,
                classification: result.classification as string,
            })),
        };
    } catch (error) {
        console.error("Error parsing FullGameData JSON:", error);
        throw new Error("Invalid FullGameData format");
    }
};

export const getCurrentGame = async (
    testMode: boolean = false,
): Promise<FullGameData | false> => {
    if (testMode) {
        const data = {
            statusCode: 200,
            body: '{"game_type": "recall_all", "current_game": true, "item_ids": ["8", "12", "11", "10", "5", "7", "9", "2", "4", "6"], "game_duration": "24", "recall_results": [{"name": "trash", "classification": "true_positive"}, {"name": "carseat", "classification": "true_positive"}, {"name": "pencil", "classification": "true_positive"}, {"name": "cablecar", "classification": "true_positive"}, {"name": "tennisball", "classification": "true_positive"}, {"name": "envelope", "classification": "true_positive"}, {"name": "flag", "classification": "true_positive"}, {"name": "trophy", "classification": "true_positive"}, {"name": "sailboat", "classification": "true_positive"}, {"name": "car", "classification": "true_positive"}, {"name": "bicycle", "classification": "false_positive"}, {"name": "bell", "classification": "false_positive"}], "player_id": "5610d519-9f60-4746-a756-4bcbeb401b9d", "date_created": "2025-06-03T13:42:23.568460+00:00", "ID": "1269ae1f-f032-4392-9ba9-a21020e26b9a", "game_mode": "items"}',
        };

        console.log("Current game data retrieved");
        return parseFullGameDataJSON(data.body);
    }

    const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/get-current-game`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );

    const data = await response.json();

    if (!response.ok) {
        console.error("Failed to retrieve current game:", data);
        return false;
    }

    if (data.statusCode === 400) {
        console.warn("No current game");
        return false;
    }

    if (data.statusCode === 500) {
        console.error("Server error:", data);
        return false;
    }

    console.log("Current game data retrieved");
    console.log(data);
    return parseFullGameDataJSON(data.body);
};

export const removeCurrentGame = async (
    testMode: boolean = false,
): Promise<boolean> => {
    if (testMode) {
        console.log("Test mode: Current game removed");
        return true;
    }
    const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
            `/delete-current-game`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
    const data = await response.json();

    if (!response.ok) {
        console.error("Failed to remove current game:", data);
        return false;
    }

    if (data.statusCode === 400) {
        console.warn("No current game");
        return false;
    }

    if (data.statusCode === 200) {
        console.log("Current game removed successfully");
        return true;
    }

    console.error("Unexpected response when removing current game:", data);
    return false;
};
