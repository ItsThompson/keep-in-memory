import { RecallResult } from "@/constants/interfaces";
import { parseRecallResultJSON } from "@/lib/utils";


export const evaluateRecall = async (
    recallList: string[],
): Promise<RecallResult[] | false> => {

    const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/evaluate-recall",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                recall_list: recallList,
            }),
        },
    );

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
