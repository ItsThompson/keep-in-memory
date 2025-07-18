export const getTokenWithGoogle = async (
    googleToken: string,
): Promise<string | null> => {
    if (!googleToken) {
        console.error("No token provided");
        return null;
    }

    const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/issue-token",
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: googleToken }),
        },
    );

    if (!response.ok) {
        console.error("Failed to get token:", response.statusText);
        return null;
    }

    const data = await response.json();
    if (data.statusCode !== 200) {
        console.error("Error retrieving token:", data);
        return null;
    }

    const parsedData = JSON.parse(data.body);
    if (!parsedData.token) {
        console.error("Token not found in response data");
        return null;
    }

    return parsedData.token;
};

export const logout = async (): Promise<boolean> => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/logout", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        console.error("Logout failed:", response.statusText);
        return false;
    }

    const data = await response.json();

    if (data.statusCode !== 200) {
        console.warn("Logout failed.");
        return false;
    }

    console.log("Logout successful");
    return true;
};

export const refreshAccessToken = async (): Promise<string | null> => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/refresh`, {
        method: "POST",
        credentials: "include", // Include refresh token cookie
    });
    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }
    const data = await response.json();

    if(data.statusCode == 401) {
        console.warn("No refresh token found.");
        return null;
    }

    if (data.statusCode !== 200) {
        console.error("Error refreshing token:", data);
        return null;
    }
    const parsedData = JSON.parse(data.body);
    if (!parsedData.token) {
        console.warn("Token not found in response data");
        return null;
    }
    return parsedData.token;
};
