"use client";

import { GameState } from "@/constants/game_states";
import IconButton from "./icon_button";

import { ReactElement, useState } from "react";
import Timer from "./timer";

interface GameArenaComponents {
    aboveBoard?: ReactElement;
    gameBoard?: ReactElement;
    belowBoard?: ReactElement;
}

interface GameArenaProps {
    onGameStateChange: (gameState: GameState) => void;
}

export default function GameArena({ onGameStateChange }: GameArenaProps) {
    // game start and game end should be broadcasted
    const [gameState, setGameState] = useState<GameState>(
        GameState.NOT_STARTED,
    );

    // stage 1: button with start
    const stage1: GameArenaComponents = {
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
                    onClick={() => {
                        const newState = GameState.IN_PROGRESS; // Set the new game state
                        setGameState(newState); // Update the local state
                        onGameStateChange(newState); // Pass the new state to the parent
                        // generate items in the game board
                    }}
                />
            </div>
        ),
    };

    const timerExpired = () => {
        // TODO: state change => stage 3
        console.log("timer expired");
    };

    // stage 2: game board containing items
    //   - outside of board: timer
    //   - hides game_options
    const stage2: GameArenaComponents = {
        aboveBoard: <Timer durationInSeconds={60} onTimeout={timerExpired} />,
        gameBoard: <div>game board with items</div>,
    };

    // stage 3: div with unlock in X hours
    //   - outside of board: restart button
    const stage3: GameArenaComponents = {
        gameBoard: <div>unlocks in X hours</div>,
        belowBoard: <div>restart button</div>,
    };

    // stage 4: response (list items you remember)
    //  - inside board: list of items, done button
    const stage4: GameArenaComponents = {
        gameBoard: <div>list of recalled items</div>,
    };

    // stage 5: results
    //  - outside of board: tabs (board, what you recalled), stats and buttons
    //  - inside board: game_board and response list of items
    const stage5: GameArenaComponents = {
        aboveBoard: <div>tabs of the board view and the recalled list</div>,
        gameBoard: <div>tab views</div>,
    };

    const renderedGameStage = () => {
        switch (gameState) {
            case GameState.NOT_STARTED:
                return stage1;
            case GameState.IN_PROGRESS:
                return stage2;
            case GameState.ENDED:
                return stage5;
            default:
                return stage1;
        }
    };

    const currentStage = renderedGameStage();
    return (
        <div className="flex flex-col items-center m-2 w-full h-full">
            {currentStage.aboveBoard && currentStage.aboveBoard}
            <div className="h-full w-full sm:w-3/4 border-4 rounded border-secondary">
                {currentStage.gameBoard && currentStage.gameBoard}
            </div>
            {currentStage.belowBoard && currentStage.belowBoard}
        </div>
    );
}
