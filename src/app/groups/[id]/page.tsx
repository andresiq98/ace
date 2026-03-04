"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getGroup, getGroupLeaderboard, Group, LeaderboardEntry } from "@/lib/firestore-service";

function GroupRankingContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const groupId = params.id as string;

    const [group, setGroup] = useState<Group | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    useEffect(() => {
        async function fetchGroupData() {
            if (!groupId) return;
            try {
                const groupData = await getGroup(groupId);
                setGroup(groupData);
                const lbData = await getGroupLeaderboard(groupId);
                setLeaderboard(lbData);
            } catch (error) {
                console.error("Error fetching group data:", error);
            } finally {
                setIsLoadingData(false);
            }
        }
        if (groupId) fetchGroupData();
    }, [groupId]);

    if (loading || !user || isLoadingData) return <div className="h-full bg-background flex flex-col items-center justify-center text-ace-muted"><div className="w-6 h-6 border-2 border-neon/30 border-t-neon rounded-full animate-spin mb-4" /><div>Carregando arena...</div></div>;
    if (!group) return <div className="h-full bg-background flex items-center justify-center text-ace-muted">Grupo não encontrado</div>;

    const podiumData = leaderboard.slice(0, 3);
    const restData = leaderboard.slice(3);

    const myIndex = leaderboard.findIndex(entry => entry.userId === user?.uid);
    const myRank = myIndex >= 0 ? myIndex + 1 : '-';
    const myData = myIndex >= 0 ? leaderboard[myIndex] : null;

    return (
        <div className="flex flex-col h-full bg-background text-foreground relative overflow-hidden overflow-y-auto w-full max-w-md mx-auto no-scrollbar">
            {/* Topbar */}
            <div className="flex items-center justify-between px-5 pt-12 pb-3 sticky top-0 bg-background/90 backdrop-blur-xl z-50 border-b border-white/[0.04]">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center text-xl text-foreground font-black active:scale-95 transition-transform"
                >
                    ←
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-[18px] h-[18px] bg-white rounded-full relative">
                        <div className="absolute inset-0 border-[2px] border-neon rounded-full scale-125 opacity-30 animate-pulse" />
                    </div>
                    <span className="font-display font-black text-xs tracking-[1px] text-foreground">ACE</span>
                </div>
                <button className="text-xl w-10 h-10 flex items-center justify-end active:scale-95 transition-transform">⚙️</button>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-ace-surface2 to-background px-5 pt-4 pb-6 relative overflow-hidden shrink-0 border-b border-white/[0.04]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[radial-gradient(ellipse,rgba(204,255,0,0.06)_0%,transparent_70%)] pointer-events-none" />

                {/* Group Info */}
                <div className="flex items-center justify-between mb-5 relative z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 bg-neon rounded-full shadow-[0_0_12px_rgba(204,255,0,0.3)]" />
                        <div className="text-sm font-bold text-foreground tracking-tight">{group.name}</div>
                    </div>
                </div>

                {/* User Card */}
                {myData && (
                    <div className="bg-ace-surface border border-neon/20 rounded-2xl p-4 px-5 flex items-center gap-4 relative overflow-hidden z-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-neon before:shadow-[0_0_12px_rgba(204,255,0,0.4)]">
                        <div className="font-display font-black text-[38px] tracking-[-2.5px] leading-none text-neon">{myRank}°</div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-[15px] truncate text-foreground">{myData.displayName}</div>
                            <div className="text-[11px] text-ace-mid mt-0.5 tracking-wide font-medium">{myData.gamesPlayed} jogos · {myData.wins}V {myData.losses}D · você</div>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="font-display text-[24px] font-black text-neon tracking-[-1px] leading-none mb-0.5">{myData.points}</div>
                            <span className="text-[10px] font-bold text-ace-muted uppercase tracking-[1px] block">pts</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Podium */}
            {leaderboard.length >= 3 && (
                <div className="flex items-end justify-center px-4 pt-8 pb-6 relative z-10 shrink-0">
                    {/* 3rd Place */}
                    <div className="text-center flex-1 z-10 relative px-1">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center font-display font-black mx-auto border-2 border-white/10 text-sm overflow-hidden"
                            style={{ background: podiumData[2]?.gradient, color: podiumData[2]?.textColor }}
                        >
                            {podiumData[2]?.photoURL ? <img src={podiumData[2].photoURL} alt="" className="w-full h-full object-cover" /> : podiumData[2]?.initials}
                        </div>
                        <div className="text-[11px] font-bold mt-2 truncate px-1 text-foreground">{podiumData[2]?.displayName.split(" ")[0]}</div>
                        <div className="text-[10px] text-[#CD7F32] font-display font-black mt-0.5">{podiumData[2]?.points} pts</div>
                        <div className="w-full bg-ace-surface border-t border-x border-[#CD7F32]/20 rounded-t-xl flex items-center justify-center mt-2 h-[45px] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#CD7F32]/5 to-transparent" />
                            <span className="font-display font-black tracking-[-1px] text-[16px] text-[#CD7F32] relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">3°</span>
                        </div>
                    </div>

                    {/* 1st Place */}
                    <div className="text-center flex-1 z-20 relative -mx-2 -mt-4">
                        <div className="text-[20px] text-center mb-1 animate-bounce drop-shadow-[0_4px_8px_rgba(255,215,0,0.3)]">🏆</div>
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center font-display font-black mx-auto border-2 border-[#FFD700]/50 text-[18px] shadow-[0_0_24px_rgba(255,215,0,0.25)] overflow-hidden"
                            style={{ background: podiumData[0]?.gradient, color: podiumData[0]?.textColor }}
                        >
                            {podiumData[0]?.photoURL ? <img src={podiumData[0].photoURL} alt="" className="w-full h-full object-cover" /> : podiumData[0]?.initials}
                        </div>
                        <div className="text-[12px] font-extrabold mt-2 truncate px-1 text-[#FFD700]">{podiumData[0]?.displayName.split(" ")[0]}</div>
                        <div className="text-[11px] text-[#FFD700] font-display font-black mt-0.5 drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">{podiumData[0]?.points} pts</div>
                        <div className="w-full bg-ace-surface border-t border-x border-[#FFD700]/30 rounded-t-xl flex items-start pt-2 justify-center mt-2 h-[65px] relative overflow-hidden shadow-[0_-8px_24px_rgba(0,0,0,0.15)]">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/10 to-transparent" />
                            <span className="font-display font-black tracking-[-1.5px] text-[20px] text-[#FFD700] relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">1°</span>
                        </div>
                    </div>

                    {/* 2nd Place */}
                    <div className="text-center flex-1 z-10 relative px-1">
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center font-display font-black mx-auto border-2 border-white/10 text-[15px] overflow-hidden"
                            style={{ background: podiumData[1]?.gradient, color: podiumData[1]?.textColor }}
                        >
                            {podiumData[1]?.photoURL ? <img src={podiumData[1].photoURL} alt="" className="w-full h-full object-cover" /> : podiumData[1]?.initials}
                        </div>
                        <div className="text-[11px] font-bold mt-2 truncate px-1 text-foreground">{podiumData[1]?.displayName.split(" ")[0]}</div>
                        <div className="text-[10px] text-[#A1A1AA] font-display font-black mt-0.5">{podiumData[1]?.points} pts</div>
                        <div className="w-full bg-ace-surface border-t border-x border-[#A1A1AA]/20 rounded-t-xl flex items-center justify-center mt-2 h-[55px] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#A1A1AA]/5 to-transparent" />
                            <span className="font-display font-black tracking-[-1px] text-[16px] text-[#A1A1AA] relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">2°</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Chips */}
            <div className="flex gap-2 px-5 py-2 sticky top-[72px] bg-background/95 backdrop-blur-md z-40 border-y border-white/[0.04]">
                <button className="px-4 py-2 rounded-xl font-display text-[10px] font-black tracking-[1px] uppercase border-[1.5px] border-neon text-neon bg-neon/[0.04] transition-all cursor-pointer">Geral</button>
            </div>

            {/* Full List */}
            <div className="px-5 py-2">
                <div className="flex flex-col">
                    {restData.map((player, index) => {
                        const rank = index + 4;
                        const isLast = rank === leaderboard.length && leaderboard.length > 5;

                        return (
                            <div key={player.userId} className={`flex items-center gap-3.5 py-4 border-b border-white/[0.04] last:border-0 relative ${player.userId === user?.uid ? "bg-white/[0.02] -mx-5 px-5" : ""}`}>
                                <div className={`font-display font-black text-[18px] w-[26px] text-center shrink-0 ${isLast ? 'text-ace-error group-last-indicator' : 'text-ace-muted'}`}>
                                    {rank}
                                </div>
                                <div
                                    className="w-11 h-11 rounded-full flex items-center justify-center font-display font-black text-[13px] shrink-0 relative overflow-hidden"
                                    style={{ background: player.gradient, color: player.textColor }}
                                >
                                    {player.photoURL ? <img src={player.photoURL} alt="" className="w-full h-full object-cover" /> : player.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-[14px] truncate text-foreground">
                                        {player.displayName}
                                    </div>
                                    <div className={`text-[10px] mt-0.5 font-medium ${isLast ? 'text-ace-error font-bold tracking-wide uppercase font-display text-[9px]' : 'text-ace-mid'}`}>
                                        {isLast ? '🏮 Guardião da Lanterna' : `${player.gamesPlayed} jogos · ${player.wins}V ${player.losses}D`}
                                    </div>
                                </div>
                                <div className={`font-display font-black text-[16px] tracking-[-0.5px] ${isLast ? 'text-ace-error' : 'text-foreground'}`}>
                                    {player.points}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Group Invite Code */}
            <div className="mx-5 mt-4 mb-24 bg-ace-surface border border-ace-border rounded-2xl p-4 px-5 flex items-center justify-between shadow-sm shrink-0">
                <div>
                    <div className="text-[11px] font-bold text-foreground mb-0.5">Convide amigos</div>
                    <div className="text-[10px] text-ace-mid">Compartilhe o código</div>
                </div>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(group.inviteCode);
                        alert("Código copiado!");
                    }}
                    className="font-display font-black text-[18px] tracking-[4px] text-neon px-3 py-1.5 bg-neon/[0.06] rounded-lg active:scale-95 transition-transform"
                >
                    {group.inviteCode}
                </button>
            </div>
        </div>
    );
}

export default function GroupRankingPage() {
    return (
        <Suspense fallback={<div className="h-full bg-background flex items-center justify-center text-ace-muted"><div className="w-6 h-6 border-2 border-neon/30 border-t-neon rounded-full animate-spin" /></div>}>
            <GroupRankingContent />
        </Suspense>
    );
}
