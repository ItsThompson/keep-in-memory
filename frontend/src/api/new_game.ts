import { GameData } from "@/constants/interfaces";
import { getGameSettings, replaceSpacesWithUnderscores } from "@/lib/utils";

const parseGameDataJSON = (data: string): GameData => {
    try {
        const parsedData = JSON.parse(data);
        return {
            gameId: parsedData.game_id,
            items: parsedData.items.map((item: any) => ({
                objectUrl: item.object_url,
                id: item.ID,
                names: item.names,
            })),
        };
    } catch (error) {
        console.error("Error parsing GameData JSON:", error);
        throw new Error("Invalid GameData format");
    }
};

export const getNewGame = async (
    testMode: boolean = false,
): Promise<GameData | false> => {
    if (testMode) {
        const data = {
            body: '{"game_id": "2e865633-4d22-4b3d-ae0b-7ab081710323", "items": [{"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/pencil.png", "ID": "10", "names": ["pencil"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/carseat.png", "ID": "7", "names": ["carseat"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/tennisball.png", "ID": "5", "names": ["tennisball"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/bicycle.png", "ID": "3", "names": ["bicycle"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/flag.png", "ID": "11", "names": ["flag"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/car.png", "ID": "2", "names": ["car"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/cablecar.png", "ID": "4", "names": ["cablecar"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/trash.png", "ID": "9", "names": ["trash"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/trophy.png", "ID": "12", "names": ["trophy"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/sailboat.png", "ID": "8", "names": ["sailboat"]}]}',
            statusCode: 200,
        };

        console.log("Game started successfully:");
        return parseGameDataJSON(data.body);
    }

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
                "Content-Type": "application/json",
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
