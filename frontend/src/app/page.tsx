"use client";

import GameOptions from "@/components/ui/game_options";
import Topbar from "@/components/ui/topbar";
import GameArena from "@/components/ui/game_arena";
import { useState } from "react";
import { GameState } from "@/constants/interfaces";

export default function Home() {
    const [showGameOptions, setShowGameOptions] = useState(true);

    function handleGameState(gameState: GameState) {
        // game has not started
        //  - game options visible
        if (gameState === GameState.NOT_STARTED) {
            setShowGameOptions(true);
            return;
        }

        // game is in progress
        if (
            gameState === GameState.IN_PROGRESS ||
            gameState === GameState.LOCKED ||
            gameState === GameState.RECALL
        ) {
            // - game options hidden
            setShowGameOptions(false);
            return;
        }

        // results page; game has ended
        if (gameState === GameState.ENDED) {
            // - show results (when the restart button is clicked it goes to False, False)
            // - result section to the right of board
            // - game options hidden
            setShowGameOptions(false);
            return;
        }
    }

    return (
        <div className="w-screen h-screen flex flex-col items-center">
            <Topbar />
            <GameArena onGameStateChange={handleGameState} />
            {showGameOptions && <GameOptions />}
        </div>
    );
}
