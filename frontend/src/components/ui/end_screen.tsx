import {
    GameArenaComponents,
    GameData,
    RecallResult,
    ResultClassification,
} from "@/constants/interfaces";
import ArenaTabs from "./arena_tabs";
import { useEffect, useMemo, useState } from "react";
import Board from "./board";

export default function EndScreen(
    recallResults: RecallResult[],
): GameArenaComponents {
    const defaultTabIndex = 0;
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
        // TODO: actually fetch from API
        const data = await new Promise<{ body: string; statusCode: number }>(
            (resolve) => {
                setTimeout(() => {
                    console.log("Fetching current game data...foobar");
                    resolve({
                        body: '{"game_id": "2e865633-4d22-4b3d-ae0b-7ab081710323", "items": [{"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/pencil.png", "ID": "10", "names": ["pencil"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/carseat.png", "ID": "7", "names": ["carseat"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/tennisball.png", "ID": "5", "names": ["tennisball"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/bicycle.png", "ID": "3", "names": ["bicycle"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/flag.png", "ID": "11", "names": ["flag"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/car.png", "ID": "2", "names": ["car"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/cablecar.png", "ID": "4", "names": ["cablecar"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/trash.png", "ID": "9", "names": ["trash"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/trophy.png", "ID": "12", "names": ["trophy"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/sailboat.png", "ID": "8", "names": ["sailboat"]}]}',
                        statusCode: 200,
                    });
                }, 1000);
            },
        );

        const parsed = JSON.parse(data.body);
        const currentGameData: GameData = {
            gameId: parsed.game_id,
            items: parsed.items.map((item: any) => ({
                id: item.ID,
                objectUrl: item.object_url,
                names: item.names,
            })),
        };
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
