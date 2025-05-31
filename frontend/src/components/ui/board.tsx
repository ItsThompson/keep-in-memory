import { GameData } from "@/constants/game_states";

interface BoardProps {
    gameData: GameData;
}

export default function Board({ gameData }: BoardProps) {
    // TODO: random placement of items on the board without overlapping
    return (
        <div>
            <p>{gameData.items.toString()}</p>
        </div>
    );
}
