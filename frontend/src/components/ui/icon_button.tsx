"use client";

import Image from "next/image";

interface IconButtonProps {
    src: string;
    alt: string;
    description: string;
    buttonText?: string;
    className?: string;
    textClassName?: string;
    width: number;
    height: number;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export default function IconButton({
    src,
    alt,
    description,
    buttonText,
    className = "",
    textClassName = "",
    width,
    height,
    onClick,
    onMouseEnter,
    onMouseLeave,
}: IconButtonProps) {
    return (
        <button
            type="button"
            className={`rounded-lg text-center inline-flex items-center ${className}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <Image
                className="hover:opacity-80 mr-2"
                src={src}
                alt={alt}
                width={width}
                height={height}
            />
            {buttonText && 
                <span className={`font-bold text-primary ${textClassName}`}>{buttonText}</span>
            }
            <span className="sr-only">{description}</span>
        </button>
    );
}
