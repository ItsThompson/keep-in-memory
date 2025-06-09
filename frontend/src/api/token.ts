export const addTokenToLocalStorage = async (
    token: string,
): Promise<boolean> => {
    if (!token) {
        console.error("No token provided");
        return false;
    }

    const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/issue-token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ token: token }),
        },
    );

    if (!response.ok) {
        console.error("Failed to get token:", response.statusText);
        return false;
    }

    const data = await response.json();
    if (data.statusCode !== 200) {
        console.error("Error retrieving token:", data);
        return false;
    }

    const parsedData = JSON.parse(data.body);
    if (!parsedData.token) {
        console.error("Token not found in response data");
        return false;
    }

    localStorage.setItem("token", parsedData.token);
    return true;
};
