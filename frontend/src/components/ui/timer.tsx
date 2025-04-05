import React, { useEffect, useRef, useState } from "react";

interface TimerProps {
    durationInSeconds?: number;
    onTimeout?: () => void;
}

export default function Timer({
    durationInSeconds = 60,
    onTimeout,
}: TimerProps) {
    const [timeInSeconds, setTimeInSeconds] = useState(durationInSeconds);
    const timerRef = useRef<NodeJS.Timeout | null>(null); // Store timer reference

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeInSeconds((seconds) => {
                if (seconds <= 0) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return seconds - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timerRef.current!); // Cleanup on unmount
        };
    }, []);

    useEffect(() => {
        if (timeInSeconds === 0 && onTimeout) {
            onTimeout();
        }
    }, [timeInSeconds, onTimeout]);

    return (
        <div className="bg-primary text-secondary font-bold p-3 m-2 rounded">
            {durationInSeconds <= 60 ? (
                <p>{`${timeInSeconds}`}</p>
            ) : (
                <p>
                    {`${Math.floor(timeInSeconds / 60)}`.padStart(2, "0")}:
                    {`${timeInSeconds % 60}`.padStart(2, "0")}
                </p>
            )}
        </div>
    );
}
