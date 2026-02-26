"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    User,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("[ACE Auth] Setting up auth state listener...");

        // Handle redirect returns
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    console.log("[ACE Auth] Redirect sign-in successful:", result.user.displayName);
                }
            })
            .catch((err: any) => {
                console.error("[ACE Auth] Redirect sign-in error:", err);
                const msg = err.message || "Erro desconhecido";
                setError(`Erro Firebase: ${msg}`);
                alert(`O Firebase bloqueou este login.\n\nSe você está no celular, você precisa adicionar esse IP local ou Domínio nas configurações "Authorized Domains" do Firebase.\n\nErro exato: ${msg}`);
            });

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("[ACE Auth] Auth state changed:", currentUser ? `Logged in as ${currentUser.displayName}` : "Not logged in");
            setUser(currentUser);

            // Give Next.js router a moment to digest before marking loading=false
            setTimeout(() => {
                setLoading(false);
            }, 100);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            setError(null);
            console.log("[ACE Auth] Starting Google Sign-In with redirect...");
            await signInWithRedirect(auth, googleProvider);
        } catch (err: any) {
            console.error("[ACE Auth] Sign-in setup error:", err);
            setError(`Falha local: ${err.message}`);
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
        <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
