import { GameData, GameState } from "@/constants/game_states";
import IconButton from "./icon_button";
import Timer from "./timer";
import RemainingTime from "./remaining_time";
import Board from "./board";
import RecallList from "./recall_list";
import EndScreen from "./end_screen";
import { useState } from "react";
import StartGameButton from "./start_game_button";

interface GameArenaComponents {
    aboveBoard?: React.ReactElement;
    gameBoard?: React.ReactElement;
    belowBoard?: React.ReactElement;
}

interface GameStagesProps {
    gameState: GameState;
    unlockTime: Date | null;
    onTimerExpired: () => void;
    restartGame: () => void;
    onStartGame: () => void;
    onSubmitItems: (items: string[]) => void;
}

export default function GameStages({
    gameState,
    unlockTime,
    onTimerExpired,
    restartGame,
    onStartGame,
    onSubmitItems,
}: GameStagesProps): GameArenaComponents {
    const [recallList, setRecallList] = useState<string[]>([]);
    const [gameData, setGameData] = useState<GameData | null>(null);

    const stages: Record<GameState, GameArenaComponents> = {
        [GameState.NOT_STARTED]: {
            gameBoard: (
                <div className="h-full flex justify-center items-center">
                <StartGameButton onGameStartClick={(gameData) => {
                    setGameData(gameData);
                    onStartGame();
                }}/>
                </div>
            ),
        },
        [GameState.IN_PROGRESS]: {
            aboveBoard: (
                <Timer durationInSeconds={1} onTimeout={onTimerExpired} />
                //     <Timer durationInSeconds={60} onTimeout={onTimerExpired} />
            ),
            gameBoard: <Board gameData={gameData!}/>,
        },
        [GameState.LOCKED]: {
            gameBoard: (
                <div className="h-full flex justify-center items-center">
                    {unlockTime && <RemainingTime expiringTime={unlockTime} />}
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
                    onSubmitItems={(items) => {
                        setRecallList(items);
                        onSubmitItems(items);
                    }}
                />
            ),
        },
        [GameState.ENDED]: EndScreen(recallList),
    };

    return stages[gameState] || stages[GameState.NOT_STARTED];
}
