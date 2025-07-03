import { GameData } from "@/constants/interfaces";
import { useEffect, useMemo, useRef, useState } from "react";

interface BoardProps {
    gameData: GameData;
}

interface Position {
    x: number;
    y: number;
}

export default function Board({ gameData }: BoardProps) {
    const imageUrls = useMemo(() => {
        return gameData.items.map((item) => {
            return item.objectUrl;
        });
    }, [gameData.items]);

    const itemNames = useMemo(() => {
        const getNameFromUrl = (url: string): string => {
            const parts = url.split("/");
            const filename = parts[parts.length - 1];
            return filename.split(".")[0]; // Remove file extension
        };

        return gameData.items.map((item) => {
            return item.names[0] || getNameFromUrl(item.objectUrl);
        });
    }, [gameData.items]);

    const containerRef = useRef<HTMLDivElement>(null);
    const [positions, setPositions] = useState<Position[]>([]);
    const [itemsPlacedSuccessfully, setItemsPlacedSuccessfully] =
        useState<boolean>(true);

    const imageSize = 100; // Size of each image in pixels
    const imagePadding = 50; // Padding around the images to prevent overlap

    useEffect(() => {
        const placeImages = () => {
            const container = containerRef.current;
            if (!container) return;

            const containerWidth = container.clientWidth - imagePadding * 2;
            const containerHeight = container.clientHeight - imagePadding * 2;

            const placed: Position[] = [];

            const doesOverlap = (position: Position): boolean => {
                return placed.some((placedPosition) => {
                    return (
                        Math.abs(placedPosition.x - position.x) <
                            imageSize + imagePadding &&
                        Math.abs(placedPosition.y - position.y) <
                            imageSize + imagePadding
                    );
                });
            };

            let placementFailed = false;

            for (let i = 0; i < imageUrls.length; i++) {
                let attempts = 0;
                let x, y;
                do {
                    x =
                        Math.random() * (containerWidth - imageSize) +
                        imagePadding;
                    y =
                        Math.random() * (containerHeight - imageSize) +
                        imagePadding;
                    attempts++;
                } while (doesOverlap({ x, y }) && attempts < 100);

                if (attempts >= 100) {
                    placementFailed = true;
                    console.warn("Could not place all items without overlap.");
                }

                placed.push({ x, y });
            }

            setPositions(placed);

            return placementFailed;
        };
        const placementFailed = placeImages();
        setItemsPlacedSuccessfully(!placementFailed);
        window.addEventListener("resize", placeImages);
        return () => window.removeEventListener("resize", placeImages);
    }, [imageUrls]);

    // for each item
    return itemsPlacedSuccessfully ? (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden"
        >
            {positions.map((pos, index) => (
                // Could potentially use next/image for optimization.
                <img
                    key={index}
                    src={imageUrls[index]}
                    alt="Game Item"
                    style={{
                        position: "absolute",
                        width: `${imageSize}px`,
                        height: "auto",
                        left: `${pos.x}px`,
                        top: `${pos.y}px`,
                        objectFit: "contain",
                        userSelect: "none",
                        WebkitUserSelect: "none",
                        MozUserSelect: "none",
                        msUserSelect: "none",
                        pointerEvents: "none", // Prevent interaction
                    }}
                />
            ))}
        </div>
    ) : (
        <div className="h-full flex flex-col justify-between">
            <div className="flex flex-col">
                <div className="m-2 p-2 rounded bg-primary text-secondary font-bold">
                    <p>Memorize these items!</p>
                </div>
                <div className="max-h-[70vh] overflow-auto">
                    {itemNames.length > 0 && (
                        <ul className="my-2 mx-6 flex flex-col space-y-2">
                            {itemNames.map((item, index) => (
                                <li
                                    key={index}
                                    className="p-2 rounded bg-white text-black"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
