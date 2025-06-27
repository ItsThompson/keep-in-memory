import { UserStats } from "@/constants/interfaces";
import { refreshAccessToken } from "./auth";
import { googleLogout } from "@react-oauth/google";
import { parseUserStatsJSON } from "@/lib/utils";

export const getUserStats = async (
    token: string | null,
    setToken: (token: string | null) => void,
    withNewAccessToken: boolean = false,
): Promise<UserStats | null | false> => {
    /* Return Values
     * null: when token is missing or irrecoverable
     * false: when the request fails or there's no current game
     * UserStats if successful
     */
    if (!token) {
        console.warn("No token found, redirecting to sign-in page.");
        return null;
    }

    const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/user-stats`, // TODO: Implement the actual API route in backend to fetch user stats
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
        return getUserStats(newAccessToken, setToken, true);
    }

    const data = await response.json();

    if (!response.ok) {
        console.error("Failed to retrieve user stats:", data);
        return false;
    }

    if (data.statusCode !== 200) {
        console.warn("No non-sensitive user stats available");
        console.log(data);
        return false;
    }

    console.log("Non-sensitive user stats retrieved successfully");
    return parseUserStatsJSON(data.body);
};
