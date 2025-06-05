"use client";

import { FullGameData, GameState } from "@/constants/interfaces";
import { useEffect, useState } from "react";
import GameStages from "./game_stages";
import { getGameSettings } from "@/lib/utils";
import { getCurrentGame, removeCurrentGame } from "@/api/current_game";
import { evaluateRecall } from "@/api/evaluate_recall";

interface GameArenaProps {
    onGameStateChange: (gameState: GameState) => void;
}

export default function GameArena({ onGameStateChange }: GameArenaProps) {
    const [gameState, setGameState] = useState<GameState>(
        GameState.NOT_STARTED,
    );
    const [unlockTime, setUnlockTime] = useState<Date | null>(null);

    const [currentGame, setCurrentGame] = useState<FullGameData | null>(null);

    useEffect(() => {
        const fetchCurrentGame = async () => {
            const gameData = await getCurrentGame();
            if (gameData) {
                setCurrentGame(gameData);
            }
        };
        fetchCurrentGame();
    }, []);

    useEffect(() => {
        const localStorageExpiryDate = localStorage.getItem("expiryTime");
        if (localStorageExpiryDate) {
            let expired: boolean = false;

            const expiryDate = new Date(localStorageExpiryDate);
            if (expiryDate < new Date()) {
                // Check if current game exists and its expiry date
                if (currentGame) {
                    const gameDuration = currentGame.gameDuration;
                    const gameEndTime = new Date(
                        currentGame.dateCreated.getTime() +
                            gameDuration * 60 * 60 * 1000,
                    );
                    if (expiryDate < gameEndTime) {
                        expired = false; // Not expired, within game duration
                    } else {
                        expired = true; // Expired, beyond game duration
                    }
                } else {
                    expired = true; // No current game, so expired
                }
            }
            if (expired) {
                setGameState(GameState.RECALL);
                setUnlockTime(null);
                localStorage.removeItem("expiryTime");
            } else {
                setUnlockTime(new Date(localStorageExpiryDate));
                setGameState(GameState.LOCKED);
            }
        } else {
            if (currentGame) {
                const gameDuration = currentGame.gameDuration;
                const gameEndTime = new Date(
                    currentGame.dateCreated.getTime() +
                        gameDuration * 60 * 60 * 1000,
                );
                setUnlockTime(gameEndTime);
                setGameState(GameState.LOCKED);
                localStorage.setItem("expiryTime", gameEndTime.toISOString());
            } else {
                setGameState(GameState.NOT_STARTED);
                setUnlockTime(null);
            }
        }
    }, [currentGame]);

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
        localStorage.setItem("expiryTime", time.toISOString());
    };

    const restartGame = async () => {
        await removeCurrentGame();
        setGameState(GameState.NOT_STARTED);
        setUnlockTime(null);
        localStorage.removeItem("expiryTime");
    };

    const onStartGame = () => {
        setGameState(GameState.IN_PROGRESS);
    };

    const onSubmitItems = async (items: string[]) => {
        const recallResult = await evaluateRecall(items);
        if (!recallResult) {
            console.error("Recall evaluation failed");
            return [];
        }

        console.table(recallResult);

        setGameState(GameState.ENDED);
        return recallResult;
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
