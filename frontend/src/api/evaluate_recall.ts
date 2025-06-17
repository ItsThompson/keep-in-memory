import { RecallResult } from "@/constants/interfaces";
import { parseRecallResultJSON } from "@/lib/utils";

export const evaluateRecall = async (
    recallList: string[],
    token: string | null,
): Promise<RecallResult[] | false | null> => {
    if (!token) {
        console.warn("No token found, redirecting to sign-in page.");
        return null;
    }

    const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/evaluate-recall",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                recall_list: recallList,
            }),
        },
    );

    if (response.status === 403 || response.status === 401) {
        console.warn("Token expired or invalid, redirecting to sign-in.");
        return null;
    }


    const data = await response.json();
    if (!response.ok) {
        console.error("Failed to evaluate recall:", data);
        return false;
    }
    if (data.statusCode === 400) {
        console.warn("No current game", data);
        return false;
    }

    if (data.statusCode === 500) {
        console.error("Server error:", data);
        return false;
    }

    console.log("Recall evaluation successful");
    return parseRecallResultJSON(data.body);
};
