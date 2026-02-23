"use client";

import { Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getDrillById } from "@/lib/drills";
import { DURATION_FORMAT } from "@/lib/data";
import { ArrowLeft } from "lucide-react";

function DrillContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const drillId = params.drillId as string;
    const groupId = params.groupId as string;
    const drill = getDrillById(drillId);
    const duration = parseInt(searchParams.get("duration") || "60", 10);
    const formatLabel = DURATION_FORMAT[duration] || DURATION_FORMAT[60];

    if (!drill) {
        return (
            <div className="h-full flex items-center justify-center text-ace-muted">
                Drill não encontrado
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Top Bar */}
            <header className="flex items-center justify-between px-5 pt-14 pb-3.5 sticky top-0 bg-background/92 backdrop-blur-[24px] saturate-[180%] z-50 border-b border-white/[0.04]">
                <button
                    onClick={() => router.back()}
                    className="w-[38px] h-[38px] bg-ace-surface2 border border-ace-border rounded-[10px] flex items-center justify-center text-lg transition-all duration-200 active:scale-[0.88] active:bg-neon active:text-background active:border-neon"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="font-display font-extrabold text-xs tracking-[3px] uppercase text-ace-mid">
                    Regras da Arena
                </div>
                <div className="w-[38px]" />
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-[120px]">
                {/* Title */}
                <div className="px-5 pt-3 pb-3.5">
                    <h1 className="font-display font-black text-[38px] uppercase tracking-[-2px] leading-[0.92]">
                        REGRAS<br /><span className="text-neon neon-text-glow">DA ARENA 🗡️</span>
                    </h1>
                </div>

                {/* Main Drill Card */}
                <div className="mx-5 mb-4 bg-gradient-to-br from-neon/5 to-neon/[0.01] border-[1.5px] border-neon/20 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-neon text-background font-display text-[8px] font-black tracking-[2px] uppercase px-3.5 py-[5px] rounded-[0_16px_0_12px] shadow-[0_2px_8px_rgba(204,255,0,0.2)]">
                        🔥 PRINCIPAL
                    </div>
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(204,255,0,0.06)_0%,transparent_70%)] pointer-events-none" />

                    {/* Category */}
                    <div className="text-[9px] tracking-[4px] text-neon font-bold uppercase font-display mb-2">
                        {drill.emoji} {drill.category.replace(/_/g, " ")}
                    </div>

                    {/* Title */}
                    <h2 className="font-display font-black text-2xl uppercase tracking-[-1px] leading-none mb-3 pr-20">
                        {drill.title}
                    </h2>

                    {/* Pills */}
                    <div className="flex gap-1.5 flex-wrap mb-3.5">
                        <span className="bg-white/[0.04] border border-ace-border rounded-lg px-2.5 py-[5px] text-[10px] font-semibold text-ace-mid flex items-center gap-1">
                            ⏱ {duration} min · {formatLabel.label}
                        </span>
                        <span className="bg-white/[0.04] border border-ace-border rounded-lg px-2.5 py-[5px] text-[10px] font-semibold text-ace-mid">
                            🎯 {drill.focus}
                        </span>
                        <span className="bg-white/[0.04] border border-ace-border rounded-lg px-2.5 py-[5px] text-[10px] font-semibold text-ace-mid">
                            +{drill.bonusPoints} pts
                        </span>
                    </div>

                    {/* Difficulty */}
                    <div className="flex items-center gap-1 mb-4">
                        <span className="text-[9px] tracking-[3px] text-ace-muted font-bold uppercase font-display">Dificuldade:</span>
                        <span className="text-neon text-sm tracking-wider">
                            {"★".repeat(drill.difficulty)}{"☆".repeat(5 - drill.difficulty)}
                        </span>
                    </div>

                    {/* Rules */}
                    <ul className="space-y-1">
                        {drill.rules.map((rule, i) => (
                            <li key={i} className="text-xs text-ace-mid leading-[1.5] flex gap-2.5 items-start py-1">
                                <span className="text-neon font-extrabold shrink-0 mt-[1px]">→</span>
                                {rule}
                            </li>
                        ))}
                    </ul>

                    {/* Victory Condition */}
                    <div className="mt-4 pt-3 border-t border-white/[0.04]">
                        <div className="text-[9px] tracking-[4px] text-ace-muted font-bold uppercase font-display mb-1.5">
                            🏆 Condição de Vitória
                        </div>
                        <p className="text-sm font-bold text-neon">{drill.victoryCondition}</p>
                    </div>

                    {/* Bonus */}
                    <div className="inline-flex items-center gap-1.5 mt-4 bg-neon/[0.08] border border-neon/20 rounded-lg px-3 py-1.5 text-[10px] font-extrabold text-neon font-display tracking-[1px]">
                        ⭐ +{drill.bonusPoints} PTS BÔNUS ESTA SEMANA
                    </div>
                </div>

                {/* Lore */}
                <div className="mx-5 mb-4 bg-ace-surface border border-ace-border rounded-2xl p-4">
                    <div className="text-[9px] tracking-[4px] text-ace-muted font-bold uppercase font-display mb-2">
                        📖 Sobre o Drill
                    </div>
                    <p className="text-[13px] text-ace-mid leading-[1.6] italic">
                        &ldquo;{drill.lore}&rdquo;
                    </p>
                </div>
            </div>

            {/* Sticky CTA */}
            <div className="sticky bottom-0 px-5 py-3 pb-[110px] bg-gradient-to-t from-background via-background to-transparent z-10">
                <button
                    onClick={() => router.push(`/log/${groupId}/${drillId}?duration=${duration}`)}
                    className="w-full h-[58px] bg-neon text-background rounded-[14px] font-display font-black text-[13px] tracking-[2.5px] uppercase flex items-center justify-center gap-2.5 transition-all duration-200 relative overflow-hidden shadow-[0_4px_24px_rgba(204,255,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-[0.96] active:shadow-[0_2px_12px_rgba(204,255,0,0.3)]"
                >
                    <span className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                    BORA PRO PLAY 🔥
                </button>
            </div>
        </div>
    );
}

export default function DrillDetailPage() {
    return (
        <Suspense fallback={<div className="h-full flex items-center justify-center text-ace-muted">Carregando...</div>}>
            <DrillContent />
        </Suspense>
    );
}
