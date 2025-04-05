import { GameState } from "@/constants/game_states";
import IconButton from "./icon_button";
import Timer from "./timer";
import RemainingTime from "./remaining_time";
import Board from "./board";
import RecallList from "./recall_list";
import EndScreen from "./end_screen";
import { useState } from "react";

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

    const stages: Record<GameState, GameArenaComponents> = {
        [GameState.NOT_STARTED]: {
            gameBoard: (
                <div className="h-full flex justify-center items-center">
                    <IconButton
                        src="/start.svg"
                        alt="game start logo"
                        description="game start button"
                        className="bg-primary p-2"
                        textClassName="text-secondary"
                        buttonText="start"
                        width={24}
                        height={24}
                        isButton={true}
                        onClick={onStartGame}
                    />
                </div>
            ),
        },
        [GameState.IN_PROGRESS]: {
            // aboveBoard: (
            //     <Timer durationInSeconds={60} onTimeout={onTimerExpired} />
            // ),
            aboveBoard: (
                <Timer durationInSeconds={1} onTimeout={onTimerExpired} />
            ),
            gameBoard: <Board />,
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
