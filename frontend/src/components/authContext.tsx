"use client";

import { refreshAccessToken } from "@/api/auth";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type AuthContextType = {
    token: string | null;
    setToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);


    const value: AuthContextType = {
        token,
        setToken,
    };

    useEffect(() => {
        const tryRefreshToken = async () => {
            const newToken = await refreshAccessToken();
            setToken(newToken);
        }
        tryRefreshToken();
    }, [])

    return <AuthContext value={value}>{children}</AuthContext>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
