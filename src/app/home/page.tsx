"use client";

import { useRouter } from "next/navigation";
import { CURRENT_USER, MOCK_LEADERBOARD, MOCK_FEED } from "@/lib/data";
import { getDrillOfTheWeek } from "@/lib/drills";

export default function HomePage() {
    const router = useRouter();
    const drillOfTheWeek = getDrillOfTheWeek();
    const userRank = MOCK_LEADERBOARD.findIndex(e => e.userId === CURRENT_USER.id) + 1;
    const userEntry = MOCK_LEADERBOARD.find(e => e.userId === CURRENT_USER.id);

    return (
        <div>
            {/* Hero Band */}
            <div className="bg-gradient-to-b from-[#0C1400] to-background px-5 py-5 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-[radial-gradient(ellipse,rgba(204,255,0,0.06)_0%,transparent_70%)] pointer-events-none" />

                {/* Avatar */}
                <div className="relative w-[84px] mx-auto mb-3">
                    <div
                        className="w-[84px] h-[84px] rounded-full bg-neon text-background font-display font-black text-[28px] flex items-center justify-center border-[3px] border-neon neon-glow-strong relative"
                    >
                        {CURRENT_USER.initials}
                        <div className="absolute inset-[-6px] rounded-full border-2 border-neon/15 animate-ring-pulse" />
                    </div>
                    <div className="absolute -bottom-[5px] -right-[10px] bg-ace-gold text-background text-[9px] font-extrabold px-2 py-1 rounded-lg whitespace-nowrap font-display tracking-[0.5px] shadow-[0_2px_12px_rgba(255,215,0,0.3)]">
                        MVP 🌟
                    </div>
                </div>

                <h2 className="font-display font-black text-2xl uppercase tracking-[-1px] mb-[3px]">
                    E aí, Campeão?
                </h2>
                <p className="text-[13px] text-ace-muted">Pronto pra mais uma?</p>
            </div>

            {/* CTA Main */}
            <div
                onClick={() => router.push("/home/play")}
                className="mx-5 my-4 bg-neon rounded-[20px] flex flex-col items-center justify-center py-7 px-5 cursor-pointer transition-all duration-200 relative overflow-hidden shadow-[0_6px_32px_rgba(204,255,0,0.25),0_0_0_1px_rgba(204,255,0,0.3)] active:scale-[0.97] active:shadow-[0_3px_16px_rgba(204,255,0,0.3)]"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.18] to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(0,0,0,0.12)_0%,transparent_60%)] pointer-events-none" />
                <span className="text-4xl mb-2 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)] animate-cta-bounce">🎾</span>
                <span className="font-display font-black text-[16px] tracking-[3px] uppercase text-background [text-shadow:0_1px_0_rgba(255,255,255,0.2)]">
                    Registrar Treinasso
                </span>
                <span className="text-[11px] font-semibold text-black/45 mt-1 tracking-[1px]">
                    Compete · Pontue · Suba no Ranking
                </span>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-2.5 px-5 mb-6">
                <div className="bg-ace-surface border border-ace-border rounded-2xl p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon to-neon/30" />
                    <div className="absolute top-0 left-0 w-[100px] h-[100px] bg-[radial-gradient(circle,rgba(204,255,0,0.04)_0%,transparent_70%)] pointer-events-none" />
                    <div className="text-[9px] tracking-[4px] uppercase font-bold text-ace-muted font-display mb-2">Ranking</div>
                    <div className="font-display font-black text-[38px] tracking-[-2px] leading-none">{userRank}°</div>
                    <div className="text-[11px] font-bold text-neon mt-1.5">↑ +8 pts hoje</div>
                </div>
                <div className="bg-ace-surface border border-ace-border rounded-2xl p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon to-neon/30" />
                    <div className="text-[9px] tracking-[4px] uppercase font-bold text-ace-muted font-display mb-2">Pontos</div>
                    <div className="font-display font-black text-[38px] tracking-[-2px] leading-none">{userEntry?.points || 0}</div>
                    <div className="text-[11px] font-bold text-ace-muted mt-1.5">Semana 3</div>
                </div>
            </div>

            {/* Drill of the Week */}
            <div className="px-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-black text-[13px] uppercase tracking-[1.5px] flex items-center gap-2">
                        🔥 Drill da Semana
                    </h3>
                </div>
                <div
                    onClick={() => router.push(`/drill/group-coxos/${drillOfTheWeek.id}`)}
                    className="bg-gradient-to-br from-neon/5 to-neon/[0.01] border-[1.5px] border-neon/20 rounded-2xl p-5 cursor-pointer relative overflow-hidden transition-all duration-200 active:scale-[0.98]"
                >
                    <div className="absolute top-0 right-0 bg-neon text-background font-display text-[8px] font-black tracking-[2px] uppercase px-3.5 py-[5px] rounded-[0_16px_0_12px] shadow-[0_2px_8px_rgba(204,255,0,0.2)]">
                        🔥 PRINCIPAL
                    </div>
                    <div className="text-[9px] tracking-[4px] text-neon font-bold uppercase font-display mb-2">
                        {drillOfTheWeek.emoji} {drillOfTheWeek.category.replace(/_/g, " ")}
                    </div>
                    <h4 className="font-display font-black text-2xl uppercase tracking-[-1px] leading-none mb-3 pr-20">
                        {drillOfTheWeek.title}
                    </h4>
                    <div className="flex gap-1.5 flex-wrap mb-3.5">
                        <span className="bg-white/[0.04] border border-ace-border rounded-lg px-2.5 py-[5px] text-[10px] font-semibold text-ace-mid flex items-center gap-1">
                            ⏱ {drillOfTheWeek.durationMinutes} min
                        </span>
                        <span className="bg-white/[0.04] border border-ace-border rounded-lg px-2.5 py-[5px] text-[10px] font-semibold text-ace-mid">
                            ⭐ {"★".repeat(drillOfTheWeek.difficulty)}
                        </span>
                        <span className="bg-white/[0.04] border border-ace-border rounded-lg px-2.5 py-[5px] text-[10px] font-semibold text-ace-mid">
                            +{drillOfTheWeek.bonusPoints} pts
                        </span>
                    </div>
                    <p className="text-xs text-ace-mid leading-[1.5]">
                        {drillOfTheWeek.shortDescription}
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-3 bg-neon/[0.08] border border-neon/20 rounded-lg px-3 py-1.5 text-[10px] font-extrabold text-neon font-display tracking-[1px]">
                        ⭐ +{drillOfTheWeek.bonusPoints} PTS BÔNUS ESTA SEMANA
                    </div>
                </div>
            </div>

            {/* Feed Header */}
            <div className="flex items-center justify-between px-5 mb-3">
                <h3 className="font-display font-black text-[13px] uppercase tracking-[1.5px] flex items-center gap-2">
                    💬 Últimas do Grupo
                </h3>
                <span className="font-display text-[11px] font-bold text-neon tracking-[1px] uppercase cursor-pointer">
                    Ver tudo
                </span>
            </div>

            {/* Feed Cards */}
            {MOCK_FEED.map((item, i) => (
                <div
                    key={item.id}
                    className="mx-5 mb-3 bg-ace-surface border border-ace-border rounded-2xl overflow-hidden animate-card-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                >
                    {/* Card Top */}
                    <div className="flex items-center gap-3 px-4 pt-3.5 pb-2.5">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-display font-black text-xs shrink-0 border-2 border-white/[0.08]"
                            style={{ background: item.player.gradient, color: item.player.textColor }}
                        >
                            {item.player.initials}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-sm">{item.player.displayName}</div>
                            <div className="text-[11px] text-ace-muted mt-0.5">{item.timestamp}</div>
                        </div>
                        {item.score && (
                            <div className="bg-neon text-background font-display font-black text-xs tracking-[1px] px-3 py-1.5 rounded-lg shadow-[0_2px_8px_rgba(204,255,0,0.15)]">
                                {item.score}
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <div
                        className="px-4 pb-3 text-[13px] text-ace-mid leading-[1.6] [&_strong]:text-neon [&_strong]:font-bold"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                    />

                    {/* Reactions */}
                    {item.reactions && (
                        <div className="flex gap-2 px-4 py-2.5 border-t border-white/[0.04]">
                            {item.reactions.map((r) => (
                                <button
                                    key={r.label}
                                    className="flex-1 h-9 bg-ace-surface2 border border-ace-border rounded-lg text-[11px] font-bold text-ace-mid font-display tracking-[0.5px] flex items-center justify-center gap-[5px] transition-all duration-200 active:border-neon active:text-neon active:scale-95 active:bg-neon/5"
                                >
                                    {r.emoji} {r.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {/* Scheduled Match */}
            <div className="mx-5 mb-6 bg-ace-surface border border-ace-border rounded-2xl p-3.5 flex items-center gap-3 animate-card-in [animation-delay:0.15s]">
                <div className="flex">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] border-2 border-background shrink-0 font-display" style={{ background: "linear-gradient(135deg, #B388FF, #4527A0)", color: "#fff" }}>AN</div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] border-2 border-background shrink-0 font-display -ml-2" style={{ background: "linear-gradient(135deg, #FF6E40, #BF360C)", color: "#fff" }}>PE</div>
                </div>
                <div className="flex-1">
                    <div className="font-bold text-[13px]">Ana vs Pedro</div>
                    <div className="text-[11px] text-ace-muted mt-[3px]">Agendado amanhã, 19h</div>
                </div>
                <div className="w-[34px] h-[34px] bg-ace-surface2 rounded-[10px] flex items-center justify-center text-base">📅</div>
            </div>
        </div>
    );
}
