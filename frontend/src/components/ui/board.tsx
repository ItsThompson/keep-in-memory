import { getGameSettings } from "@/lib/utils";

export default function Board() {
    const gameSettings = getGameSettings();

    function getGameItems(numItems = 5) {
        switch (gameSettings.gameItemType) {
            case "colors & shapes":
                // TODO: future thing
                break;
            case "locations":
                // TODO: future thing
                break;
            case "license plate":
                // TODO: future thing
                break;
            default:
                // default is "items"
                // TODO: Fetch N items from backend (UUID)
                // S3 bucket to store items images?
                // then a non-sql database to store correct answers 
                // - acts as cache for semantically similar answers from LLM
                break;
        }
    }

    return (
        <div>
            <p>game board with items</p>
        </div>
    );
}
