"use client";

import { useEffect, useState } from "react";
import GameOptionTabs from "./game_option_tabs";
import { getGameSettings } from "@/lib/utils";
import Counter from "./counter";
import Loading from "./loading_component";

// TODO: Create route for getting number of items in database

export default function GameOptions() {
    const gameDurationOptionsText = ["short (10 secs)", "long (24 hrs)"];
    const gameDurationOptionsValues = [10, 86400]; // 10 seconds, 24 hours

    const [gameSettings, setGameSettings] = useState<{
        itemCount: number;
        gameDuration: number;
    } | null>(null);

    useEffect(() => {
        setGameSettings(getGameSettings());
    }, []);
    useEffect(() => {
        if (gameSettings !== null) {
            localStorage.setItem("gameSettings", JSON.stringify(gameSettings));
        }
    }, [gameSettings]);

    if (!gameSettings) return <Loading text="Loading game settings..." />;

    return (
        <div className="flex items-center justify-around w-full sm:w-3/4 bg-secondary rounded-lg px-5 py-5 mb-2 gap-4 sm:gap-8">
            <Counter
                initialValue={gameSettings.itemCount}
                min={8}
                max={20}
                onChange={(val) => {
                    console.log("Item count changed:", val);
                    setGameSettings({
                        ...gameSettings,
                        itemCount: val,
                    });
                }}
            />
            <span className="text-white font-bold">|</span>
            <GameOptionTabs
                items={gameDurationOptionsText}
                defaultSelectedIndex={0}
                className="mr-8"
                updatedTabIndex={(index) => {
                    setGameSettings({
                        ...gameSettings,
                        gameDuration: gameDurationOptionsValues[index],
                    });
                }}
            />
        </div>
    );
}
