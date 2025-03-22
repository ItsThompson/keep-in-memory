"use client";

import IconButton from "./icon_button";

import { ReactElement, useState } from "react";

interface GameArenaComponents {
    aboveBoard?: ReactElement;
    gameBoard?: ReactElement;
    belowBoard?: ReactElement;
}

export default function GameArena() {
    const [startGame, setStartGame] = useState(true);
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
                    onClick={() => {
                        setStartGame(false);
                        console.log("start button clicked");
                    }}
                />
            </div>
        ),
    };
    // stage 2: game board containing items
    //   - outside of board: timer
    //   - hides game_options
    // stage 3: div with unlock in X hours
    //   - outside of board: restart button
    // stage 4: response (list items you remember)
    //  - inside board: list of items, done button
    //  - nothing outside of board
    // stage 5: results
    //  - outside of board: tabs (board, what you recalled), stats and buttons
    //  - inside board: game_board and response list of items
    return (
        <div className="flex flex-col items-center m-2 w-full h-full">
            <div className="h-full w-full sm:w-3/4 border-4 rounded border-secondary">
                {stage1.gameBoard}
            </div>
        </div>
    );
}
