"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GroupSelectPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading || !user) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;

    return (
        <div className="flex flex-col h-full bg-black text-white relative overflow-hidden">
            {/* Topbar */}
            <div className="flex items-center justify-between p-5 pt-8 relative z-10 w-full">
                <div className="flex items-center gap-2">
                    <div className="w-[18px] h-[18px] bg-white rounded-full relative">
                        <div className="absolute inset-0 border-[2px] border-[#CCFF00] rounded-full scale-125 opacity-30 animate-pulse" />
                    </div>
                    <span className="font-montserrat font-black text-xs tracking-[1px] text-white">ACE</span>
                </div>
                <div className="w-[38px]"></div>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 px-8 relative z-10 pb-20">
                <div className="text-[48px] mb-3">🎾</div>

                <h2 className="font-montserrat font-black text-[28px] uppercase text-center tracking-tight mb-2 leading-tight">
                    Pronto pra<br />
                    <span className="text-[#CCFF00]">jogar?</span>
                </h2>

                <p className="text-[14px] text-[#A1A1AA] text-center mb-8 leading-relaxed">
                    Crie seu grupo ou entre<br />em um que já existe.
                </p>

                <div className="w-full max-w-[300px] flex flex-col gap-3">
                    <button
                        onClick={() => router.push("/groups/create")}
                        className="w-full flex items-center justify-center gap-2 h-[52px] bg-[#CCFF00] text-black font-montserrat font-black text-[13px] tracking-[2px] uppercase rounded-xl transition-transform active:scale-95 shadow-[0_4px_20px_rgba(204,255,0,0.2)]"
                    >
                        🏆 Criar Grupo
                    </button>

                    <button
                        onClick={() => router.push("/groups/join")}
                        className="w-full h-[52px] bg-transparent border-2 border-[#27272A] rounded-xl flex items-center justify-center font-montserrat text-xs font-extrabold tracking-[1px] text-white cursor-pointer transition-transform active:scale-95"
                    >
                        Tenho um convite
                    </button>
                </div>
            </div>
        </div>
    );
}
