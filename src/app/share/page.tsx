"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function ShareContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useSearchParams();

    const didWin = params.get("win") === "true";
    const score = params.get("score") || "6×2";
    const rival = params.get("rival") || "Rival";
    const mode = params.get("mode") || "simples";
    const drill = params.get("drill") || "Treino Geral";

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading || !user) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;

    const handleShareWhatsApp = () => {
        const text = mode === "treino"
            ? `🎾 *ACE — Tênis Competitivo*\n\n🎯 Treino Concluído: *${drill}*\n🔥 Parceiros: ${rival}\n\n🏆 Top 3:\n1. Rafael Moura — 58pts\n2. Carlos Augusto — 54pts ← 🔥\n3. Lucas Pinheiro — 41pts\n\n🔗 Grupo: *ACE24*\nace.app/join/ACE24`
            : `🎾 *ACE — Tênis Competitivo*\n\n⚡ Missão: ${mode === "duplas" ? "Duplas" : "Set Normal"}\n📊 ${user?.displayName?.split(" ")[0] || "Carlos"} ${score} ${rival}\n\n🏆 Top 3:\n1. Rafael Moura — 58pts\n2. Carlos Augusto — 52pts ← 🔥\n3. Lucas Pinheiro — 41pts\n\n🔗 Grupo: *ACE24*\nace.app/join/ACE24`;

        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };

    return (
        <div className="flex flex-col h-full bg-black text-white relative overflow-hidden overflow-y-auto pb-24">
            {/* Topbar */}
            <div className="flex items-center justify-between p-5 pt-8 relative z-10 w-full sticky top-0 bg-gradient-to-b from-black to-transparent">
                <div className="flex items-center gap-2">
                    <div className="w-[18px] h-[18px] bg-white rounded-full relative">
                        <div className="absolute inset-0 border-[2px] border-[#CCFF00] rounded-full scale-125 opacity-30 animate-pulse" />
                    </div>
                    <span className="font-montserrat font-black text-xs tracking-[1px] text-white">ACE</span>
                </div>
                <div className="w-10"></div>
            </div>

            <div className="px-5 mb-4">
                <h1 className="font-montserrat font-black text-[28px] uppercase tracking-tighter leading-tight mt-2 pb-2">
                    COMPARTI-<br />
                    LHE <span className="text-[#CCFF00]">🏆</span>
                </h1>
            </div>

            {/* Share Card UI */}
            <div className="mx-5 mb-6 bg-gradient-to-b from-[#18181B] to-[#111113] border border-[#27272A] rounded-3xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
                {/* Glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#CCFF00] opacity-[0.03] blur-3xl rounded-full" />

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-2.5 h-2.5 bg-[#CCFF00] rounded-full shadow-[0_0_8px_rgba(204,255,0,0.3)]"></div>
                            <span className="font-montserrat font-black text-sm tracking-[1px] text-white">ACE</span>
                        </div>
                        <div className="text-[8px] tracking-[4px] text-[#A1A1AA] uppercase font-montserrat font-bold">
                            Tênis Competitivo
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-[#A1A1AA]">Grupo</div>
                        <div className="text-[13px] font-bold text-white">Clube dos Coxos</div>
                    </div>
                </div>

                {/* Match Result or Training Status */}
                {mode === "treino" ? (
                    <div className="bg-black/40 border border-[#27272A] rounded-2xl p-6 mb-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent opacity-30" />
                        <div className="text-[40px] mb-2 drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]">🎯</div>
                        <div className="font-montserrat font-black text-2xl text-white tracking-[-1px] text-center uppercase break-words w-full px-2">
                            {drill}
                        </div>
                        <div className="text-[10px] text-[#A1A1AA] mt-3 font-bold uppercase tracking-[2px]">
                            Treino Concluído
                        </div>
                    </div>
                ) : (
                    <div className="bg-black/40 border border-[#27272A] rounded-2xl p-4 mb-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent opacity-20" />
                        <div className="text-[9px] font-bold text-[#CCFF00] font-montserrat tracking-[2px] uppercase mb-4 text-center">
                            ⚡ {mode === "duplas" ? "Duplas" : "Set Normal"}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex flex-col items-center w-[70px]">
                                <div className={`w-12 h-12 bg-[#CCFF00] text-black font-montserrat font-black flex items-center justify-center rounded-full text-lg mb-1 ${didWin ? "shadow-[0_0_15px_rgba(204,255,0,0.15)]" : "border-2 border-[#27272A] opacity-50 bg-transparent text-white"}`}>
                                    {user?.displayName?.split(" ")[0].slice(0, 2).toUpperCase() || "CA"}
                                </div>
                                <div className="text-[11px] font-bold text-white text-center w-full truncate">
                                    {user?.displayName?.split(" ")[0] || "Carlos A."}
                                </div>
                                {didWin && <div className="text-[9px] text-[#CCFF00] font-bold mt-1 scale-90">🏆 VENCEDOR</div>}
                            </div>

                            <div className="font-montserrat font-black text-4xl text-white tracking-[-2px] text-shadow-sm px-2">
                                {score}
                            </div>

                            <div className="flex flex-col items-center w-[70px]">
                                <div className={`w-12 h-12 ${didWin ? "bg-[#333] text-white opacity-50 border-2 border-transparent" : "bg-[#CCFF00] text-black shadow-[0_0_15px_rgba(204,255,0,0.15)]"} font-montserrat font-black flex items-center justify-center rounded-full text-lg mb-1`}>
                                    {rival.split(" ")[0].slice(0, 2).toUpperCase()}
                                </div>
                                <div className="text-[11px] font-bold text-white text-center w-full truncate">
                                    {rival.split(" ")[0]}
                                </div>
                                {!didWin && <div className="text-[9px] text-[#CCFF00] font-bold mt-1 scale-90">🏆 VENCEDOR</div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Updated Top 3 */}
                <div className="mb-6">
                    <h3 className="text-[10px] font-montserrat font-extrabold uppercase tracking-[3px] text-[#A1A1AA] mb-4">Top 3 Atualizado</h3>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <span className="font-montserrat font-black text-lg text-[#FFD700] w-4 text-center">1</span>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF8F00] text-black font-montserrat font-black text-xs flex items-center justify-center">RM</div>
                            <div className="text-xs font-bold text-white flex-1">Rafael Moura</div>
                            <div className="font-montserrat font-black text-[#FFD700] text-sm">58</div>
                        </div>

                        <div className="flex items-center gap-3 bg-[rgba(204,255,0,0.05)] border border-[rgba(204,255,0,0.1)] p-2 -mx-2 rounded-xl">
                            <span className="font-montserrat font-black text-lg text-[#A1A1AA] w-4 text-center">2</span>
                            <div className="w-8 h-8 rounded-full bg-[#CCFF00] text-black font-montserrat font-black text-xs flex items-center justify-center">CA</div>
                            <div className="text-xs font-bold text-[#CCFF00] flex-1">Carlos A. <span className="text-[10px] ml-1 opacity-80">←</span></div>
                            <div className="font-montserrat font-black text-[#CCFF00] text-sm">52</div>
                        </div>

                        <div className="flex items-center gap-3 opacity-60">
                            <span className="font-montserrat font-black text-lg text-[#CD7F32] w-4 text-center">3</span>
                            <div className="w-8 h-8 rounded-full bg-[#2979FF] text-white font-montserrat font-black text-xs flex items-center justify-center">LP</div>
                            <div className="text-xs font-bold text-white flex-1">Lucas Pinheiro</div>
                            <div className="font-montserrat font-black text-[#CD7F32] text-sm">41</div>
                        </div>
                    </div>
                </div>

                {/* Footer info */}
                <div className="flex items-center justify-between border-t border-[#27272A] pt-4 mt-2">
                    <div className="font-montserrat font-black text-xl text-[#A1A1AA] tracking-[4px]">ACE24</div>
                    <div className="text-[9px] text-[#52525B] uppercase font-bold tracking-[1px]">entre no grupo<br />ace.app</div>
                </div>
            </div>

            <div className="px-5 mb-3">
                <button
                    onClick={handleShareWhatsApp}
                    className="w-full flex items-center justify-center gap-2 h-[52px] bg-[#25D366] text-white font-montserrat font-black text-[13px] tracking-[2px] uppercase rounded-xl transition-transform active:scale-95 shadow-[0_4px_20px_rgba(37,211,102,0.2)]"
                >
                    📱 Enviar no WhatsApp
                </button>
            </div>

            <div className="px-5 mb-8">
                <button className="w-full h-[52px] bg-transparent border-2 border-[#27272A] rounded-xl flex items-center justify-center font-montserrat text-xs font-bold tracking-[1px] text-white cursor-not-allowed opacity-50">
                    📥 Salvar Imagem (V2)
                </button>
            </div>

            <div className="text-center">
                <button onClick={() => router.push("/home")} className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider underline">← Voltar pra Home</button>
            </div>
        </div>
    );
}

export default function SharePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>}>
            <ShareContent />
        </Suspense>
    );
}
