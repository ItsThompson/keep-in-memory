"use client";

import GameOptions from "@/components/ui/game_options";
import Topbar from "@/components/ui/topbar";
import GameArena from "@/components/ui/game_arena";
import { useState } from "react";
import { GameState } from "@/constants/interfaces";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Description from "@/components/ui/description";

const clientID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function Home() {
    const [showGameOptions, setShowGameOptions] = useState(true);
    const [signedIn, setSignedIn] = useState(false);

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
        <GoogleOAuthProvider clientId={clientID}>
            <div className="w-screen h-screen flex flex-col items-center">
                <Topbar
                    onSignIn={() => {
                        setSignedIn(true);
                    }}
                    onSignOut={() => {
                        setSignedIn(false);
                    }}
                    isSignedIn={signedIn}
                />
                {signedIn ? (
                    <GameArena onGameStateChange={handleGameState} />
                ) : (
                    <div className="h-full w-full sm:w-3/4 border-4 rounded border-secondary m-2">
                        <Description />
                    </div>
                )}
                {showGameOptions && <GameOptions />}
            </div>
        </GoogleOAuthProvider>
    );
}
