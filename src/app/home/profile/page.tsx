"use client";

import { CURRENT_USER, MOCK_LEADERBOARD } from "@/lib/data";

export default function ProfilePage() {
    const userEntry = MOCK_LEADERBOARD.find(e => e.userId === CURRENT_USER.id);

    const badges = [
        { emoji: "🏆", name: "Campeão", when: "Atual", type: "gold" as const },
        { emoji: "🏆", name: "Campeão", when: "Sem. passada", type: "gold" as const },
        { emoji: "🏮", name: "Lanterna", when: "Semana -2", type: "red" as const },
    ];

    return (
        <div>
            {/* Hero */}
            <div className="bg-gradient-to-b from-[#0C1400] to-background px-5 py-5 pb-7 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-[radial-gradient(ellipse,rgba(204,255,0,0.06)_0%,transparent_60%)] pointer-events-none" />

                {/* Avatar */}
                <div className="relative w-[92px] mx-auto mb-3.5">
                    <div className="w-[92px] h-[92px] rounded-full bg-neon text-background font-display font-black text-[32px] flex items-center justify-center border-[3px] border-neon neon-glow-strong relative">
                        {CURRENT_USER.initials}
                        <div className="absolute inset-[-8px] rounded-full border-2 border-neon/[0.12] animate-ring-pulse" />
                    </div>
                    <div className="absolute -bottom-[5px] -right-[10px] bg-ace-gold text-background text-[9px] font-extrabold px-2.5 py-1 rounded-lg font-display tracking-[0.5px] whitespace-nowrap shadow-[0_2px_12px_rgba(255,215,0,0.3)]">
                        MVP 🌟
                    </div>
                </div>

                <h2 className="font-display font-black text-[26px] uppercase tracking-[-1px] mb-[3px]">
                    {CURRENT_USER.displayName}
                </h2>
                <p className="text-[10px] text-ace-gold font-extrabold tracking-[2.5px] uppercase font-display neon-text-glow">
                    🏆 Campeão da Semana
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 px-5 mb-6">
                <div className="bg-ace-surface border border-ace-border rounded-2xl p-4 px-2.5 text-center relative overflow-hidden">
                    <div className="w-7 h-[2px] bg-neon mx-auto mb-3 rounded-sm shadow-[0_0_8px_rgba(204,255,0,0.3)]" />
                    <div className="font-display font-black text-[32px] tracking-[-1px] leading-none text-neon neon-text-glow">
                        {userEntry?.points || 0}
                    </div>
                    <div className="text-[9px] tracking-[2.5px] uppercase font-bold text-ace-muted mt-1.5 font-display">
                        Pts Semana
                    </div>
                </div>
                <div className="bg-ace-surface border border-ace-border rounded-2xl p-4 px-2.5 text-center relative overflow-hidden">
                    <div className="w-7 h-[2px] bg-neon mx-auto mb-3 rounded-sm shadow-[0_0_8px_rgba(204,255,0,0.3)]" />
                    <div className="font-display font-black text-[32px] tracking-[-1px] leading-none text-neon neon-text-glow">
                        {userEntry?.wins || 0}
                    </div>
                    <div className="text-[9px] tracking-[2.5px] uppercase font-bold text-ace-muted mt-1.5 font-display">
                        Vitórias
                    </div>
                </div>
                <div className="bg-ace-surface border border-ace-border rounded-2xl p-4 px-2.5 text-center relative overflow-hidden">
                    <div className="w-7 h-[2px] bg-neon mx-auto mb-3 rounded-sm shadow-[0_0_8px_rgba(204,255,0,0.3)]" />
                    <div className="font-display font-black text-[32px] tracking-[-1px] leading-none text-neon neon-text-glow">
                        {userEntry?.losses || 0}
                    </div>
                    <div className="text-[9px] tracking-[2.5px] uppercase font-bold text-ace-muted mt-1.5 font-display">
                        Derrotas
                    </div>
                </div>
            </div>

            {/* Badges */}
            <div className="text-[9px] tracking-[5px] uppercase font-bold text-ace-muted font-display px-5 mb-3">
                Badges da Semana
            </div>
            <div className="grid grid-cols-3 gap-2 px-5 mb-6">
                {badges.map((b, i) => (
                    <div
                        key={i}
                        className={`rounded-2xl p-4 px-2.5 text-center ${b.type === "gold"
                                ? "bg-ace-gold/[0.04] border border-ace-gold/15"
                                : "bg-destructive/[0.04] border border-destructive/10 opacity-40"
                            }`}
                    >
                        <div className="text-[28px] mb-1.5">{b.emoji}</div>
                        <div className={`text-[8px] font-extrabold tracking-[1.5px] uppercase font-display ${b.type === "gold" ? "text-ace-gold" : "text-destructive"
                            }`}>
                            {b.name}
                        </div>
                        <div className="text-[9px] text-ace-muted mt-[3px]">{b.when}</div>
                    </div>
                ))}
            </div>

            {/* My Groups */}
            <div className="text-[9px] tracking-[5px] uppercase font-bold text-ace-muted font-display px-5 mb-3">
                Meus Grupos
            </div>
            <div className="mx-5 mb-2.5 bg-ace-surface border border-ace-border rounded-2xl p-4 px-[18px] flex items-center gap-3.5 cursor-pointer transition-all duration-200 active:border-neon active:scale-[0.98]">
                <div className="w-12 h-12 bg-ace-surface2 border-2 border-neon rounded-[14px] flex items-center justify-center text-[22px] shrink-0 shadow-[0_0_12px_rgba(204,255,0,0.08)]">
                    🎾
                </div>
                <div className="flex-1">
                    <div className="font-bold text-[15px]">Clube dos Coxos</div>
                    <div className="text-[11px] text-ace-muted mt-[3px]">6 jogadores · Zoeira 🔥</div>
                </div>
                <div className="font-display font-black text-sm text-neon bg-neon/[0.06] px-2.5 py-[5px] rounded-lg tracking-[0.5px]">
                    2°
                </div>
            </div>

            {/* Actions */}
            <div className="px-5 pt-5 pb-8 space-y-2.5">
                <button className="w-full h-[58px] bg-neon text-background rounded-[14px] font-display font-black text-[13px] tracking-[2.5px] uppercase flex items-center justify-center gap-2.5 transition-all duration-200 relative overflow-hidden shadow-[0_4px_24px_rgba(204,255,0,0.2)] active:scale-[0.96]">
                    <span className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                    + CRIAR / ENTRAR EM GRUPO
                </button>
                <button className="w-full h-[52px] bg-transparent border-[1.5px] border-destructive/25 rounded-xl font-display text-xs font-extrabold tracking-[1.5px] uppercase text-destructive cursor-pointer transition-all duration-200 active:border-destructive active:bg-destructive/5">
                    SAIR DA CONTA
                </button>
            </div>
        </div>
    );
}
