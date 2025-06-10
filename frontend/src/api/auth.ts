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
