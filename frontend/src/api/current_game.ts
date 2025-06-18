import { GameData } from "@/constants/interfaces";
import { parseGameDataJSON } from "@/lib/utils";
import { refreshAccessToken } from "./auth";
import { googleLogout } from "@react-oauth/google";

export const getCurrentGame = async (
    token: string | null,
    setToken: (token: string | null) => void,
    withNewAccessToken: boolean = false,
): Promise<GameData | null | false> => {
    /* Return Values
    * null: when token is missing or irrecoverable
    * false: when the request fails or there's no current game
    * GameData if successful
    */

    if (!token) {
        console.warn("No token found, redirecting to sign-in page.");
        return null;
    }

    const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/get-current-game`,
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
        return getCurrentGame(newAccessToken, setToken, true);
    }

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
    return parseGameDataJSON(data.body);
};

export const removeCurrentGame = async (
    token: string | null,
    setToken: (token: string | null) => void,
    withNewAccessToken: boolean = false,
): Promise<boolean | null> => {
    if (!token) {
        console.warn("No token found, redirecting to sign-in page.");
        return null;
    }

    const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/delete-current-game`,
        {
            method: "DELETE",
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
        return removeCurrentGame(newAccessToken, setToken, true);
    }

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
