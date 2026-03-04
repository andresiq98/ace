"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getGroupLeaderboard, getUserProfile, UserProfile } from "@/lib/firestore-service";

function CelebrationContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useSearchParams();

    const groupId = params.get("groupId");
    const drillId = params.get("drillId");
    const score = params.get("score") || "6×2";
    const winnerId = params.get("winner");
    const rivalId = params.get("rival");
    const duration = params.get("duration");
    const rankBeforeParam = params.get("rankBefore");
    const points = params.get("points") || "10";

    const [rankAfter, setRankAfter] = useState<number | null>(null);
    const [rivalProfile, setRivalProfile] = useState<UserProfile | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const didWin = winnerId === user?.uid;

    useEffect(() => {
        if (!loading && !user) router.push("/");
    }, [user, loading, router]);

    useEffect(() => {
        async function loadData() {
            if (!user || !groupId || !rivalId) return;
            try {
                // 1. Fetch updated leaderboard to find new rank
                const lb = await getGroupLeaderboard(groupId);
                const myIdx = lb.findIndex(m => m.userId === user.uid);
                if (myIdx >= 0) {
                    setRankAfter(myIdx + 1);
                }

                // 2. Fetch rival profile for display name
                const rivalInfo = await getUserProfile(rivalId);
                setRivalProfile(rivalInfo);

            } catch (err) {
                console.error("Failed to load celebration data:", err);
            } finally {
                setIsLoadingData(false);
            }
        }
        if (user && groupId && rivalId) {
            loadData();
        } else if (!loading) {
            setIsLoadingData(false);
        }
    }, [user, groupId, rivalId, loading]);

    if (loading || !user || isLoadingData) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><div className="w-6 h-6 border-2 border-[#CCFF00]/30 border-t-[#CCFF00] rounded-full animate-spin" /></div>;

    const rankBefore = rankBeforeParam && rankBeforeParam !== '-' ? parseInt(rankBeforeParam, 10) : rankAfter;
    const rivalName = rivalProfile?.displayName || "Rival";

    return (
        <div className="flex flex-col h-full bg-black text-white relative overflow-hidden items-center justify-center px-8">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.06)_0%,transparent_60%)] pointer-events-none" />

            <div className="text-center relative z-10 w-full animate-slide-up">
                {/* Emoji + Title */}
                <div className="text-[60px] mb-3 animate-bounce">{didWin ? "🏆" : "🎾"}</div>
                <h1 className="font-display font-black text-4xl uppercase tracking-tight mb-2">
                    {didWin ? "VITÓRIA!" : "BOA LUTA!"}
                </h1>
                <div className="text-[12px] text-neon font-extrabold tracking-[3px] uppercase mb-5">
                    +{points} PONTOS NO RANKING
                </div>

                {/* Score */}
                <div className="font-display font-black text-[52px] tracking-[-3px] text-neon drop-shadow-[0_0_40px_rgba(204,255,0,0.25)] mb-2">
                    {score}
                </div>
                <div className="text-[13px] text-ace-muted mb-6">
                    {didWin ? `${user.displayName?.split(" ")[0] || "Você"} venceu ${rivalName.split(" ")[0]}` : `${rivalName.split(" ")[0]} venceu`}
                </div>

                {/* Rank Change */}
                {rankBefore && rankAfter && (
                    <div className="inline-flex items-center gap-5 bg-ace-surface border border-ace-border rounded-xl px-6 py-3 mb-8">
                        <div className="text-center">
                            <div className="text-[10px] text-ace-muted mb-1 uppercase tracking-[1px] font-display font-bold">Antes</div>
                            <div className="font-display font-black text-2xl">{rankBefore}°</div>
                        </div>
                        <div className="text-lg text-neon">
                            {rankAfter < rankBefore ? "↗" : rankAfter > rankBefore ? "↘" : "→"}
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-neon mb-1 uppercase tracking-[1px] font-display font-bold">Agora</div>
                            <div className="font-display font-black text-2xl text-neon">{rankAfter}°</div>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col gap-3 w-[220px] mx-auto">
                    <button
                        onClick={() => {
                            if (!groupId || !drillId) return router.push("/home");
                            // Navigate to the real share card
                            const query = new URLSearchParams({
                                score: score,
                                winner: winnerId || "",
                                rival: rivalId || "",
                                duration: duration || "60",
                            }).toString();
                            router.push(`/share/${groupId}/${drillId}?${query}`);
                        }}
                        className="w-full h-[48px] bg-neon text-background font-display font-black text-[13px] tracking-[2px] uppercase rounded-xl transition-all duration-200 active:scale-95 shadow-[0_4px_20px_rgba(204,255,0,0.2)] flex items-center justify-center gap-2"
                    >
                        📤 COMPARTILHAR
                    </button>
                    <button
                        onClick={() => router.push("/home")}
                        className="w-full h-[48px] bg-transparent border-2 border-ace-border rounded-xl flex items-center justify-center font-display text-xs font-bold tracking-[1px] text-white transition-all duration-200 active:scale-95 active:border-neon"
                    >
                        Voltar à Arena
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CelebrationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white"><div className="w-6 h-6 border-2 border-[#CCFF00]/30 border-t-[#CCFF00] rounded-full animate-spin" /></div>}>
            <CelebrationContent />
        </Suspense>
    );
}
