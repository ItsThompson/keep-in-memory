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
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCurrentGame = async () => {
            const gameData = await getCurrentGame();
            if (gameData) {
                setCurrentGame(gameData);
            }
            setIsLoading(false);
        };
        fetchCurrentGame();
    }, []);
    useEffect(() => {
        const getGameEndTime = (game: FullGameData): Date => {
            return new Date(
                game.dateCreated.getTime() + game.gameDuration * 60 * 60 * 1000,
            );
        };

        const isExpired = (
            expiry: Date,
            game: FullGameData | null,
        ): boolean => {
            if (expiry >= new Date()) return false;
            if (!game) return true;
            return expiry >= getGameEndTime(game);
        };

        const handleExpired = () => {
            setGameState(GameState.RECALL);
            setUnlockTime(null);
            localStorage.removeItem("expiryTime");
        };

        const handleLocked = (unlockAt: Date) => {
            setGameState(GameState.LOCKED);
            setUnlockTime(unlockAt);
        };

        const handleNotStarted = () => {
            setGameState(GameState.NOT_STARTED);
            setUnlockTime(null);
        };

        const localStorageExpiry = localStorage.getItem("expiryTime");

        if (localStorageExpiry) {
            const expiryDate = new Date(localStorageExpiry);
            if (isExpired(expiryDate, currentGame)) {
                handleExpired();
            } else {
                handleLocked(expiryDate);
            }
        } else if (currentGame) {
            const gameEndTime = getGameEndTime(currentGame);
            if (isExpired(gameEndTime, currentGame)) {
                handleExpired();
            } else {
                localStorage.setItem("expiryTime", gameEndTime.toISOString());
                handleLocked(gameEndTime);
            }
        } else {
            handleNotStarted();
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

    return isLoading ? (
        <div className="h-full w-full sm:w-3/4 m-2 border-4 border-secondary rounded flex items-center justify-center">
            <p>Loading data...</p>
        </div>
    ) : (
        <div className="flex flex-col items-center m-2 w-full h-full">
            {currentStage.aboveBoard}
            <div className="h-full w-full sm:w-3/4 border-4 rounded border-secondary">
                {currentStage.gameBoard}
            </div>
            {currentStage.belowBoard}
        </div>
    );
}
