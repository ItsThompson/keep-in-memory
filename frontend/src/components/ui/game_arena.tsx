"use client";

import {
    GameState,
    RecallResult,
    ResultClassification,
} from "@/constants/interfaces";
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
        let expired: boolean = false;
        if (expiryTime) {
            const time = new Date(expiryTime);
            if (time < new Date()) {
                // TODO: API CALL TO CHECK IF LOCK HAS EXPIRED
                // - Get current game data
                // - check if time < gameDateCreated + gameDuration
                expired = true;
            }

            if (expired) {
                setGameState(GameState.RECALL);
                setUnlockTime(null);
                localStorage.removeItem("expiryTime");
            } else {
                setUnlockTime(time);
                setGameState(GameState.LOCKED);
            }
            // } else {
            // TODO: API CALL TO CHECK IF GAME IS IN PROGRESS
            // - get current game data
            // - if that returns no game data, set gameState to NOT_STARTED
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
        // TODO: HERE ADD API CALL TO RESTART GAME (NEED TO IMPLEMENT LAMBDA)
        //  - DELETE GAME DATA
        setGameState(GameState.NOT_STARTED);
        setUnlockTime(null);
        localStorage.removeItem("expiryTime");
    };

    const onStartGame = () => {
        setGameState(GameState.IN_PROGRESS);
    };

    const onSubmitItems = (items: string[]) => {
        // TODO: API CALL TO ADD RECALL LIST TO GAMEDATA
        // - adds recall list to dynamodb row
        function mockOkResponse(): any {
            return {
                body: '{\"game_id\": \"1269ae1f-f032-4392-9ba9-a21020e26b9a\", \"recall_results\": [{\"name\": \"trash\", \"classification\": \"true_positive\"}, {\"name\": \"carseat\", \"classification\": \"true_positive\"}, {\"name\": \"pencil\", \"classification\": \"true_positive\"}, {\"name\": \"cablecar\", \"classification\": \"true_positive\"}, {\"name\": \"tennisball\", \"classification\": \"true_positive\"}, {\"name\": \"envelope\", \"classification\": \"true_positive\"}, {\"name\": \"flag\", \"classification\": \"true_positive\"}, {\"name\": \"trophy\", \"classification\": \"true_positive\"}, {\"name\": \"sailboat\", \"classification\": \"true_positive\"}, {\"name\": \"car\", \"classification\": \"true_positive\"}, {\"name\": \"bicycle\", \"classification\": \"false_positive\"}, {\"name\": \"bell\", \"classification\": \"false_positive\"}]}',
                statusCode: 200,
            };
        }
        let recallResult: RecallResult[] = [];
        const response = mockOkResponse();
        if (response.statusCode !== 200) {
            console.error("Failed to submit items:", response);
            return [];
        }
        const data = JSON.parse(response.body);
        if (!data.recall_results || !Array.isArray(data.recall_results)) {
            console.error("Invalid recall results format:", data);
            return [];
        }
        recallResult = data.recall_results.map((item: any) => ({
            recalledItemName: item.name,
            classification: item.classification as ResultClassification,
        }));

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
