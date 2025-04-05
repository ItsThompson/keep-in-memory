"use client";

import { useEffect, useState } from "react";
import GameOptionTabs from "./game_option_tabs";
import { getGameSettings } from "@/lib/utils";

export default function GameOptions() {
    const defaultIndices = {
        gameModeIndex: 1,
        gameOptionsIndex: 2,
        gameDurationIndex: 2,
    };

    const gameModeOptions = ["remove one", "recall all"];
    const gameItemOptions = [
        "colors & shapes",
        "locations",
        "items",
        "license plate",
    ];
    const gameDurationOptions = ["06", "12", "24", "48"];

    const [gameSettings, setGameSettings] = useState({
        gameMode: gameModeOptions[defaultIndices.gameModeIndex],
        gameItemType: gameItemOptions[defaultIndices.gameOptionsIndex],
        gameDuration: parseInt(gameDurationOptions[defaultIndices.gameDurationIndex]),
    });

    useEffect(() => {
        setGameSettings(getGameSettings());
    }, []);

    useEffect(() => {
        localStorage.setItem("gameSettings", JSON.stringify(gameSettings));
    }, [gameSettings]);

    return (
        <div className="flex items-center justify-center sm:justify-between w-full sm:w-3/4 bg-secondary rounded-lg px-5 py-2 mb-2 gap-2 sm:gap-5">
            <GameOptionTabs
                items={gameModeOptions}
                defaultSelectedIndex={defaultIndices.gameModeIndex}
                className="ml-8"
                updatedTabIndex={(index) => {
                    setGameSettings({
                        ...gameSettings,
                        gameMode: gameModeOptions[index],
                    });
                }}
            />
            <span className="text-white font-bold">|</span>
            <GameOptionTabs
                items={gameItemOptions}
                defaultSelectedIndex={defaultIndices.gameOptionsIndex}
                updatedTabIndex={(index) => {
                    setGameSettings({
                        ...gameSettings,
                        gameItemType: gameItemOptions[index],
                    });
                }}
            />
            <span className="text-white font-bold">|</span>
            <GameOptionTabs
                items={gameDurationOptions}
                defaultSelectedIndex={defaultIndices.gameDurationIndex}
                className="mr-8"
                updatedTabIndex={(index) => {
                    setGameSettings({
                        ...gameSettings,
                        gameDuration: parseInt(gameDurationOptions[index]),
                    });
                }}
            />
        </div>
    );
}
