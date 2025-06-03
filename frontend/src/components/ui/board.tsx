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

    const containerRef = useRef<HTMLDivElement>(null);
    const [positions, setPositions] = useState<Position[]>([]);

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
                    console.warn("Could not place all items without overlap.");
                }

                placed.push({ x, y });
            }

            setPositions(placed);
        };
        placeImages();
        window.addEventListener("resize", placeImages);
        return () => window.removeEventListener("resize", placeImages);
    }, [imageUrls]);

    // for each item
    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden"
        >
            {positions.map((pos, index) => (
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
    );
}
