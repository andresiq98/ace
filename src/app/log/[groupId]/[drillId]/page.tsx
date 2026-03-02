"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getDrillById } from "@/lib/drills";
import { getScoreOptions, calculatePoints, DURATION_FORMAT } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import { getUserGroups, getGroupLeaderboard, recordMatch, type LeaderboardEntry, type Group } from "@/lib/firestore-service";
import { ArrowLeft } from "lucide-react";

function LogContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, userProfile } = useAuth();
    const drillId = params.drillId as string;
    const groupId = params.groupId as string;
    const drillRaw = getDrillById(drillId);
    const isSetNormal = drillId === "set-normal";
    const drill = drillRaw || (isSetNormal ? { id: "set-normal", title: "Set Normal", emoji: "🎾", shortDescription: "Jogo livre", mode: "competitive" as const, category: "free_play", rules: [], victoryCondition: "Quem ganhar o set", lore: "Jogo livre sem regras especiais", focus: "Jogo livre", durationMinutes: 60, difficulty: 1, bonusPoints: 0, shareTemplate: { winMessage: "Ganhei!", loseMessage: "Quase...", caricaturePrompt: "" } } : null);

    const duration = parseInt(searchParams.get("duration") || "60", 10);
    const scoreOptions = getScoreOptions(duration);
    const formatLabel = DURATION_FORMAT[duration] || DURATION_FORMAT[60];

    const [members, setMembers] = useState<LeaderboardEntry[]>([]);
    const [group, setGroup] = useState<Group | null>(null);
    const [selectedRival, setSelectedRival] = useState<string | null>(null);
    const [winnerId, setWinnerId] = useState<string | null>(null);
    const [selectedScore, setSelectedScore] = useState<string | null>(null);
    const [mvpId, setMvpId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [loadingMembers, setLoadingMembers] = useState(true);

    useEffect(() => {
        if (user) loadMembers();
    }, [user, groupId]);

    const loadMembers = async () => {
        try {
            // If groupId is a real Firestore ID, load from there
            // Otherwise try the user's first group
            let targetGroupId = groupId;
            if (groupId === "test-group" || groupId === "group-coxos") {
                const groups = await getUserGroups(user!.uid);
                if (groups.length > 0) {
                    targetGroupId = groups[0].id;
                    setGroup(groups[0]);
                }
            } else {
                // Load group info
                const groups = await getUserGroups(user!.uid);
                const g = groups.find(g => g.id === groupId);
                if (g) setGroup(g);
            }

            const lb = await getGroupLeaderboard(targetGroupId);
            // Filter out current user
            setMembers(lb.filter(m => m.userId !== user!.uid));
        } catch (err) {
            console.error("[ACE] Failed to load members:", err);
        } finally {
            setLoadingMembers(false);
        }
    };

    const rivalEntry = members.find(m => m.userId === selectedRival);
    const canSave = winnerId && selectedScore && selectedRival && !saving;

    const iWon = winnerId === user?.uid;
    const isMvp = mvpId === user?.uid;
    const pts = calculatePoints(iWon, isMvp, 1, false, false, duration);

    const handleSave = async () => {
        if (!canSave || !user || !userProfile || !rivalEntry || !group) return;

        setSaving(true);
        try {
            const loserId = winnerId === user.uid ? selectedRival! : user.uid;
            const winnerName = winnerId === user.uid ? userProfile.displayName : rivalEntry.displayName;
            const loserName = winnerId === user.uid ? rivalEntry.displayName : userProfile.displayName;

            const winnerPts = calculatePoints(true, mvpId === winnerId, 1, false, false, duration);
            const loserPts = calculatePoints(false, mvpId === loserId, 1, false, false, duration);

            await recordMatch(group.id, {
                groupId: group.id,
                drillId: drill!.id,
                drillTitle: drill!.title,
                drillEmoji: drill!.emoji,
                winnerId: winnerId!,
                loserId,
                winnerName,
                loserName,
                score: selectedScore!,
                duration,
                mode: (drill!.mode || "competitive") as "competitive" | "cooperative",
                mvpId: mvpId || undefined,
                pointsAwarded: [
                    { userId: winnerId!, points: winnerPts.total, breakdown: winnerPts.breakdown },
                    { userId: loserId, points: loserPts.total, breakdown: loserPts.breakdown },
                ],
            });

            console.log("[ACE] Match recorded successfully!");
            router.push(`/share/${group.id}/${drill!.id}?score=${selectedScore}&winner=${winnerId}&rival=${selectedRival}&duration=${duration}`);
        } catch (err: any) {
            console.error("[ACE] Failed to record match:", err);
            alert(`Erro ao salvar resultado: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (!drill) return <div className="h-full flex items-center justify-center text-ace-muted">Drill não encontrado</div>;

    return (
        <div className="h-full flex flex-col">
            {/* Top Bar */}
            <header className="flex items-center justify-between px-5 pt-14 pb-3.5 sticky top-0 bg-background/92 backdrop-blur-[24px] saturate-[180%] z-50 border-b border-white/[0.04]">
                <button
                    onClick={() => router.back()}
                    className="w-[38px] h-[38px] bg-ace-surface2 border border-ace-border rounded-[10px] flex items-center justify-center transition-all duration-200 active:scale-[0.88] active:bg-neon active:text-background active:border-neon"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="font-display font-extrabold text-xs tracking-[3px] uppercase text-ace-mid">Resultado</div>
                <div className="w-[38px]" />
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
                {/* Title */}
                <div className="px-5 pt-3 pb-3.5">
                    <h1 className="font-display font-black text-[38px] uppercase tracking-[-2px] leading-[0.92]">
                        REGISTRAR<br /><span className="text-neon neon-text-glow">RESULTADO</span>
                    </h1>
                </div>

                {/* Duration/Format Badge */}
                <div className="px-5 mb-5">
                    <div className="inline-flex items-center gap-2 bg-neon/[0.06] border border-neon/15 rounded-xl px-3.5 py-2">
                        <span className="text-neon text-base">⏱</span>
                        <div>
                            <div className="font-display font-bold text-[11px] text-neon tracking-[1px]">{formatLabel.label}</div>
                            <div className="text-[10px] text-ace-muted">{duration} min · {formatLabel.setsLabel}</div>
                        </div>
                    </div>
                </div>

                {/* Step 1: Select Rival */}
                <div className="font-display text-[9px] tracking-[5px] uppercase font-bold text-ace-muted px-5 mb-3">
                    1. Escolha o Rival
                </div>
                {loadingMembers ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-[#CCFF00]/30 border-t-[#CCFF00] rounded-full animate-spin" />
                    </div>
                ) : members.length === 0 ? (
                    <div className="px-5 py-4 text-center text-sm text-[#A1A1AA]">
                        Nenhum rival no grupo ainda. Convide amigos!
                    </div>
                ) : (
                    <div className="flex gap-2.5 px-5 overflow-x-auto no-scrollbar mb-6 pb-1">
                        {members.map((m) => (
                            <button
                                key={m.userId}
                                onClick={() => setSelectedRival(m.userId)}
                                className="flex flex-col items-center gap-2 cursor-pointer shrink-0 transition-all duration-250"
                            >
                                <div
                                    className={`w-14 h-14 rounded-full flex items-center justify-center font-display font-black text-base border-[2.5px] transition-all duration-250 overflow-hidden ${selectedRival === m.userId
                                        ? "border-neon shadow-[0_0_20px_rgba(204,255,0,0.3)] scale-[1.08]"
                                        : "border-ace-border"
                                        }`}
                                    style={{ background: m.gradient, color: m.textColor }}
                                >
                                    {m.photoURL ? (
                                        <img src={m.photoURL} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        m.initials
                                    )}
                                </div>
                                <span className={`text-[11px] font-semibold ${selectedRival === m.userId ? "text-neon" : "text-ace-muted"
                                    }`}>
                                    {m.displayName.split(" ")[0]}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {/* VS Display */}
                {selectedRival && userProfile && (
                    <div className="flex items-center justify-center gap-4 px-5 pb-6 animate-slide-up">
                        <div className="text-center flex-1">
                            <div
                                className="w-[62px] h-[62px] rounded-full mx-auto mb-2.5 flex items-center justify-center font-display font-black text-xl border-[2.5px] border-neon overflow-hidden"
                                style={{ background: userProfile.gradient, color: userProfile.textColor }}
                            >
                                {userProfile.photoURL ? (
                                    <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    userProfile.initials
                                )}
                            </div>
                            <div className="font-bold text-sm">{userProfile.displayName.split(" ")[0]}</div>
                            <div className="text-[10px] text-neon font-bold mt-[3px] tracking-[1px]">VOCÊ</div>
                        </div>
                        <div className="font-display font-black text-xl text-ace-muted tracking-[2px]">VS</div>
                        <div className="text-center flex-1">
                            <div
                                className="w-[62px] h-[62px] rounded-full mx-auto mb-2.5 flex items-center justify-center font-display font-black text-xl border-[2.5px] border-ace-border overflow-hidden"
                                style={{ background: rivalEntry?.gradient, color: rivalEntry?.textColor }}
                            >
                                {rivalEntry?.photoURL ? (
                                    <img src={rivalEntry.photoURL} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    rivalEntry?.initials
                                )}
                            </div>
                            <div className="font-bold text-sm">{rivalEntry?.displayName.split(" ")[0]}</div>
                        </div>
                    </div>
                )}

                {/* Step 2: Who Won */}
                {selectedRival && userProfile && (
                    <>
                        <div className="font-display text-[9px] tracking-[5px] uppercase font-bold text-ace-muted px-5 mb-3.5">
                            2. Quem Ganhou?
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 px-5 mb-7">
                            <button
                                onClick={() => setWinnerId(user!.uid)}
                                className={`bg-ace-surface border-2 rounded-2xl p-5 text-center cursor-pointer transition-all duration-250 active:scale-[0.96] ${winnerId === user!.uid ? "border-neon bg-neon/[0.04]" : "border-ace-border"
                                    }`}
                            >
                                <div
                                    className="w-12 h-12 rounded-full mx-auto mb-2.5 flex items-center justify-center font-display font-black text-base overflow-hidden"
                                    style={{ background: userProfile.gradient, color: userProfile.textColor }}
                                >
                                    {userProfile.photoURL ? (
                                        <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        userProfile.initials
                                    )}
                                </div>
                                <div className={`font-extrabold text-[15px] font-display uppercase tracking-[0.3px] ${winnerId === user!.uid ? "text-neon" : ""}`}>
                                    {userProfile.displayName.split(" ")[0]}
                                </div>
                                <div className="text-[10px] text-ace-muted mt-[3px]">você</div>
                            </button>
                            <button
                                onClick={() => setWinnerId(selectedRival)}
                                className={`bg-ace-surface border-2 rounded-2xl p-5 text-center cursor-pointer transition-all duration-250 active:scale-[0.96] ${winnerId === selectedRival ? "border-neon bg-neon/[0.04]" : "border-ace-border"
                                    }`}
                            >
                                <div
                                    className="w-12 h-12 rounded-full mx-auto mb-2.5 flex items-center justify-center font-display font-black text-base overflow-hidden"
                                    style={{ background: rivalEntry?.gradient, color: rivalEntry?.textColor }}
                                >
                                    {rivalEntry?.photoURL ? (
                                        <img src={rivalEntry.photoURL} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        rivalEntry?.initials
                                    )}
                                </div>
                                <div className={`font-extrabold text-[15px] font-display uppercase tracking-[0.3px] ${winnerId === selectedRival ? "text-neon" : ""}`}>
                                    {rivalEntry?.displayName.split(" ")[0]}
                                </div>
                            </button>
                        </div>
                    </>
                )}

                {/* Step 3: Score */}
                {winnerId && (
                    <>
                        <div className="font-display text-[9px] tracking-[5px] uppercase font-bold text-ace-muted px-5 mb-1.5">
                            3. Placar
                        </div>
                        <div className="text-[10px] text-ace-mid px-5 mb-3.5">
                            {formatLabel.setsLabel} · {duration} min
                        </div>
                        <div className={`grid gap-2 px-5 mb-7 ${duration === 90 ? "grid-cols-2" : "grid-cols-3"}`}>
                            {scoreOptions.map((score) => (
                                <button
                                    key={score}
                                    onClick={() => setSelectedScore(score)}
                                    className={`h-[52px] bg-ace-surface border-2 rounded-xl flex items-center justify-center font-display font-black cursor-pointer transition-all duration-200 tracking-[0.5px] active:scale-[0.94] ${duration === 90 ? "text-xs" : "text-sm"
                                        } ${selectedScore === score
                                            ? "border-neon bg-neon/[0.06] text-neon shadow-[0_0_12px_rgba(204,255,0,0.1)]"
                                            : "border-ace-border text-ace-mid"
                                        }`}
                                >
                                    {score}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* Step 4: MVP */}
                {selectedScore && userProfile && (
                    <>
                        <div className="font-display text-[9px] tracking-[5px] uppercase font-bold text-ace-muted px-5 mb-3.5">
                            4. MVP do Jogo (opcional)
                        </div>
                        <div className="flex gap-2.5 px-5 overflow-x-auto no-scrollbar mb-6">
                            <button
                                onClick={() => setMvpId(null)}
                                className={`shrink-0 bg-ace-surface border-2 rounded-3xl px-4 py-2 flex items-center gap-2 font-display text-xs font-bold cursor-pointer transition-all duration-200 active:scale-95 ${mvpId === null ? "border-ace-border text-ace-mid" : "border-transparent text-ace-muted"
                                    }`}
                            >
                                Sem MVP
                            </button>
                            <button
                                onClick={() => setMvpId(user!.uid)}
                                className={`shrink-0 bg-ace-surface border-2 rounded-3xl px-4 py-2 flex items-center gap-2 font-display text-xs font-bold cursor-pointer transition-all duration-200 active:scale-95 ${mvpId === user!.uid ? "border-ace-gold text-ace-gold bg-ace-gold/[0.06]" : "border-ace-border text-ace-muted"
                                    }`}
                            >
                                <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 overflow-hidden" style={{ background: userProfile.gradient, color: userProfile.textColor }}>
                                    {userProfile.photoURL ? <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" /> : userProfile.initials}
                                </div>
                                {userProfile.displayName.split(" ")[0]}
                            </button>
                            {rivalEntry && (
                                <button
                                    onClick={() => setMvpId(selectedRival)}
                                    className={`shrink-0 bg-ace-surface border-2 rounded-3xl px-4 py-2 flex items-center gap-2 font-display text-xs font-bold cursor-pointer transition-all duration-200 active:scale-95 ${mvpId === selectedRival ? "border-ace-gold text-ace-gold bg-ace-gold/[0.06]" : "border-ace-border text-ace-muted"
                                        }`}
                                >
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 overflow-hidden" style={{ background: rivalEntry.gradient, color: rivalEntry.textColor }}>
                                        {rivalEntry.photoURL ? <img src={rivalEntry.photoURL} alt="" className="w-full h-full object-cover" /> : rivalEntry.initials}
                                    </div>
                                    {rivalEntry.displayName.split(" ")[0]}
                                </button>
                            )}
                        </div>
                    </>
                )}

                {/* Points Preview */}
                {selectedScore && (
                    <div className="flex flex-wrap gap-2 px-5 mb-6">
                        {pts.breakdown.map((item, i) => (
                            <div key={i} className="flex items-center gap-[5px] bg-neon/[0.06] border border-neon/15 rounded-lg px-3 py-1.5 text-[11px] font-extrabold text-neon font-display">
                                {item}
                            </div>
                        ))}
                    </div>
                )}

                {/* Save Button */}
                <div className="px-5">
                    <button
                        disabled={!canSave}
                        onClick={handleSave}
                        className="w-full h-[58px] bg-neon text-background rounded-[14px] font-display font-black text-[13px] tracking-[2.5px] uppercase flex items-center justify-center gap-2.5 transition-all duration-200 relative overflow-hidden shadow-[0_4px_24px_rgba(204,255,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-[0.96] disabled:opacity-25 disabled:pointer-events-none disabled:shadow-none"
                    >
                        <span className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                        {saving ? "SALVANDO..." : "SALVAR RESULTADO"}
                    </button>
                </div>
                <div className="h-5" />
            </div>
        </div>
    );
}

export default function LogResultPage() {
    return (
        <Suspense fallback={<div className="h-full flex items-center justify-center text-ace-muted">Carregando...</div>}>
            <LogContent />
        </Suspense>
    );
}
