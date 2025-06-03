import { GameData } from "@/constants/interfaces";
import IconButton from "./icon_button";
import { getGameSettings, replaceSpacesWithUnderscores } from "@/lib/utils";

interface StartGameButtonProps {
    onGameStartClick: (gameData: GameData) => void;
}

export default function StartGameButton({
    onGameStartClick,
}: StartGameButtonProps) {

    function mockOkResponse(): any {
        return {
            body: '{"game_id": "2e865633-4d22-4b3d-ae0b-7ab081710323", "items": [{"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/pencil.png", "ID": "10", "names": ["pencil"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/carseat.png", "ID": "7", "names": ["carseat"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/tennisball.png", "ID": "5", "names": ["tennisball"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/bicycle.png", "ID": "3", "names": ["bicycle"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/flag.png", "ID": "11", "names": ["flag"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/car.png", "ID": "2", "names": ["car"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/cablecar.png", "ID": "4", "names": ["cablecar"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/trash.png", "ID": "9", "names": ["trash"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/trophy.png", "ID": "12", "names": ["trophy"]}, {"object_url": "https://kim-items-87596a16-3641-483a-b856-dad769142a75.s3.amazonaws.com/sailboat.png", "ID": "8", "names": ["sailboat"]}]}',
            statusCode: 200,
        };
    }
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
                    // TODO: uncomment the following code
                    // const gameSettings = getGameSettings();
                    // const response = await fetch(
                    //     process.env.NEXT_PUBLIC_API_URL + "/new-game",
                    //     {
                    //         method: "GET",
                    //         headers: {
                    //             "Content-Type": "application/json",
                    //             player_id:
                    //                 "5610d519-9f60-4746-a756-4bcbeb401b9d", // TODO: replace with actual player ID
                    //             game_type: replaceSpacesWithUnderscores(
                    //                 gameSettings.gameMode,
                    //             ),
                    //             number_of_items: "10",
                    //             game_duration:
                    //                 gameSettings.gameDuration.toString(), // in hours,
                    //             // "x-api-key": process.env.REACT_APP_API_KEY || "",
                    //         },
                    //     },
                    // );
                    // const data = await response.json();
                    // if (!response.ok) {
                    //     console.error("Failed to start game:", data);
                    //     return;
                    // }
                    //
                    // if (data.statusCode == 500) {
                    //     console.error(data);
                    //     return;
                    // }
                    //
                    // if (data.statusCode == 409) {
                    //     let gameId = data["game_id"];
                    //     let gameDateCreated = data["date_created"];
                    //     let gameDuration = data["game_duration"]; // in hours
                    //     const time = new Date(
                    //         Date.parse(gameDateCreated) +
                    //             gameDuration * 60 * 60 * 1000,
                    //     );
                    //     localStorage.setItem("expiryTime", time.toString());
                    //     window.location.reload();
                    //     console.warn(
                    //         "Game already in progress with ID:",
                    //         gameId,
                    //     );
                    //     return;
                    // }

                    let data = mockOkResponse();

                    console.log("Game started successfully:");
                    const parsed = JSON.parse(data.body);
                    const gameData: GameData = {
                        gameId: parsed.game_id,
                        items: parsed.items.map((item: any) => ({
                            id: item.ID,
                            objectUrl: item.object_url,
                            names: item.names,
                        })),
                    };

                    onGameStartClick(gameData);
                    return;
                } catch (error) {
                    console.error("Error starting game:", error);
                    return;
                }
            }}
        />
    );
}
