"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getScheduledMatch, updateScheduledMatchStatus, ScheduledMatch } from "@/lib/firestore-service";

function AcceptContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const groupId = params.groupId as string;
    const matchId = params.id as string;

    const [matchData, setMatchData] = useState<ScheduledMatch | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [actionState, setActionState] = useState<"idle" | "loading" | "accepted" | "declined">("idle");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    useEffect(() => {
        async function loadMatch() {
            if (!groupId || !matchId) return;
            try {
                const data = await getScheduledMatch(groupId, matchId);
                setMatchData(data);
                if (data && data.status !== "pending") {
                    setActionState(data.status as any);
                }
            } catch (error) {
                console.error("Failed to load match", error);
            } finally {
                setIsLoadingData(false);
            }
        }
        loadMatch();
    }, [groupId, matchId]);

    const handleAccept = async () => {
        if (!matchData) return;
        setActionState("loading");
        try {
            await updateScheduledMatchStatus(groupId, matchId, "accepted");
            setActionState("accepted");

            // Build Google Calendar Link
            const title = `ACE: ${matchData.challengerName} x ${matchData.rivalName}`;
            const details = `Partida de tênis ACE\n\nDesafiante: ${matchData.challengerName}\nAdversário: ${matchData.rivalName}`;

            const [datePart, timePart] = matchData.date.split("T");
            const safeDate = datePart.replace(/-/g, "");
            const safeTime = timePart.replace(/:/g, "") + "00";

            // For end time, add 1 hour roughly
            let endHour = parseInt(timePart.split(":")[0]) + 1;
            let endSafeTime = endHour.toString().padStart(2, "0") + timePart.split(":")[1] + "00";

            const dates = `${safeDate}T${safeTime}/${safeDate}T${endSafeTime}`;

            const url = new URL("https://calendar.google.com/calendar/render");
            url.searchParams.append("action", "TEMPLATE");
            url.searchParams.append("text", title);
            url.searchParams.append("details", details);
            url.searchParams.append("location", matchData.location);
            url.searchParams.append("dates", dates);

            // Open Calendar in new tab
            window.open(url.toString(), "_blank");
        } catch (error) {
            console.error("Error accepting match", error);
            alert("Erro ao aceitar o jogo.");
            setActionState("idle");
        }
    };

    const handleDecline = async () => {
        if (!matchData) return;
        setActionState("loading");
        try {
            await updateScheduledMatchStatus(groupId, matchId, "declined");
            setActionState("declined");
        } catch (error) {
            console.error("Error declining match", error);
            alert("Erro ao recusar o jogo.");
            setActionState("idle");
        }
    };

    if (loading || !user || isLoadingData) {
        return (
            <div className="h-full bg-background flex flex-col items-center justify-center text-ace-muted">
                <div className="w-6 h-6 border-2 border-neon/30 border-t-neon rounded-full animate-spin mb-4" />
                <div>Carregando...</div>
            </div>
        );
    }

    if (!matchData) {
        return (
            <div className="h-full bg-background flex flex-col items-center justify-center p-5 text-center">
                <div className="text-4xl mb-4">🤷</div>
                <h2 className="font-display font-black text-xl text-foreground mb-2">Jogo não encontrado</h2>
                <p className="text-ace-mid text-sm mb-6">O link pode estar quebrado ou o jogo foi cancelado.</p>
                <button
                    onClick={() => router.push("/home")}
                    className="h-12 px-6 bg-white text-black font-display font-black uppercase text-sm rounded-xl"
                >
                    Ir para Home
                </button>
            </div>
        );
    }

    const isRival = user.uid === matchData.rivalId;
    const isChallenger = user.uid === matchData.challengerId;
    const [datePart, timePart] = matchData.date.split("T");
    const [year, month, day] = datePart.split("-");

    return (
        <div className="flex flex-col h-full bg-background text-foreground relative overflow-hidden max-w-md mx-auto">
            {/* Topbar */}
            <div className="flex items-center justify-between px-5 pt-12 pb-4 border-b border-white/[0.04]">
                <button
                    onClick={() => router.push("/home")}
                    className="w-10 h-10 flex items-center justify-center text-xl text-foreground font-black active:scale-95 transition-transform -ml-2"
                >
                    ←
                </button>
                <div className="header-brand">ACE</div>
                <div className="w-10" />
            </div>

            <div className="px-5 py-8 flex-1 overflow-y-auto no-scrollbar flex flex-col">

                <div className="text-center mb-10">
                    <div className="text-5xl mb-4 animate-bounce">🎾</div>
                    <h1 className="font-display font-black text-[32px] uppercase tracking-[-1px] leading-none mb-2">
                        NOVO <span className="text-neon">DESAFIO</span>
                    </h1>
                    <p className="text-ace-mid text-sm">
                        {isRival
                            ? `${matchData.challengerName.split(" ")[0]} te desafiou para um jogo!`
                            : isChallenger
                                ? "Você desafiou " + matchData.rivalName.split(" ")[0]
                                : `${matchData.challengerName.split(" ")[0]} desafiou ${matchData.rivalName.split(" ")[0]}`
                        }
                    </p>
                </div>

                <div className="bg-ace-surface border border-neon/20 rounded-3xl p-6 relative shadow-[0_8px_32px_rgba(204,255,0,0.05)]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border border-neon/20 px-4 py-1.5 rounded-full">
                        <span className="font-display font-black text-[10px] text-neon uppercase tracking-[2px]">
                            {actionState === "accepted" ? "CONFRONTO CONFIRMADO" : actionState === "declined" ? "RECUSADO" : "PENDENTE"}
                        </span>
                    </div>

                    <div className="flex flex-col gap-6 mt-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-ace-muted uppercase font-bold tracking-wider">Desafiante</span>
                            <span className="font-bold text-foreground">{matchData.challengerName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-ace-muted uppercase font-bold tracking-wider">Adversário</span>
                            <span className="font-bold text-foreground">{matchData.rivalName}</span>
                        </div>
                        <div className="h-px bg-white/[0.04] w-full" />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-ace-muted uppercase font-bold tracking-wider">Data</span>
                            <span className="font-bold text-neon">{day}/{month}/{year}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-ace-muted uppercase font-bold tracking-wider">Hora</span>
                            <span className="font-bold text-neon">{timePart}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-ace-muted uppercase font-bold tracking-wider">Local</span>
                            <span className="font-bold text-foreground text-right max-w-[150px] truncate">{matchData.location}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-8 flex flex-col gap-3">
                    {(actionState === "idle" || actionState === "loading") && isRival && (
                        <>
                            <button
                                onClick={handleAccept}
                                disabled={actionState === "loading"}
                                className="h-[58px] bg-neon text-black font-display font-black uppercase tracking-[1.5px] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(204,255,0,0.15)] w-full"
                            >
                                <span className="text-xl">📅</span>
                                Aceitar e Add na Agenda
                            </button>
                            <button
                                onClick={handleDecline}
                                disabled={actionState === "loading"}
                                className="h-[52px] bg-transparent border-[1.5px] border-ace-border text-foreground font-display font-black uppercase tracking-[1.5px] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] w-full"
                            >
                                <span className="text-lg">✖️</span>
                                Recusar
                            </button>
                        </>
                    )}

                    {actionState === "accepted" && (
                        <div className="text-center p-4 bg-neon/10 border border-neon/20 rounded-xl text-neon font-bold text-sm">
                            Jogo confirmado! Preparado pra amassar?
                        </div>
                    )}

                    {actionState === "declined" && (
                        <div className="text-center p-4 bg-ace-error/10 border border-ace-error/20 rounded-xl text-ace-error font-bold text-sm">
                            O jogo foi recusado.
                        </div>
                    )}

                    {!isRival && (actionState === "idle" || actionState === "loading") && (
                        <div className="text-center p-4 bg-white/5 border border-white/10 rounded-xl text-ace-mid font-medium text-sm">
                            Aguardando a confirmação do adversário.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AcceptPage() {
    return (
        <Suspense fallback={<div className="h-full bg-background flex items-center justify-center text-ace-muted"><div className="w-6 h-6 border-2 border-neon/30 border-t-neon rounded-full animate-spin" /></div>}>
            <AcceptContent />
        </Suspense>
    );
}
