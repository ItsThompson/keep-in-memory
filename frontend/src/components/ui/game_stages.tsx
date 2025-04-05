import { GameState } from "@/constants/game_states";
import IconButton from "./icon_button";
import Timer from "./timer";
import RemainingTime from "./remaining_time";
import Board from "./board";
import recall_list from "./recall_list";
import RecallList from "./recall_list";

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
                <Timer durationInSeconds={3} onTimeout={onTimerExpired} />
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
            gameBoard: <RecallList onSubmitItems={onSubmitItems} />,
        },
        [GameState.ENDED]: {
            aboveBoard: <div>tabs of the board view and the recalled list</div>,
            gameBoard: <div>tab views</div>,
        },
    };

    return stages[gameState] || stages[GameState.NOT_STARTED];
}
