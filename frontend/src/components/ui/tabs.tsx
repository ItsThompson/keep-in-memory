"use client";

import { useState } from "react";

interface GameOptionsProps {
    items: string[];
    defaultSelectedIndex: number;
    className?: string;
}

export default function Tabs({
    items,
    defaultSelectedIndex,
    className,
}: GameOptionsProps) {
    const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex);

    return (
        <div className={`flex flex-wrap items-center justify-center gap-8 ${className}`}>
            {items.map((item, index) => (
                <button
                    key={index}
                    className={`font-bold hover:cursor-pointer text-sm
                    ${
                        selectedIndex === index
                            ? "text-primary"
                            : "text-white"
                    }`}
                    onClick={() => setSelectedIndex(index)}
                >
                    {item}
                </button>
            ))}{" "}
        </div>
    );
}
