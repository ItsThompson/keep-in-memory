import {
    GameArenaComponents,
    GameData,
    RecallResult,
    ResultClassification,
} from "@/constants/interfaces";
import ArenaTabs from "./arena_tabs";
import { useEffect, useMemo, useState } from "react";
import Board from "./board";
import { getCurrentGame } from "@/api/current_game";
import { useAuth } from "../authContext";
import { redirect } from "next/navigation";

export default function EndScreen(
    recallResults: RecallResult[],
): GameArenaComponents {
    const defaultTabIndex = 0;
    const { token, setToken } = useAuth();
    const [tabIndex, setTabIndex] = useState(defaultTabIndex);
    const [gameData, setGameData] = useState<GameData | null>(null);
    const {
        truePositives,
        falsePositives,
        falseNegatives,
        accuracy,
        precision,
        recall,
    } = useMemo(() => {
        let TP = 0,
            FP = 0,
            FN = 0;

        recallResults.forEach((result) => {
            if (result.classification === ResultClassification.TRUE_POSITIVE) {
                TP++;
            } else if (
                result.classification === ResultClassification.FALSE_POSITIVE
            ) {
                FP++;
            } else if (
                result.classification === ResultClassification.FALSE_NEGATIVE
            ) {
                FN++;
            }
        });

        const accuracy =
            TP + FP + FN > 0
                ? Math.round((TP / (TP + FP + FN)) * 10000) / 100
                : 0;
        const precision =
            TP + FP > 0 ? Math.round((TP / (TP + FP)) * 10000) / 100 : 0;
        const recall =
            TP + FN > 0 ? Math.round((TP / (TP + FN)) * 10000) / 100 : 0;

        return {
            truePositives: TP,
            falsePositives: FP,
            falseNegatives: FN,
            accuracy,
            precision,
            recall,
        };
    }, [recallResults]);

    async function fetchCurrentGameData() {
        const currentGameData: GameData | boolean | null =
            await getCurrentGame(token, setToken);
        if (currentGameData === null) {
            redirect("/sign-in");
        }

        if (currentGameData === false) {
            return;
        }
        setGameData(currentGameData);
    }

    useEffect(() => {
        fetchCurrentGameData();
    }, []);

    return {
        aboveBoard: (
            <ArenaTabs
                items={["board", "recall list"]}
                defaultSelectedIndex={defaultTabIndex}
                updatedTabIndex={(i) => {
                    setTabIndex(i);
                }}
            />
        ),
        gameBoard: (
            <div className="h-full w-full">
                {tabIndex === 0 ? (
                    gameData ? (
                        <Board gameData={gameData} />
                    ) : (
                        <div className="h-full flex justify-center items-center">
                            <p>Loading Game Board</p>
                        </div>
                    )
                ) : (
                    <div className="w-full h-full overflow-auto">
                        <div className="flex flex-col m-2 p-2 rounded bg-primary text-secondary">
                            <p className="font-bold text-lg">Recall Results</p>
                            <div className="grid grid-cols-2 gap-4 w-full mt-2">
                                <ul className="space-y-1">
                                    <li>
                                        <span className="font-bold">
                                            Accuracy
                                        </span>
                                        : {accuracy}% ({truePositives}/
                                        {truePositives +
                                            falsePositives +
                                            falseNegatives}
                                        )
                                    </li>
                                    <li>
                                        <span className="font-bold">
                                            Precision
                                        </span>
                                        : {precision}% ({truePositives}/
                                        {truePositives + falsePositives})
                                    </li>
                                    <li>
                                        <span className="font-bold">
                                            Recall
                                        </span>
                                        : {recall}% ({truePositives}/
                                        {truePositives + falseNegatives})
                                    </li>
                                </ul>
                                <ul className="space-y-1">
                                    <li>
                                        <span className="font-bold">
                                            Correctly Retrieved Items (TP)
                                        </span>
                                        : {truePositives}
                                    </li>
                                    <li>
                                        <span className="font-bold">
                                            Incorrectly Retrieved Items (FP)
                                        </span>
                                        : {falsePositives}
                                    </li>
                                    <li>
                                        <span className="font-bold">
                                            Missing Items (FN)
                                        </span>
                                        : {falseNegatives}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {recallResults.length > 0 && (
                            <ul className="my-2 mx-6 flex flex-col space-y-2">
                                {recallResults.map((item, index) => (
                                    <li
                                        key={index}
                                        className="p-2 rounded bg-white text-black flex justify-between items-center"
                                    >
                                        <span>{item.recalledItemName}</span>
                                        {item.classification ==
                                        ResultClassification.TRUE_POSITIVE ? (
                                            <span className="text-green-600 font-bold">
                                                ✔️
                                            </span>
                                        ) : (
                                            <span className="text-red-600 font-bold">
                                                ❌
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        ),
    };
}
