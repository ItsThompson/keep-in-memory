import { NonSensitiveUserInfo } from "@/constants/interfaces";
import { refreshAccessToken } from "./auth";
import { googleLogout } from "@react-oauth/google";
import { parseNonSensitiveUserInfoJSON } from "@/lib/utils";

export const getNonSensitiveUserInfo = async (
    token: string | null,
    setToken: (token: string | null) => void,
    withNewAccessToken: boolean = false,
): Promise<NonSensitiveUserInfo | null | false> => {
    /* Return Values
     * null: when token is missing or irrecoverable
     * false: when the request fails or there's no current game
     * NonSensitiveUserInfo if successful
     */

    if (!token) {
        console.warn("No token found, redirecting to sign-in page.");
        return null;
    }

    const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + `/non-sensitive-user-info`,
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
        return getNonSensitiveUserInfo(newAccessToken, setToken, true);
    }

    const data = await response.json();

    if (!response.ok) {
        console.error("Failed to retrieve non-sensitive user info:", data);
        return false;
    }

    if (data.statusCode !== 200) {
        console.warn("No non-sensitive user info available");
        return false;
    }

    console.log("Non-sensitive user info retrieved successfully");
    return parseNonSensitiveUserInfoJSON(data.body);
};
