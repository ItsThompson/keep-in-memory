import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface LoadingProps {
    text?: string;
}

export default function Loading({ text = "Loading" }: LoadingProps) {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500); // change every 0.5s

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-center space-y-4">
            <div className="relative h-2 w-64 bg-muted rounded-full overflow-hidden mx-auto">
                <motion.div
                    className="absolute h-full bg-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "95%" }}
                    transition={{
                        duration: 5,
                        ease: [0, 0.5, 0.95, 1],
                    }}
                />
            </div>
            <p className="text-sm font-bold">
                {text}
                {dots}
            </p>
        </div>
    );
}
