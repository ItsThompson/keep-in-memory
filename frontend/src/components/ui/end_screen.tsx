import { GameArenaComponents, GameData } from "@/constants/game_states";
import ArenaTabs from "./arena_tabs";
import { useEffect, useState } from "react";
import Board from "./board";

export default function EndScreen(recallList: string[]): GameArenaComponents {
    const defaultTabIndex = 0;
    const [tabIndex, setTabIndex] = useState(defaultTabIndex);
    const [gameData, setGameData] = useState<GameData | null>(null);

    async function fetchCurrentGameData() {
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
                items={["board", "recall list", "stats"]}
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
                ) : tabIndex === 1 ? (
                    <div className="w-full h-full overflow-auto">
                        {recallList.length > 0 && (
                            <ul className="my-2 mx-6 flex flex-col space-y-2">
                                {recallList.map((item, index) => (
                                    <li
                                        key={index}
                                        className="p-2 rounded bg-white text-black"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-full overflow-auto">
                        <p className="m-2 p-2 rounded bg-primary text-secondary font-bold">
                            Game Statistics
                        </p>
                    </div>
                )}
            </div>
        ),
    };
}
