"use client";

import Image from "next/image";

interface IconButtonProps {
    src: string;
    alt: string;
    description: string;
    className?: string;
    width: number;
    height: number;
    onClick: () => void;
}

export default function IconButton({
    src,
    alt,
    description,
    className = "",
    width,
    height,
    onClick,
}: IconButtonProps) {
    return (
        <button
            type="button"
            className={`font-medium rounded-full text-sm text-center inline-flex items-center ${className}`}
            onClick={onClick}
        >
            <Image
                className="hover:opacity-80"
                src={src}
                alt={alt}
                width={width}
                height={height}
            />
            <span className="sr-only">{description}</span>
        </button>
    );
}
