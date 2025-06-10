import React, { useState, useEffect } from "react";
import Image from "next/image";

interface RemainingTimeProps {
    expiringTime: Date;
    onTimeExpired: () => void;
}

export default function RemainingTime({
    expiringTime,
    onTimeExpired,
}: RemainingTimeProps) {
    const calculateRemainingTime = () => {
        const remainingTime = expiringTime.getTime() - Date.now();
        const hours = Math.floor(remainingTime / (60 * 60 * 1000));
        const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / 60000);
        const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

        if (remainingTime <= 0) {
            return "0 seconds";
        } else if (hours > 0) {
            if (hours === 1) {
                return "1 hour";
            }
            return `${hours} hours`;
        } else if (minutes > 0) {
            if (minutes === 1) {
                return "1 minute";
            }
            return `${minutes} minutes`;
        } else {
            if (seconds === 1) {
                return "1 second";
            }
            return `${seconds} seconds`;
        }
    };

    const [text, setText] = useState(calculateRemainingTime());
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const remainingTime = expiringTime.getTime() - Date.now();

            if (remainingTime <= 0) {
                setText("0 seconds");

                if (!expired) {
                    setExpired(true);
                    if (onTimeExpired) {
                        onTimeExpired();
                    }
                }

                clearInterval(interval);
            } else {
                setText(calculateRemainingTime());
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiringTime, onTimeExpired, expired]);

    return (
        <div className="flex flex-col gap-y-2 items-center rounded-lg bg-primary text-secondary font-bold p-2 m-2">
            <Image
                src="/lock.svg"
                alt="lock symbol"
                width={20}
                height={20}
                className="w-[20px] h-[20px]"
            />
            <div className="flex flex-col items-center">
                <p>unlocks in</p>
                <p>{text}</p>
            </div>
        </div>
    );
}
