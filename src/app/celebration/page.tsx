"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function CelebrationContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useSearchParams();

    const didWin = params.get("win") === "true";
    const score = params.get("score") || "6×2";
    const rival = params.get("rival") || "Rival";
    const mode = params.get("mode") || "simples";
    const points = params.get("pts") || "10";

    useEffect(() => {
        if (!loading && !user) router.push("/");
    }, [user, loading, router]);

    if (loading || !user) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;

    return (
        <div className="flex flex-col h-full bg-black text-white relative overflow-hidden items-center justify-center px-8">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.06)_0%,transparent_60%)] pointer-events-none" />

            <div className="text-center relative z-10 w-full">
                {mode === "treino" ? (
                    <>
                        <div className="text-[60px] mb-3 animate-[pulse_2s_ease-in-out_infinite]">🎯</div>
                        <h1 className="font-montserrat font-black text-4xl uppercase tracking-tight mb-2">
                            TREINO FINALIZADO
                        </h1>
                        <div className="text-[12px] text-[#CCFF00] font-extrabold tracking-[3px] uppercase mb-5">
                            +{points} PONTOS DE EXP
                        </div>

                        <div className="font-montserrat font-black text-[28px] tracking-[-1px] text-[#CCFF00] drop-shadow-[0_0_40px_rgba(204,255,0,0.25)] mb-2 uppercase break-words px-4">
                            {params.get("drill") || "Treino Geral"}
                        </div>
                        <div className="text-[13px] text-[#A1A1AA] mb-8 mt-2">
                            Parceiros: <span className="text-white font-bold">{rival}</span>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Emoji + Title */}
                        <div className="text-[60px] mb-3 animate-bounce">{didWin ? "🏆" : "🎾"}</div>
                        <h1 className="font-montserrat font-black text-4xl uppercase tracking-tight mb-2">
                            {didWin ? "VITÓRIA!" : "BOA LUTA!"}
                        </h1>
                        <div className="text-[12px] text-[#CCFF00] font-extrabold tracking-[3px] uppercase mb-5">
                            +{points} PONTOS NO RANKING
                        </div>

                        {/* Score */}
                        <div className="font-montserrat font-black text-[52px] tracking-[-3px] text-[#CCFF00] drop-shadow-[0_0_40px_rgba(204,255,0,0.25)] mb-2">
                            {score}
                        </div>
                        <div className="text-[13px] text-[#A1A1AA] mb-6">
                            {didWin ? `${user.displayName || "Você"} venceu ${rival}` : `${rival} venceu`}
                            {mode === "duplas" && <span className="text-[#52525B]"> · Duplas</span>}
                        </div>

                        {/* Rank Change */}
                        <div className="inline-flex items-center gap-5 bg-[#111113] border border-[#27272A] rounded-xl px-6 py-3 mb-8">
                            <div className="text-center">
                                <div className="text-[10px] text-[#A1A1AA] mb-1">Antes</div>
                                <div className="font-montserrat font-black text-2xl">3°</div>
                            </div>
                            <div className="text-lg text-[#CCFF00]">→</div>
                            <div className="text-center">
                                <div className="text-[10px] text-[#CCFF00] mb-1">Agora</div>
                                <div className="font-montserrat font-black text-2xl text-[#CCFF00]">2°</div>
                            </div>
                        </div>
                    </>
                )}

                {/* Buttons */}
                <div className="flex flex-col gap-3 w-[220px] mx-auto">
                    <button
                        onClick={() => {
                            const query = new URLSearchParams({
                                score: score,
                                rival: rival,
                                win: String(didWin),
                                mode: mode,
                                ...(mode === "treino" && { drill: params.get("drill") || "Treino Geral" })
                            }).toString();
                            router.push(`/share?${query}`);
                        }}
                        className="w-full h-[48px] bg-[#CCFF00] text-black font-montserrat font-black text-[13px] tracking-[2px] uppercase rounded-xl transition-transform active:scale-95 shadow-[0_4px_20px_rgba(204,255,0,0.2)] flex items-center justify-center gap-2"
                    >
                        📤 COMPARTILHAR
                    </button>
                    <button
                        onClick={() => router.push("/home")}
                        className="w-full h-[48px] bg-transparent border-2 border-[#27272A] rounded-xl flex items-center justify-center font-montserrat text-xs font-bold tracking-[1px] text-white transition-transform active:scale-95"
                    >
                        Voltar à Arena
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CelebrationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>}>
            <CelebrationContent />
        </Suspense>
    );
}
