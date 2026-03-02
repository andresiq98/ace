"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserGroups, getGroupLeaderboard, type Group, type LeaderboardEntry } from "@/lib/firestore-service";

export default function HomePage() {
    const { user, userProfile, logout, loading } = useAuth();
    const router = useRouter();
    const [groups, setGroups] = useState<Group[]>([]);
    const [myRank, setMyRank] = useState<number | null>(null);
    const [myPoints, setMyPoints] = useState<number>(0);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
            return;
        }
        if (user) {
            loadUserData();
        }
    }, [user, loading]);

    const loadUserData = async () => {
        if (!user) return;
        try {
            const userGroups = await getUserGroups(user.uid);
            setGroups(userGroups);

            // Get rank from first group
            if (userGroups.length > 0) {
                const leaderboard = await getGroupLeaderboard(userGroups[0].id);
                const myIdx = leaderboard.findIndex(e => e.userId === user.uid);
                if (myIdx >= 0) {
                    setMyRank(myIdx + 1);
                    setMyPoints(leaderboard[myIdx].points);
                }
            }
        } catch (err) {
            console.error("[ACE] Failed to load user data:", err);
        } finally {
            setLoadingData(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                Carregando...
            </div>
        );
    }

    // If user has no groups, redirect to group selection
    if (!loadingData && groups.length === 0) {
        router.push("/groups");
        return null;
    }

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const displayName = userProfile?.displayName || user.displayName || "Jogador";
    const initials = userProfile?.initials || displayName.substring(0, 2).toUpperCase();
    const gradient = userProfile?.gradient || "linear-gradient(135deg, #CCFF00, #A8D400)";

    return (
        <div className="flex flex-col h-full bg-black text-white relative overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 pt-8 pb-4 relative z-10 w-full">
                <div className="flex items-center gap-2">
                    <div className="w-[18px] h-[18px] bg-white rounded-full relative">
                        <div className="absolute inset-0 border-[2px] border-[#CCFF00] rounded-full scale-125 opacity-30 animate-pulse" />
                    </div>
                    <span className="font-montserrat font-black text-xs tracking-[1px] text-white">ACE</span>
                </div>
                <div className="flex gap-4">
                    <button className="text-xl">🔔</button>
                    <button className="text-xl">👤</button>
                </div>
            </div>

            {/* Welcome Banner */}
            <div className="px-5 py-4 w-full relative z-10 flex flex-col mt-4">
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="w-12 h-12 rounded-full relative font-montserrat font-black text-sm flex items-center justify-center border-2 border-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.2)]"
                        style={{ background: gradient, color: userProfile?.textColor || "#000" }}
                    >
                        {userProfile?.photoURL ? (
                            <img src={userProfile.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                </div>

                <h2 className="font-montserrat font-black text-2xl uppercase tracking-tight mb-1 text-white">
                    E AÍ, {displayName.split(" ")[0].toUpperCase()}!
                </h2>
                <p className="text-sm text-[#A1A1AA]">Pronto pra mais uma?</p>
            </div>

            {/* Main CTA */}
            <div
                onClick={() => router.push('/home/play')}
                className="px-5 mt-4 z-10 w-full relative group cursor-pointer active:scale-95 transition-transform"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[#18181B] to-[#111113] rounded-2xl border border-[#27272A] opacity-90 backdrop-blur-md" />
                <div className="relative p-5 py-8 flex flex-col items-center">
                    <div className="text-4xl mb-3 animate-[cta-bounce_2s_ease-in-out_infinite]">🎾</div>
                    <h3 className="font-montserrat font-black text-lg uppercase tracking-wide text-white mb-1">BORA PRO PLAY</h3>
                    <p className="text-[11px] text-[#A1A1AA] font-bold tracking-widest uppercase text-center">Compete · Pontue · Suba no Ranking</p>
                </div>
            </div>

            {/* Stats Preview */}
            <div
                onClick={() => groups.length > 0 ? router.push(`/groups/${groups[0].id}`) : null}
                className="flex gap-2 px-5 mt-5 z-10 w-full relative cursor-pointer active:scale-95 transition-transform"
            >
                <div className="flex-1 bg-[#111113] border border-[#27272A] rounded-xl p-4">
                    <p className="text-[10px] text-[#52525B] font-bold tracking-[2px] uppercase mb-2">Ranking</p>
                    <p className="font-montserrat font-black text-2xl text-white mb-1">
                        {myRank ? `${myRank}°` : "—"}
                    </p>
                    <p className="text-[10px] text-[#CCFF00] font-bold">
                        {groups.length > 0 ? groups[0].name : "Sem grupo"}
                    </p>
                </div>
                <div className="flex-1 bg-[#111113] border border-[#27272A] rounded-xl p-4">
                    <p className="text-[10px] text-[#52525B] font-bold tracking-[2px] uppercase mb-2">Pontos</p>
                    <p className="font-montserrat font-black text-2xl text-white mb-1">{myPoints}</p>
                    <p className="text-[10px] text-[#A1A1AA] font-bold">
                        {userProfile?.totalGamesPlayed || 0} jogos
                    </p>
                </div>
            </div>

            <div className="mt-8 px-5 z-10 text-center pb-12">
                <button onClick={handleLogout} className="text-[#EF4444] text-xs font-bold font-montserrat tracking-widest uppercase underline p-4">Sair do App</button>
            </div>
        </div>
    );
}
