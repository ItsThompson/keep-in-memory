import { GameData } from "@/constants/interfaces";
import { parseGameDataJSON } from "@/lib/utils";


export const getCurrentGame = async (): Promise<GameData | false> => {
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
    return parseGameDataJSON(data.body);
};

export const removeCurrentGame = async (): Promise<boolean> => {
    const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/delete-current-game`,
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
