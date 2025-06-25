"use client";

import GameOptions from "@/components/ui/game_options";
import Topbar from "@/components/ui/topbar";
import GameArena from "@/components/ui/game_arena";
import { useState } from "react";
import { GameState } from "@/constants/interfaces";
import Description from "@/components/ui/description";
import { useAuth } from "@/components/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FullScreenLoading from "@/components/ui/full_screen_loading";

export default function Home() {
    const [showGameOptions, setShowGameOptions] = useState(true);
    const { token, loading } = useAuth();
    const router = useRouter();

    function handleGameState(gameState: GameState) {
        if (gameState === GameState.NOT_STARTED) {
            setShowGameOptions(true);
            return;
        }
        setShowGameOptions(false);
        return;
    }

    if (loading) {
        return <FullScreenLoading text="Authenticating..." />;
    }

    return (
        <div className="w-screen h-screen flex flex-col items-center">
            <Topbar isSignedIn={!!token} />
            {token ? (
                <GameArena onGameStateChange={handleGameState} />
            ) : (
                <div className="h-full w-full sm:w-3/4 border-4 rounded border-secondary m-2">
                    <Description>
                        <p
                            className="text-primary text-lg text-center font-semibold max-w-2xl cursor-pointer hover:text-white hover:underline hover:scale-105 transition duration-50 ease-in-out"
                            onClick={() => router.push("/sign-in")}
                        >
                            Sign in to start playing the game!
                        </p>
                        <div className="flex flex-row justify-center items-center space-x-4 mt-12">
                            <Link
                                className="text-sm text-white hover:underline"
                                href="/privacy"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                className="text-sm text-white hover:underline"
                                href="/terms"
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </Description>
                </div>
            )}
            {showGameOptions && <GameOptions />}
        </div>
    );
}
