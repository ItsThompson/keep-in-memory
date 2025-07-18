import { GameData } from "@/constants/interfaces";
import IconButton from "./icon_button";
import { getNewGame } from "@/api/new_game";
import { useAuth } from "../authContext";
import { redirect } from "next/navigation";

interface StartGameButtonProps {
    onGameStartClick: (gameData: GameData) => void;
}

export default function StartGameButton({
    onGameStartClick,
}: StartGameButtonProps) {
    const { token, setToken } = useAuth();

    const fetchNewGame = async () => {
        try {
            const data: GameData | false | null = await getNewGame(
                token,
                setToken,
            );
            if (data === null) {
                redirect("/sign-in");
            }

            if (!data) {
                console.warn("Game start failed or already in progress.");
                return;
            }

            onGameStartClick(data);
            return;
        } catch (error) {
            console.error("Error starting game:", error);
            return;
        }
    };

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
            onClick={() => {
                fetchNewGame();
            }}
        />
    );
}
