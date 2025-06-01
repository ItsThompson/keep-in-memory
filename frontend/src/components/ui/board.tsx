import { GameData } from "@/constants/game_states";
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
    const edgeBuffer = 10;

    useEffect(() => {
        const placeImages = () => {
            const container = containerRef.current;
            if (!container) return;

            const containerWidth = container.clientWidth - edgeBuffer * 2;
            const containerHeight = container.clientHeight - edgeBuffer * 2;

            const placed: Position[] = [];

            const doesOverlap = (position: Position): boolean => {
                return placed.some((placedPosition) => {
                    return (
                        Math.abs(placedPosition.x - position.x) < imageSize &&
                        Math.abs(placedPosition.y - position.y) < imageSize
                    );
                });
            };

            for (let i = 0; i < imageUrls.length; i++) {
                let attempts = 0;
                let x, y;
                do {
                    x =
                        Math.random() * (containerWidth - imageSize) +
                        edgeBuffer;
                    y =
                        Math.random() * (containerHeight - imageSize) +
                        edgeBuffer;
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
                    }}
                />
            ))}
        </div>
    );
}
