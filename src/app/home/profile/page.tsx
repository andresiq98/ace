"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserGroups, getGroupLeaderboard, type Group, type LeaderboardEntry } from "@/lib/firestore-service";

export default function ProfilePage() {
    const { user, userProfile, logout } = useAuth();
    const router = useRouter();
    const [groups, setGroups] = useState<Group[]>([]);
    const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);
    const [myRank, setMyRank] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) loadData();
    }, [user]);

    const loadData = async () => {
        if (!user) return;
        try {
            const userGroups = await getUserGroups(user.uid);
            setGroups(userGroups);
            if (userGroups.length > 0) {
                const lb = await getGroupLeaderboard(userGroups[0].id);
                const idx = lb.findIndex(e => e.userId === user.uid);
                if (idx >= 0) {
                    setMyEntry(lb[idx]);
                    setMyRank(idx + 1);
                }
            }
        } catch (err) {
            console.error("[ACE] Failed to load profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const displayName = userProfile?.displayName || user?.displayName || "Jogador";
    const initials = userProfile?.initials || displayName.substring(0, 2).toUpperCase();

    return (
        <div>
            {/* Hero */}
            <div className="bg-gradient-to-b from-[#0C1400] to-background px-5 py-5 pb-7 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-[radial-gradient(ellipse,rgba(204,255,0,0.06)_0%,transparent_60%)] pointer-events-none" />

                {/* Avatar */}
                <div className="relative w-[92px] mx-auto mb-3.5">
                    <div
                        className="w-[92px] h-[92px] rounded-full font-display font-black text-[32px] flex items-center justify-center border-[3px] border-neon neon-glow-strong relative overflow-hidden"
                        style={{
                            background: userProfile?.gradient || "#CCFF00",
                            color: userProfile?.textColor || "#000"
                        }}
                    >
                        {userProfile?.photoURL ? (
                            <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
                        ) : (
                            initials
                        )}
                        <div className="absolute inset-[-8px] rounded-full border-2 border-neon/[0.12] animate-ring-pulse" />
                    </div>
                </div>

                <h2 className="font-display font-black text-[26px] uppercase tracking-[-1px] mb-[3px]">
                    {displayName}
                </h2>
                <p className="text-[10px] text-ace-muted font-extrabold tracking-[2.5px] uppercase font-display">
                    {myRank > 0 ? `${myRank}° no ranking` : "Sem ranking ainda"}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 px-5 mb-6">
                <div className="bg-ace-surface border border-ace-border rounded-2xl p-4 px-2.5 text-center relative overflow-hidden">
                    <div className="w-7 h-[2px] bg-neon mx-auto mb-3 rounded-sm shadow-[0_0_8px_rgba(204,255,0,0.3)]" />
                    <div className="font-display font-black text-[32px] tracking-[-1px] leading-none text-neon neon-text-glow">
                        {myEntry?.points || userProfile?.totalPoints || 0}
                    </div>
                    <div className="text-[9px] tracking-[2.5px] uppercase font-bold text-ace-muted mt-1.5 font-display">
                        Pontos
                    </div>
                </div>
                <div className="bg-ace-surface border border-ace-border rounded-2xl p-4 px-2.5 text-center relative overflow-hidden">
                    <div className="w-7 h-[2px] bg-neon mx-auto mb-3 rounded-sm shadow-[0_0_8px_rgba(204,255,0,0.3)]" />
                    <div className="font-display font-black text-[32px] tracking-[-1px] leading-none text-neon neon-text-glow">
                        {myEntry?.wins || userProfile?.totalWins || 0}
                    </div>
                    <div className="text-[9px] tracking-[2.5px] uppercase font-bold text-ace-muted mt-1.5 font-display">
                        Vitórias
                    </div>
                </div>
                <div className="bg-ace-surface border border-ace-border rounded-2xl p-4 px-2.5 text-center relative overflow-hidden">
                    <div className="w-7 h-[2px] bg-neon mx-auto mb-3 rounded-sm shadow-[0_0_8px_rgba(204,255,0,0.3)]" />
                    <div className="font-display font-black text-[32px] tracking-[-1px] leading-none text-neon neon-text-glow">
                        {myEntry?.losses || userProfile?.totalLosses || 0}
                    </div>
                    <div className="text-[9px] tracking-[2.5px] uppercase font-bold text-ace-muted mt-1.5 font-display">
                        Derrotas
                    </div>
                </div>
            </div>

            {/* My Groups */}
            <div className="text-[9px] tracking-[5px] uppercase font-bold text-ace-muted font-display px-5 mb-3">
                Meus Grupos
            </div>
            {groups.length === 0 && !loading && (
                <div className="mx-5 mb-2.5 text-center p-4 text-sm text-[#A1A1AA]">
                    Nenhum grupo encontrado. Crie ou entre em um!
                </div>
            )}
            {groups.map(g => (
                <div
                    key={g.id}
                    onClick={() => router.push(`/groups/${g.id}`)}
                    className="mx-5 mb-2.5 bg-ace-surface border border-ace-border rounded-2xl p-4 px-[18px] flex items-center gap-3.5 cursor-pointer transition-all duration-200 active:border-neon active:scale-[0.98]"
                >
                    <div className="w-12 h-12 bg-ace-surface2 border-2 border-neon rounded-[14px] flex items-center justify-center text-[22px] shrink-0 shadow-[0_0_12px_rgba(204,255,0,0.08)]">
                        🎾
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-[15px]">{g.name}</div>
                        <div className="text-[11px] text-ace-muted mt-[3px]">{g.memberCount} jogadores</div>
                    </div>
                    <div className="font-display font-black text-sm text-neon bg-neon/[0.06] px-2.5 py-[5px] rounded-lg tracking-[0.5px]">
                        →
                    </div>
                </div>
            ))}

            {/* Actions */}
            <div className="px-5 pt-5 pb-8 space-y-2.5">
                <button
                    onClick={() => router.push("/groups")}
                    className="w-full h-[58px] bg-neon text-background rounded-[14px] font-display font-black text-[13px] tracking-[2.5px] uppercase flex items-center justify-center gap-2.5 transition-all duration-200 relative overflow-hidden shadow-[0_4px_24px_rgba(204,255,0,0.2)] active:scale-[0.96]"
                >
                    <span className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                    + CRIAR / ENTRAR EM GRUPO
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full h-[52px] bg-transparent border-[1.5px] border-destructive/25 rounded-xl font-display text-xs font-extrabold tracking-[1.5px] uppercase text-destructive cursor-pointer transition-all duration-200 active:border-destructive active:bg-destructive/5"
                >
                    SAIR DA CONTA
                </button>
            </div>
        </div>
    );
}
