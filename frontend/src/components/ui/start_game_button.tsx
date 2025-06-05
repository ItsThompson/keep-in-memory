import { GameData } from "@/constants/interfaces";
import IconButton from "./icon_button";
import { getNewGame } from "@/api/new_game";

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
                    const data = await getNewGame();

                    if (!data) {
                        console.warn(
                            "Game start failed or already in progress.",
                        );
                        return;
                    }

                    onGameStartClick(data);
                    return;
                } catch (error) {
                    console.error("Error starting game:", error);
                    return;
                }
            }}
        />
    );
}
