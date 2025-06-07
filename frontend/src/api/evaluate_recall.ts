import { RecallResult } from "@/constants/interfaces";

const parseRecallResultJSON = (data: string): RecallResult[] => {
    try {
        const parsedData = JSON.parse(data);
        return parsedData.recall_results.map((result: any) => ({
            recalledItemName: result.name,
            classification: result.classification as string,
        }));
    } catch (error) {
        console.error("Error parsing RecallResult JSON:", error);
        throw new Error("Invalid RecallResult format");
    }
};

export const evaluateRecall = async (
    recallList: string[],
    testMode: boolean = false,
): Promise<RecallResult[] | false> => {
    if (testMode) {
        const data = {
            body: '{\"game_id\": \"1269ae1f-f032-4392-9ba9-a21020e26b9a\", \"recall_results\": [{\"name\": \"trash\", \"classification\": \"true_positive\"}, {\"name\": \"carseat\", \"classification\": \"true_positive\"}, {\"name\": \"pencil\", \"classification\": \"true_positive\"}, {\"name\": \"cablecar\", \"classification\": \"true_positive\"}, {\"name\": \"tennisball\", \"classification\": \"true_positive\"}, {\"name\": \"envelope\", \"classification\": \"true_positive\"}, {\"name\": \"flag\", \"classification\": \"true_positive\"}, {\"name\": \"trophy\", \"classification\": \"true_positive\"}, {\"name\": \"sailboat\", \"classification\": \"true_positive\"}, {\"name\": \"car\", \"classification\": \"true_positive\"}, {\"name\": \"bicycle\", \"classification\": \"false_positive\"}, {\"name\": \"bell\", \"classification\": \"false_positive\"}]}',
            statusCode: 200,
        };

        console.log("Recall evaluation successful");
        return parseRecallResultJSON(data.body);
    }

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
