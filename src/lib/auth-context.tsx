"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    User,
    browserPopupRedirectResolver,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("[ACE Auth] Setting up auth state listener...");
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("[ACE Auth] Auth state changed:", currentUser ? `Logged in as ${currentUser.displayName}` : "Not logged in");
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            console.log("[ACE Auth] Starting Google Sign-In with popup...");
            const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
            console.log("[ACE Auth] Sign-in successful:", result.user.displayName);
        } catch (error: unknown) {
            const firebaseError = error as { code?: string; message?: string };
            console.error("[ACE Auth] Sign-in error:", firebaseError.code, firebaseError.message);

            // If popup was blocked, show a helpful message
            if (firebaseError.code === "auth/popup-blocked") {
                alert("O popup foi bloqueado pelo navegador. Desative o bloqueador de popups e tente novamente.");
            } else if (firebaseError.code === "auth/popup-closed-by-user") {
                console.log("[ACE Auth] User closed the popup.");
                // Don't throw — user simply cancelled
                return;
            } else if (firebaseError.code === "auth/cancelled-popup-request") {
                console.log("[ACE Auth] Duplicate popup request cancelled.");
                return;
            } else {
                throw error;
            }
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("[ACE Auth] Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
