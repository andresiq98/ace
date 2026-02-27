"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDrillsByMode } from "@/lib/drills";

export default function PlayPage() {
    const router = useRouter();
    const [isScheduling, setIsScheduling] = useState(false);

    // Filter available drills - maintaining the competitive ones as default for the main list
    const drills = getDrillsByMode('competitive');

    return (
        <div className="flex flex-col h-full bg-black text-white relative overflow-hidden overflow-y-auto pb-24">
            <div className="px-5 mb-6 pt-3">
                <h1 className="font-montserrat font-black text-4xl uppercase tracking-tighter leading-tight mt-2">
                    BORA<br />
                    <span className="text-[#CCFF00]">PRO PLAY?</span>
                </h1>
            </div>

            <div className="px-5 flex flex-col gap-3 relative z-10 animate-[fadeIn_0.5s_ease-out]">
                {/* Agendar Jogo (Toggle) */}
                <div
                    onClick={() => setIsScheduling(!isScheduling)}
                    className="bg-[#111113] border border-[#27272A] rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all"
                >
                    <div className="w-12 h-12 bg-[#18181B] border border-[#27272A] rounded-xl flex items-center justify-center text-2xl shrink-0">
                        📅
                    </div>
                    <div className="flex-1">
                        <div className="font-montserrat font-black text-[15px] uppercase tracking-wide">Agendar Jogo</div>
                        <div className="text-[11px] text-[#A1A1AA] mt-1">Marque data/hora e avise pelo WhatsApp</div>
                    </div>
                    <div className={`text-[#52525B] transition-transform ${isScheduling ? 'rotate-180' : ''}`}>
                        ▼
                    </div>
                </div>

                {isScheduling && (
                    <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-4 animate-[fadeIn_0.3s_ease-out]">
                        <div className="text-[10px] text-[#A1A1AA] font-bold tracking-[2px] uppercase mb-3">📅 Escolha o dia</div>
                        <p className="text-sm text-[#52525B] italic text-center py-4">Agendamento em desenvolvimento para V2.</p>
                    </div>
                )}

                <div className="text-[10px] font-extrabold tracking-[4px] uppercase text-[#A1A1AA] mt-6 mb-2">Jogo Principal</div>

                {/* Set Normal - Navigate to Log Match */}
                <div
                    onClick={() => router.push("/play/log")}
                    className="bg-[#111113] border border-[rgba(204,255,0,0.3)] rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00] opacity-[0.03] rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="w-12 h-12 bg-[#18181B] border-2 border-[#CCFF00] rounded-xl flex items-center justify-center text-2xl shrink-0 relative z-10">
                        🎾
                    </div>
                    <div className="flex-1 relative z-10">
                        <div className="font-montserrat font-black text-[15px] uppercase tracking-wide text-[#CCFF00]">Set Normal</div>
                        <div className="text-[11px] text-[#A1A1AA] mt-1">Jogo livre · Registrar resultado</div>
                        <div className="flex gap-2 mt-2">
                            <span className="text-[9px] font-bold text-[#A1A1AA] bg-[#18181B] border border-[#27272A] px-2 py-1 rounded">⏱ 60 min</span>
                            <span className="text-[9px] font-bold text-[#FFD700] bg-[rgba(255,215,0,0.06)] border border-[rgba(255,215,0,0.1)] px-2 py-1 rounded">🏆 Vale pontos</span>
                        </div>
                    </div>
                    <div className="text-[#CCFF00] font-black text-xl relative z-10">
                        →
                    </div>
                </div>

                <div className="text-center text-[9px] text-[#52525B] font-bold tracking-[2px] uppercase my-6">Ou tente algo diferente</div>
                <div className="text-[10px] font-extrabold tracking-[4px] uppercase text-[#A1A1AA] mb-2">🎯 Drills Situacionais</div>

                {/* Situational Drills (Mapped from Data) */}
                {drills.map((drill) => (
                    <div
                        key={drill.id}
                        onClick={() => router.push(`/drill/group-coxos/${drill.id}`)}
                        className="bg-[#111113] border border-[#27272A] rounded-2xl p-4 flex items-center gap-4 transition-all cursor-pointer active:scale-[0.98] hover:border-[rgba(204,255,0,0.3)] relative"
                    >
                        <div className="w-12 h-12 bg-[#18181B] border border-[#27272A] rounded-xl flex items-center justify-center text-2xl shrink-0">
                            {drill.emoji}
                        </div>
                        <div className="flex-1">
                            <div className="font-montserrat font-black text-[14px] uppercase tracking-wide">{drill.title}</div>
                            <div className="text-[11px] text-[#A1A1AA] mt-1">{drill.shortDescription}</div>
                        </div>
                        <div className="w-6 h-6 border-2 border-[#27272A] rounded-full shrink-0 flex items-center justify-center text-[10px] font-black text-transparent transition-all duration-250">
                            ✓
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
