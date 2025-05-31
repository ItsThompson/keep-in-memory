"use client";

import { GameData, GameState } from "@/constants/game_states";
import { useEffect, useState } from "react";
import GameStages from "./game_stages";
import { getGameSettings } from "@/lib/utils";

interface GameArenaProps {
    onGameStateChange: (gameState: GameState) => void;
}

export default function GameArena({ onGameStateChange }: GameArenaProps) {
    const [gameState, setGameState] = useState<GameState>(
        GameState.NOT_STARTED,
    );
    const [unlockTime, setUnlockTime] = useState<Date | null>(null);

    useEffect(() => {
        const expiryTime = localStorage.getItem("expiryTime");
        if (expiryTime) {
            const time = new Date(expiryTime);

            if (time < new Date()) {
                setGameState(GameState.RECALL);
                setUnlockTime(null);
                localStorage.removeItem("expiryTime");
            } else {
                setUnlockTime(time);
                setGameState(GameState.LOCKED);
            }
        }
    }, []);

    useEffect(() => {
        onGameStateChange(gameState);
    }, [gameState, onGameStateChange]);

    const onTimerExpired = () => {
        setGameState(GameState.LOCKED);

        const gameSettings = getGameSettings();
        const time = new Date(
            Date.now() + gameSettings.gameDuration * 60 * 60 * 1000,
        );

        setUnlockTime(time);
        localStorage.setItem("expiryTime", time.toString());
    };

    const restartGame = () => {
        setGameState(GameState.NOT_STARTED);
        setUnlockTime(null);
        localStorage.removeItem("expiryTime");
    };

    const onStartGame = () => {
        setGameState(GameState.IN_PROGRESS);
    };

    const onSubmitItems = (items: string[]) => {
        console.log(items);
        console.log("Items submitted");
        setGameState(GameState.ENDED);
    };

    const currentStage = GameStages({
        gameState,
        unlockTime,
        onTimerExpired,
        restartGame,
        onStartGame,
        onSubmitItems,
    });

    return (
        <div className="flex flex-col items-center m-2 w-full h-full">
            {currentStage.aboveBoard}
            <div className="h-full w-full sm:w-3/4 border-4 rounded border-secondary">
                {currentStage.gameBoard}
            </div>
            {currentStage.belowBoard}
        </div>
    );
}
