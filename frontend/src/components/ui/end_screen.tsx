import { GameArenaComponents } from "@/constants/game_states";
import ArenaTabs from "./arena_tabs";
import { useState } from "react";

export default function EndScreen(recallList: string[]): GameArenaComponents {
    const [isBoardTab, setIsBoardTab] = useState(true);
    return {
        aboveBoard: (
            <ArenaTabs
                items={["board", "recall list"]}
                defaultSelectedIndex={0}
                updatedTabIndex={(i) => {
                    setIsBoardTab(i === 0);
                }}
            />
        ),
        gameBoard: (
            <div className="h-full w-full">
                {isBoardTab ? (
                    <div className="h-full flex justify-center items-center">
                        <p>Game Board</p>
                    </div>
                ) : (
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
                )}
            </div>
        ),
    };
}
