import { GameData, GameState, RecallResult } from "@/constants/interfaces";
import IconButton from "./icon_button";
import Timer from "./timer";
import RemainingTime from "./remaining_time";
import Board from "./board";
import RecallList from "./recall_list";
import EndScreen from "./end_screen";
import { useState } from "react";
import StartGameButton from "./start_game_button";
import { getCurrentGame } from "@/api/current_game";
import { redirect } from "next/navigation";
import { useAuth } from "../authContext";

interface GameArenaComponents {
    aboveBoard?: React.ReactElement;
    gameBoard?: React.ReactElement;
    belowBoard?: React.ReactElement;
}

interface GameStagesProps {
    gameState: GameState;
    unlockTime: Date | null;
    onTimerExpired: () => void;
    onUnlock: () => void;
    restartGame: () => void;
    onStartGame: () => void;
    onSubmitItems: (items: string[]) => Promise<RecallResult[]>;
}

export default function GameStages({
    gameState,
    unlockTime,
    onTimerExpired,
    onUnlock,
    restartGame,
    onStartGame,
    onSubmitItems,
}: GameStagesProps): GameArenaComponents {
    const [recallResult, setRecallResult] = useState<RecallResult[]>([]);
    const [gameData, setGameData] = useState<GameData | null>(null);
    const { token, setToken } = useAuth();

    const stages: Record<GameState, GameArenaComponents> = {
        [GameState.NOT_STARTED]: {
            gameBoard: (
                <div className="h-full flex justify-center items-center">
                    <StartGameButton
                        onGameStartClick={(gameData) => {
                            setGameData(gameData);
                            onStartGame();
                        }}
                    />
                </div>
            ),
        },
        [GameState.IN_PROGRESS]: {
            aboveBoard: (
                <Timer durationInSeconds={60} onTimeout={onTimerExpired} />
            ),
            gameBoard: <Board gameData={gameData!} />,
        },
        [GameState.LOCKED]: {
            gameBoard: (
                <div className="h-full flex justify-center items-center">
                    {unlockTime && (
                        <RemainingTime
                            expiringTime={unlockTime}
                            onTimeExpired={onUnlock}
                        />
                    )}
                </div>
            ),
            belowBoard: (
                <IconButton
                    src="/reset.svg"
                    alt="restart logo"
                    description="restart button"
                    className="p-2 m-2"
                    buttonText=""
                    width={48}
                    height={48}
                    isButton={true}
                    onClick={restartGame}
                />
            ),
        },
        [GameState.RECALL]: {
            gameBoard: (
                <RecallList
                    onSubmitItems={async (items) => {
                        async function fetchCurrentGameData() {
                            const currentGameData: GameData | boolean | null =
                                await getCurrentGame(token, setToken);
                            if (currentGameData === null) {
                                redirect("/sign-in");
                            }

                            if (currentGameData === false) {
                                return;
                            }
                            setGameData(currentGameData);
                        }

                        await fetchCurrentGameData();
                        setRecallResult(await onSubmitItems(items));
                    }}
                />
            ),
        },
        [GameState.ENDED]: EndScreen(recallResult, gameData),
    };

    return stages[gameState] || stages[GameState.NOT_STARTED];
}
