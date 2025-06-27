import { GameData, GameState, RecallResult } from "@/constants/interfaces";
import { useEffect, useState } from "react";
import GameStages from "./game_stages";
import { getGameSettings } from "@/lib/utils";
import { getCurrentGame, removeCurrentGame } from "@/api/current_game";
import { evaluateRecall } from "@/api/evaluate_recall";
import { useAuth } from "../authContext";
import { redirect } from "next/navigation";
import Loading from "./loading_component";

interface GameArenaProps {
    onGameStateChange: (gameState: GameState) => void;
}

export default function GameArena({ onGameStateChange }: GameArenaProps) {
    const [gameState, setGameState] = useState<GameState>(
        GameState.NOT_STARTED,
    );
    const [unlockTime, setUnlockTime] = useState<Date | null>(null);

    const [currentGame, setCurrentGame] = useState<GameData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [expiryCheckTrigger, setExpiryCheckTrigger] = useState(0);
    const { token, setToken } = useAuth();

    useEffect(() => {
        const fetchCurrentGame = async () => {
            const gameData: GameData | boolean | null = await getCurrentGame(
                token,
                setToken,
            );
            if (gameData === null) {
                redirect("/sign-in");
            }

            if (gameData) {
                setCurrentGame(gameData);
            }
            setIsLoading(false);
        };
        fetchCurrentGame();
    }, [token, setToken]);

    useEffect(() => {
        const getGameEndTime = (game: GameData): Date => {
            return new Date(
                game.dateCreated.getTime() + game.gameDuration * 1000,
            );
        };

        const isExpired = (expiry: Date, game: GameData | null): boolean => {
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
                console.log("Game expired, redirecting to recall stage");
                handleExpired();
            } else {
                console.log("Game is locked, setting unlock time");
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
    }, [currentGame, expiryCheckTrigger]);

    useEffect(() => {
        onGameStateChange(gameState);
    }, [gameState, onGameStateChange]);

    const onTimerExpired = () => {
        setGameState(GameState.LOCKED);

        const gameSettings = getGameSettings();
        const time = new Date(Date.now() + gameSettings.gameDuration * 1000);

        setUnlockTime(time);
        localStorage.setItem("expiryTime", time.toISOString());
    };

    const onUnlock = () => {
        setExpiryCheckTrigger((prev) => prev + 1);
    };

    const restartGame = async () => {
        const response: boolean | null = await removeCurrentGame(
            token,
            setToken,
        );
        if (response === null) {
            redirect("/sign-in");
        }
        setGameState(GameState.NOT_STARTED);
        setUnlockTime(null);
        localStorage.removeItem("expiryTime");
    };

    const onStartGame = () => {
        setGameState(GameState.IN_PROGRESS);
    };

    const onSubmitItems = async (items: string[]) => {
        const recallResult: RecallResult[] | false | null =
            await evaluateRecall(items, token, setToken);
        if (recallResult === null) {
            redirect("/sign-in");
        }

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
        onUnlock,
        restartGame,
        onStartGame,
        onSubmitItems,
    });

    if (isLoading) {
        return (
            <div className="h-full w-full sm:w-3/4 m-2 border-4 border-secondary rounded flex items-center justify-center">
                <Loading text="Loading Data" />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col items-center m-2 w-full h-full">
                {currentStage.aboveBoard}
                <div className="h-full w-full sm:w-3/4 border-4 rounded border-secondary">
                    {currentStage.gameBoard}
                </div>
                {currentStage.belowBoard}
            </div>
            {gameState === GameState.ENDED && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
                    <button
                        className="rounded-lg text-center inline-flex items-center font-bold text-secondary bg-primary py-4 px-8 hover:scale-110 transition ease-in-out delay-50 duration-150"
                        onClick={() => {
                            window.location.reload();
                        }}
                    >
                        New Game
                    </button>
                </div>
            )}
        </>
    );
}
