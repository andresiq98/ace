"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { getUserGroups, getGroupLeaderboard, type Group, type LeaderboardEntry } from "@/lib/firestore-service";

export default function RankingPage() {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) loadData();
    }, [user]);

    const loadData = async () => {
        if (!user) return;
        try {
            const groups = await getUserGroups(user.uid);
            if (groups.length > 0) {
                setGroup(groups[0]);
                const lb = await getGroupLeaderboard(groups[0].id);
                setLeaderboard(lb);
            }
        } catch (err) {
            console.error("[ACE] Failed to load ranking:", err);
        } finally {
            setLoading(false);
        }
    };

    const getBadgeEmoji = (pos: number) => {
        if (pos === 1) return "🏆";
        if (pos === leaderboard.length && leaderboard.length > 1) return "🏮";
        return null;
    };

    const getPosColor = (pos: number) => {
        if (pos === 1) return "text-ace-gold [text-shadow:0_0_12px_rgba(255,215,0,0.3)]";
        if (pos === 2) return "text-[#C0C0C0]";
        if (pos === 3) return "text-[#CD7F32]";
        if (pos === leaderboard.length && leaderboard.length > 1) return "text-destructive";
        return "text-ace-mid";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-[#CCFF00]/30 border-t-[#CCFF00] rounded-full animate-spin" />
            </div>
        );
    }

    if (leaderboard.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="font-montserrat font-black text-lg uppercase mb-2">Ranking Vazio</h3>
                <p className="text-sm text-[#A1A1AA]">Jogue uma partida para aparecer no ranking!</p>
            </div>
        );
    }

    const myIdx = leaderboard.findIndex(e => e.userId === user?.uid);
    const myEntry = myIdx >= 0 ? leaderboard[myIdx] : null;

    return (
        <div>
            {/* Hero */}
            <div className="bg-gradient-to-b from-[#0C1400] to-background px-5 py-5 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[radial-gradient(ellipse,rgba(204,255,0,0.05)_0%,transparent_70%)] pointer-events-none" />

                {/* Group info */}
                <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-[7px] h-[7px] bg-neon rounded-full shadow-[0_0_8px_rgba(204,255,0,0.25)] animate-blink" />
                    <span className="text-[13px] font-semibold text-ace-mid">{group?.name || "Sem grupo"}</span>
                    <span className="ml-auto bg-neon/[0.06] border border-neon/15 rounded-lg px-3 py-[5px] text-[11px] font-bold text-neon font-display tracking-[1px]">
                        {leaderboard.length} jogadores
                    </span>
                </div>

                {/* My Position Card */}
                {myEntry && (
                    <div className="bg-ace-surface border border-neon/20 rounded-2xl p-4 px-[18px] flex items-center gap-3.5 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-neon shadow-[0_0_12px_rgba(204,255,0,0.25)]" />
                        <div className="absolute inset-0 bg-gradient-to-br from-neon/[0.03] to-transparent pointer-events-none" />
                        <div className="font-display font-black text-[42px] tracking-[-3px] leading-none text-neon pl-3 neon-text-glow">
                            {myIdx + 1}°
                        </div>
                        <div>
                            <div className="font-bold text-[15px]">{myEntry.displayName}</div>
                            <div className="text-[11px] text-ace-muted mt-[3px]">
                                {myEntry.gamesPlayed} jogos · {myEntry.wins}V {myEntry.losses}D · você
                            </div>
                        </div>
                        <div className="ml-auto text-right">
                            <div className="font-display text-xl font-black text-neon tracking-[-1px]">{myEntry.points}</div>
                            <span className="text-[10px] font-semibold text-ace-muted">pts</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Ranking List */}
            <div className="px-5 pt-4">
                <h3 className="font-display font-extrabold text-[10px] tracking-[5px] uppercase text-ace-muted mb-3.5">
                    Ranking Semanal
                </h3>

                {leaderboard.map((entry, i) => {
                    const pos = i + 1;
                    const isMe = entry.userId === user?.uid;
                    const badge = getBadgeEmoji(pos);

                    return (
                        <div
                            key={entry.userId}
                            className={`flex items-center gap-3 py-3.5 border-b border-white/[0.04] transition-all duration-200 animate-card-in ${isMe ? "bg-neon/[0.03] rounded-xl px-3 -mx-3 border-b-0 border border-neon/[0.08]" : ""
                                }`}
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            {/* Position */}
                            <div className={`font-display font-black text-xl w-7 text-center shrink-0 ${getPosColor(pos)}`}>
                                {pos}
                            </div>

                            {/* Avatar */}
                            <div
                                className="w-11 h-11 rounded-full flex items-center justify-center font-display font-black text-[13px] shrink-0 relative"
                                style={{ background: entry.gradient, color: entry.textColor }}
                            >
                                {entry.photoURL ? (
                                    <img src={entry.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    entry.initials
                                )}
                                {badge && (
                                    <div className="absolute -bottom-1 -right-1 text-xs w-5 h-5 bg-background rounded-full flex items-center justify-center border border-ace-border">
                                        {badge}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm">
                                    {entry.displayName} {isMe && "← você"}
                                </div>
                                <div className={`text-[10px] mt-[3px] ${entry.badge === "champion" ? "text-neon font-bold" :
                                    entry.badge === "lantern" ? "text-destructive font-bold" :
                                        "text-ace-muted"
                                    }`}>
                                    {entry.badge === "champion" && "🏆 CAMPEÃO DA SEMANA"}
                                    {entry.badge === "lantern" && "🏮 GUARDIÃO DA LANTERNA"}
                                    {!entry.badge && `${entry.gamesPlayed} jogo${entry.gamesPlayed > 1 ? "s" : ""}`}
                                </div>
                            </div>

                            {/* Points */}
                            <div className={`font-display font-black text-[17px] tracking-[-1px] ${entry.badge === "lantern" ? "text-destructive" : "text-neon"
                                }`}>
                                {entry.points}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Invite Code */}
            {group && (
                <div className="mx-5 mt-5 mb-6 bg-ace-surface border border-ace-border rounded-2xl p-4 px-[18px] flex items-center justify-between">
                    <div className="text-xs text-ace-muted">📨 Código do grupo</div>
                    <div className="font-display font-black text-lg tracking-[5px] text-neon neon-text-glow">
                        {group.inviteCode}
                    </div>
                </div>
            )}
        </div>
    );
}
