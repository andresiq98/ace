"use client";

import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDrillById } from "@/lib/drills";
import { ArrowLeft, Home } from "lucide-react";

function DrillContent() {
    const params = useParams();
    const router = useRouter();
    const drillId = params.drillId as string;
    const groupId = params.groupId as string;
    const drill = getDrillById(drillId);

    if (!drill) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-ace-muted gap-4 px-8">
                <div className="text-5xl">🎾</div>
                <p className="text-lg font-bold text-center">Drill não encontrado</p>
                <button
                    onClick={() => router.push("/home")}
                    className="mt-4 px-6 py-3 bg-[#CCFF00] text-black font-montserrat font-black text-xs tracking-[2px] uppercase rounded-xl"
                >
                    Voltar para Home
                </button>
            </div>
        );
    }

    const categoryLabels: Record<string, string> = {
        serve_plus_one: "Saque + 1",
        return_plus_one: "Devolução + 1",
        cross_then_change: "Cruzado → Mudança",
        short_ball_finish: "Bola Curta",
        defense_to_neutral: "Defesa → Neutro",
        pressure_point: "Pressão Extrema",
    };

    return (
        <div className="h-full flex flex-col bg-black text-white">
            {/* Top Bar */}
            <header className="flex items-center justify-between px-5 pt-14 pb-3.5 sticky top-0 bg-black/95 backdrop-blur-[24px] z-50 border-b border-white/[0.04]">
                <button
                    onClick={() => router.back()}
                    className="w-[38px] h-[38px] bg-[#111113] border border-[#27272A] rounded-[10px] flex items-center justify-center text-lg transition-all duration-200 active:scale-[0.88] active:bg-[#CCFF00] active:text-black active:border-[#CCFF00]"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="font-montserrat font-extrabold text-xs tracking-[3px] uppercase text-[#A1A1AA]">
                    Drill
                </div>
                <button
                    onClick={() => router.push("/home")}
                    className="w-[38px] h-[38px] bg-[#111113] border border-[#27272A] rounded-[10px] flex items-center justify-center text-lg transition-all duration-200 active:scale-[0.88] active:bg-[#CCFF00] active:text-black active:border-[#CCFF00]"
                >
                    <Home className="w-4 h-4" />
                </button>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-[140px]">
                {/* Hero Section */}
                <div className="relative px-5 pt-6 pb-8">
                    {/* Background glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(204,255,0,0.08)_0%,transparent_70%)] pointer-events-none" />

                    {/* Emoji */}
                    <div className="text-center mb-4 relative z-10">
                        <div className="text-[72px] leading-none drop-shadow-[0_0_40px_rgba(204,255,0,0.15)]">
                            {drill.emoji}
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="font-montserrat font-black text-[32px] uppercase tracking-[-2px] leading-[0.95] text-center mb-3 relative z-10">
                        {drill.title}
                    </h1>

                    {/* Category Badge */}
                    <div className="flex justify-center mb-4 relative z-10">
                        <span className="bg-[#CCFF00]/[0.08] border border-[#CCFF00]/20 rounded-full px-4 py-1.5 text-[10px] font-bold text-[#CCFF00] tracking-[2px] uppercase font-montserrat">
                            {categoryLabels[drill.category] || drill.category}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#A1A1AA] text-center leading-relaxed max-w-[280px] mx-auto relative z-10">
                        {drill.shortDescription}
                    </p>
                </div>

                {/* Stats Row */}
                <div className="flex gap-2 px-5 mb-4">
                    <div className="flex-1 bg-[#111113] border border-[#27272A] rounded-xl p-3 text-center">
                        <div className="text-[9px] tracking-[3px] text-[#52525B] font-bold uppercase font-montserrat mb-1">Modo</div>
                        <div className="text-sm font-bold text-white">
                            {drill.mode === "competitive" ? "⚔️ 1v1" : "🤝 Coop"}
                        </div>
                    </div>
                    <div className="flex-1 bg-[#111113] border border-[#27272A] rounded-xl p-3 text-center">
                        <div className="text-[9px] tracking-[3px] text-[#52525B] font-bold uppercase font-montserrat mb-1">Formato</div>
                        <div className="text-sm font-bold text-[#CCFF00]">Até 10 pts</div>
                    </div>
                    <div className="flex-1 bg-[#111113] border border-[#27272A] rounded-xl p-3 text-center">
                        <div className="text-[9px] tracking-[3px] text-[#52525B] font-bold uppercase font-montserrat mb-1">Nível</div>
                        <div className="text-[#CCFF00] text-sm tracking-wider">
                            {"★".repeat(drill.difficulty)}{"☆".repeat(5 - drill.difficulty)}
                        </div>
                    </div>
                </div>

                {/* "Não vale pontos" notice */}
                <div className="mx-5 mb-4 bg-[#18181B] border border-[#27272A] rounded-xl p-3 flex items-center gap-3">
                    <div className="text-lg">🎮</div>
                    <div>
                        <div className="text-[11px] font-bold text-white">Modo Diversão</div>
                        <div className="text-[10px] text-[#52525B]">Drills não afetam seu ranking. Jogue sem pressão!</div>
                    </div>
                </div>

                {/* Rules Card */}
                <div className="mx-5 mb-4 bg-gradient-to-br from-[#111113] to-[#0d0d0f] border border-[#27272A] rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[radial-gradient(circle,rgba(204,255,0,0.04)_0%,transparent_70%)] pointer-events-none" />

                    <div className="text-[10px] tracking-[4px] text-[#CCFF00] font-bold uppercase font-montserrat mb-4 flex items-center gap-2">
                        <span>📋</span> Regras do Jogo
                    </div>

                    <ul className="space-y-2.5">
                        {drill.rules.map((rule, i) => (
                            <li key={i} className="flex gap-3 items-start">
                                <span className="w-5 h-5 bg-[#CCFF00]/[0.08] border border-[#CCFF00]/20 rounded-md flex items-center justify-center text-[10px] font-black text-[#CCFF00] shrink-0 mt-[1px]">
                                    {i + 1}
                                </span>
                                <span className="text-[13px] text-[#A1A1AA] leading-[1.5]">
                                    {rule}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Victory Condition */}
                    <div className="mt-5 pt-4 border-t border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🏆</span>
                            <div>
                                <div className="text-[9px] tracking-[3px] text-[#52525B] font-bold uppercase font-montserrat">Para Vencer</div>
                                <p className="text-sm font-bold text-white mt-0.5">Pontos corridos até 10</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lore Card */}
                <div className="mx-5 mb-4 bg-[#111113] border border-[#27272A] rounded-2xl p-5">
                    <div className="text-[10px] tracking-[4px] text-[#A1A1AA] font-bold uppercase font-montserrat mb-3 flex items-center gap-2">
                        <span>📖</span> A História
                    </div>
                    <p className="text-[13px] text-[#71717A] leading-[1.7] italic">
                        &ldquo;{drill.lore}&rdquo;
                    </p>
                </div>

                {/* Focus / Target Zones */}
                {drill.targetZones && drill.targetZones.length > 0 && (
                    <div className="mx-5 mb-4 bg-[#111113] border border-[#27272A] rounded-2xl p-5">
                        <div className="text-[10px] tracking-[4px] text-[#A1A1AA] font-bold uppercase font-montserrat mb-3 flex items-center gap-2">
                            <span>🎯</span> Zonas Alvo
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {drill.targetZones.map((zone, i) => (
                                <span key={i} className="bg-[#CCFF00]/[0.06] border border-[#CCFF00]/15 rounded-lg px-3 py-1.5 text-[11px] font-bold text-[#CCFF00]">
                                    {zone}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 px-5 py-4 pb-8 bg-gradient-to-t from-black via-black/95 to-transparent z-10">
                <button
                    onClick={() => router.push(`/log/${groupId}/${drillId}?duration=60&drill=true`)}
                    className="w-full h-[58px] bg-[#CCFF00] text-black rounded-[14px] font-montserrat font-black text-[13px] tracking-[2.5px] uppercase flex items-center justify-center gap-2.5 transition-all duration-200 relative overflow-hidden shadow-[0_4px_24px_rgba(204,255,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-[0.96] active:shadow-[0_2px_12px_rgba(204,255,0,0.3)]"
                >
                    <span className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                    BORA JOGAR 🔥
                </button>
                <button
                    onClick={() => router.push("/home")}
                    className="w-full mt-2 h-[44px] bg-transparent border border-[#27272A] rounded-xl flex items-center justify-center font-montserrat text-[11px] font-bold tracking-[1px] text-[#A1A1AA] transition-all duration-200 active:scale-95 active:border-[#CCFF00] active:text-[#CCFF00] gap-2"
                >
                    <Home className="w-4 h-4" /> Voltar para Home
                </button>
            </div>
        </div>
    );
}

export default function DrillDetailPage() {
    return (
        <Suspense fallback={<div className="h-full flex items-center justify-center text-[#A1A1AA] bg-black"><div className="w-6 h-6 border-2 border-[#CCFF00]/30 border-t-[#CCFF00] rounded-full animate-spin" /></div>}>
            <DrillContent />
        </Suspense>
    );
}
