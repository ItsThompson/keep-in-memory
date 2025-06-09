"use client";

import GameOptions from "@/components/ui/game_options";
import Topbar from "@/components/ui/topbar";
import GameArena from "@/components/ui/game_arena";
import { useEffect, useState } from "react";
import { GameState } from "@/constants/interfaces";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Description from "@/components/ui/description";
import EndScreen from "@/components/ui/end_screen";

const clientID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function Home() {
    const [showGameOptions, setShowGameOptions] = useState(true);
    const [signedIn, setSignedIn] = useState(false);

    function handleGameState(gameState: GameState) {
        if (gameState === GameState.NOT_STARTED) {
            setShowGameOptions(true);
            return;
        }
        setShowGameOptions(false);
        return;
    }

    useEffect(() => {
        // Check if the user is already signed in
        const token = localStorage.getItem("token");
        if (token) {
            setSignedIn(true);
        }
    }, []);

    return (
        <GoogleOAuthProvider clientId={clientID}>
            <div className="w-screen h-screen flex flex-col items-center">
                <Topbar
                    onSignIn={async () => {
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
