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
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeInSeconds((seconds) => {
                if (seconds <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return seconds - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [durationInSeconds]);

    useEffect(() => {
        if (timeInSeconds === 0 && onTimeout) {
            onTimeout();
        }
    }, [timeInSeconds, onTimeout]);

    // Skip button handler

    const handleSkip = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        setTimeInSeconds(0);

        if (onTimeout) {
            onTimeout();
        }
    };

    return (
        <div className="flex">
            <div className="bg-primary text-secondary font-bold p-3 m-2 rounded">
                {durationInSeconds <= 60 ? (
                    <p>{timeInSeconds}</p>
                ) : (
                    <p>
                        {`${Math.floor(timeInSeconds / 60)}`.padStart(2, "0")}:
                        {`${timeInSeconds % 60}`.padStart(2, "0")}
                    </p>
                )}
            </div>
            <button
                className="bg-secondary text-primary font-bold p-3 m-2 rounded"
                onClick={handleSkip}
            >
                done
            </button>
        </div>
    );
}
