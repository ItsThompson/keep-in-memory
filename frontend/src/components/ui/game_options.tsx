"use client";

import { useState } from "react";
import Tabs from "./tabs";

export default function GameOptions() {
    const defaultIndices = {
        gameModeIndex: 1,
        gameOptionsIndex: 2,
        gameSpeedIndex: 2,
    };

    const [gameSettings, setGameSettings] = useState({
        gameModeIndex: defaultIndices.gameModeIndex,
        gameOptionsIndex: defaultIndices.gameOptionsIndex,
        gameSpeedIndex: defaultIndices.gameSpeedIndex,
    });
    return (
        <div className="flex justify-center mb-5">
            <div className="flex items-center justify-center sm:justify-between w-full sm:w-3/4 bg-secondary rounded-lg px-5 py-2 gap-2 sm:gap-5">
                <Tabs
                    items={["remove one", "recall all"]}
                    defaultSelectedIndex={defaultIndices.gameModeIndex}
                    className="ml-8"
                    updatedTabIndex={(index) => {
                        setGameSettings({
                            ...gameSettings,
                            gameModeIndex: index,
                        });
                        console.log(gameSettings);
                    }}
                />
                <span className="text-white font-bold">|</span>
                <Tabs
                    items={[
                        "colors & shapes",
                        "locations",
                        "items",
                        "license plate",
                    ]}
                    defaultSelectedIndex={defaultIndices.gameOptionsIndex}
                    updatedTabIndex={(index) => {
                        setGameSettings({
                            ...gameSettings,
                            gameOptionsIndex: index,
                        });
                        console.log(gameSettings);
                    }}
                />
                <span className="text-white font-bold">|</span>
                <Tabs
                    items={["06", "12", "24", "48"]}
                    defaultSelectedIndex={defaultIndices.gameSpeedIndex}
                    className="mr-8"
                    updatedTabIndex={(index) => {
                        setGameSettings({
                            ...gameSettings,
                            gameSpeedIndex: index,
                        });
                        console.log(gameSettings);
                    }}
                />
            </div>
        </div>
    );
}
