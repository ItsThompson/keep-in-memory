import { GameData } from "@/constants/game_states";
import IconButton from "./icon_button";
import { getGameSettings } from "@/lib/utils";

interface StartGameButtonProps {
    onGameStartClick: (gameData: GameData) => void;
}

export default function StartGameButton({
    onGameStartClick,
}: StartGameButtonProps) {
    return (
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
            onClick={async () => {
                try {
                    const gameSettings = getGameSettings();
                    const response = await fetch(
                        process.env.REACT_API_URL + "/new-game",
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                player_id:
                                    "5610d519-9f60-4746-a756-4bcbeb401b9d", // TODO: replace with actual player ID
                                game_type: gameSettings.gameMode,
                                number_of_items: "5", // TODO: How we will decide this
                                game_duration: gameSettings.gameDuration.toString() // in hours,
                                // "x-api-key": process.env.REACT_APP_API_KEY || "",
                            },
                        },
                    );
                    const data = await response.json();
                    console.log(response);
                    if (response.status == 500) {
                        console.error(data);
                        return;
                    }

                    if (response.status == 409) {
                        let gameId = data["game_id"];
                        let gameDateCreated = data["date_created"];
                        let gameDuration = data["game_duration"]; // in hours
                        console.error(
                            "Game already in progress with ID:",
                            gameId,
                        );
                        const time = new Date(
                            Date.parse(gameDateCreated) +
                                gameDuration * 60 * 60 * 1000,
                        );
                        localStorage.setItem("expiryTime", time.toString());
                        window.location.reload();
                        return;
                    }

                    console.log("Game started successfully:", data);
                    onGameStartClick(data as GameData);
                    return;
                } catch (error) {
                    console.error("Error starting game:", error);
                    return;
                }
            }}
        />
    );
}
