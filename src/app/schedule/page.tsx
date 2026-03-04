"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getUserGroups, getGroupLeaderboard, createScheduledMatch, Group, LeaderboardEntry } from "@/lib/firestore-service";

function ScheduleContent() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string>("");
    const [rivals, setRivals] = useState<LeaderboardEntry[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        rivalId: "",
        date: "",
        time: "",
        location: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    useEffect(() => {
        async function loadInitialData() {
            if (!user) return;
            try {
                const userGroups = await getUserGroups(user.uid);
                setGroups(userGroups);
                if (userGroups.length > 0) {
                    setSelectedGroupId(userGroups[0].id);
                }
            } catch (err) {
                console.error("Failed to load user groups:", err);
            } finally {
                setIsLoadingData(false);
            }
        }
        loadInitialData();
    }, [user]);

    useEffect(() => {
        async function loadRivals() {
            if (!selectedGroupId || !user) return;
            const lbData = await getGroupLeaderboard(selectedGroupId);
            // Filter out the current user
            setRivals(lbData.filter(entry => entry.userId !== user.uid));
        }
        loadRivals();
    }, [selectedGroupId, user]);

    if (loading || !user || isLoadingData) {
        return (
            <div className="h-full bg-background flex flex-col items-center justify-center text-ace-muted">
                <div className="w-6 h-6 border-2 border-neon/30 border-t-neon rounded-full animate-spin mb-4" />
                <div>Carregando...</div>
            </div>
        );
    }

    if (groups.length === 0) {
        return (
            <div className="h-full bg-background flex flex-col items-center justify-center p-5 text-center">
                <div className="text-4xl mb-4 text-ace-muted">🎾</div>
                <h2 className="font-display font-black text-xl text-foreground mb-2">Nenhum grupo</h2>
                <p className="text-ace-mid text-sm mb-6">Você precisa estar em um grupo para marcar jogos.</p>
                <button
                    onClick={() => router.push("/groups")}
                    className="h-12 px-6 bg-white text-black font-display font-black uppercase text-sm rounded-xl"
                >
                    Procurar Grupos
                </button>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.rivalId || !formData.date || !formData.time || !formData.location) {
            alert("Preencha todos os campos!");
            return;
        }

        const rival = rivals.find(r => r.userId === formData.rivalId);
        if (!rival) return;

        setIsSubmitting(true);
        try {
            // Create match
            const matchData = {
                groupId: selectedGroupId,
                challengerId: user.uid,
                challengerName: user.displayName || "Jogador",
                rivalId: rival.userId,
                rivalName: rival.displayName,
                date: `${formData.date}T${formData.time}`, // Store ISO date/time prefix
                location: formData.location
            };

            const newMatch = await createScheduledMatch(selectedGroupId, matchData);

            // Construct Deeplink URL
            const domain = window.location.host;
            const acceptLink = `https://${domain}/accept/${selectedGroupId}/${newMatch.id}`;
            const [year, month, day] = formData.date.split("-");

            const shareText = `🎾 *DESAFIO ACE* 🎾\n\nE aí ${rival.displayName.split(" ")[0]}, bora pro play?\n\n📅 Data: ${day}/${month}/${year}\n⏰ Hora: ${formData.time}\n📍 Local: ${formData.location}\n\n🏆 Aceita o desafio? Confirme aqui e já add na agenda:\n${acceptLink}`;

            window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");

            // Redirect back home after scheduling
            router.push("/home");
        } catch (error) {
            console.error("Failed to schedule match:", error);
            alert("Erro ao marcar jogo. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background text-foreground relative overflow-hidden overflow-y-auto max-w-md mx-auto no-scrollbar">
            {/* Topbar */}
            <div className="flex items-center px-5 pt-12 pb-4 sticky top-0 bg-background/90 backdrop-blur-xl z-50 border-b border-white/[0.04]">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center text-xl text-foreground font-black active:scale-95 transition-transform -ml-2"
                >
                    ←
                </button>
                <h1 className="font-display font-black text-[20px] uppercase tracking-[-1px] leading-none ml-2">
                    MARCAR <span className="text-neon">JOGO</span>
                </h1>
            </div>

            <div className="px-5 py-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm">

                    {groups.length > 1 && (
                        <div className="flex flex-col gap-2">
                            <label className="font-display font-black uppercase text-[11px] text-ace-mid tracking-[1px]">Grupo</label>
                            <select
                                value={selectedGroupId}
                                onChange={(e) => setSelectedGroupId(e.target.value)}
                                className="h-[52px] bg-ace-surface border border-ace-border rounded-xl px-4 text-foreground font-medium outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all"
                            >
                                {groups.map(g => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="font-display font-black uppercase text-[11px] text-ace-mid tracking-[1px]">Adversário</label>
                        <select
                            value={formData.rivalId}
                            onChange={(e) => setFormData({ ...formData, rivalId: e.target.value })}
                            className="h-[52px] bg-ace-surface border border-ace-border rounded-xl px-4 text-foreground font-medium outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all"
                            required
                        >
                            <option value="" disabled>Selecione um jogador</option>
                            {rivals.map(r => (
                                <option key={r.userId} value={r.userId}>{r.displayName} ({r.points} pts)</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-display font-black uppercase text-[11px] text-ace-mid tracking-[1px]">Data</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="h-[52px] bg-ace-surface border border-ace-border rounded-xl px-4 text-foreground font-medium outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all [color-scheme:dark]"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-display font-black uppercase text-[11px] text-ace-mid tracking-[1px]">Hora</label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="h-[52px] bg-ace-surface border border-ace-border rounded-xl px-4 text-foreground font-medium outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all [color-scheme:dark]"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-display font-black uppercase text-[11px] text-ace-mid tracking-[1px]">Local</label>
                        <input
                            type="text"
                            placeholder="Ex: Quadras do Parque"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="h-[52px] bg-ace-surface border border-ace-border rounded-xl px-4 text-foreground font-medium outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all placeholder:text-ace-muted"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 h-[58px] bg-neon text-black font-display font-black uppercase tracking-[1.5px] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_4px_20px_rgba(204,255,0,0.15)]"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <span className="text-xl">💬</span>
                                Desafiar no WhatsApp
                            </>
                        )}
                    </button>
                    <p className="text-center text-[10px] text-ace-muted font-medium mt-1">O link do jogo será enviado para o WhatsApp do seu amigo.</p>
                </form>
            </div>
        </div>
    );
}

export default function SchedulePage() {
    return (
        <Suspense fallback={<div className="h-full bg-background flex flex-col items-center justify-center text-ace-muted"><div className="w-6 h-6 border-2 border-neon/30 border-t-neon rounded-full animate-spin" /></div>}>
            <ScheduleContent />
        </Suspense>
    );
}
