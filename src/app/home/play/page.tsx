"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDrillsByMode, type DrillMode } from "@/lib/drills";
import { MOCK_PLAYERS, CURRENT_USER, MOCK_GROUP } from "@/lib/data";

export default function PlayPage() {
    const router = useRouter();
    const [selectedMode, setSelectedMode] = useState<DrillMode>("competitive");
    const [playerCount, setPlayerCount] = useState(4);
    const [showSchedule, setShowSchedule] = useState(false);
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [scheduleConfirmed, setScheduleConfirmed] = useState(false);

    const drills = getDrillsByMode(selectedMode);
    const rivals = MOCK_PLAYERS.filter(p => p.id !== CURRENT_USER.id);

    const togglePlayer = (id: string) => {
        setSelectedPlayers(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const formatDateBR = (dateStr: string) => {
        if (!dateStr) return "";
        const [y, m, d] = dateStr.split("-");
        return `${d}/${m}/${y}`;
    };

    const getDayOfWeek = (dateStr: string) => {
        if (!dateStr) return "";
        const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
        return days[new Date(dateStr + "T12:00:00").getDay()];
    };

    const handleScheduleWhatsApp = () => {
        const playerNames = selectedPlayers
            .map(id => MOCK_PLAYERS.find(p => p.id === id)?.displayName.split(" ")[0])
            .filter(Boolean)
            .join(", ");

        const msg = `🎾 *ACE — Jogo Agendado!*\n\n📅 ${getDayOfWeek(scheduleDate)}, ${formatDateBR(scheduleDate)}\n⏰ ${scheduleTime}h\n👥 ${playerNames || "Galera"}\n\n🔥 Bora pra quadra!\n\n📲 Código do grupo: *${MOCK_GROUP.inviteCode}*\nace.app/join/${MOCK_GROUP.inviteCode}`;

        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
        setScheduleConfirmed(true);
        setTimeout(() => {
            setShowSchedule(false);
            setScheduleConfirmed(false);
        }, 2000);
    };

    return (
        <div>
            {/* Title */}
            <div className="px-5 pt-3 pb-5">
                <h1 className="font-display font-black text-[38px] uppercase tracking-[-2px] leading-[0.92]">
                    BORA<br /><span className="text-neon neon-text-glow">PRO PLAY?</span>
                </h1>
            </div>

            {/* Mode Selection */}
            <div className="text-[9px] tracking-[5px] uppercase font-bold text-ace-muted font-display px-5 mb-3">
                Tipo de Treinasso
            </div>
            <div className="grid grid-cols-2 gap-2.5 px-5 mb-6">
                <button
                    onClick={() => setSelectedMode("competitive")}
                    className={`bg-ace-surface border-2 rounded-2xl p-5 pt-[22px] text-center cursor-pointer transition-all duration-250 relative overflow-hidden active:scale-[0.96] ${selectedMode === "competitive" ? "border-neon bg-neon/[0.04]" : "border-ace-border"
                        }`}
                >
                    {selectedMode === "competitive" && (
                        <div className="absolute top-2.5 right-2.5 w-[22px] h-[22px] bg-neon rounded-full flex items-center justify-center text-[11px] font-black text-background shadow-[0_2px_8px_rgba(204,255,0,0.3)]">✓</div>
                    )}
                    <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-2xl mx-auto mb-3 bg-destructive/[0.08]">⚔️</div>
                    <div className="font-display font-black text-sm uppercase tracking-[0.5px] mb-1">Competitivo</div>
                    <div className="text-[11px] text-ace-muted leading-[1.4]">Vale pontos no ranking</div>
                </button>

                <button
                    onClick={() => setSelectedMode("cooperative")}
                    className={`bg-ace-surface border-2 rounded-2xl p-5 pt-[22px] text-center cursor-pointer transition-all duration-250 relative overflow-hidden active:scale-[0.96] ${selectedMode === "cooperative" ? "border-neon bg-neon/[0.04]" : "border-ace-border"
                        }`}
                >
                    {selectedMode === "cooperative" && (
                        <div className="absolute top-2.5 right-2.5 w-[22px] h-[22px] bg-neon rounded-full flex items-center justify-center text-[11px] font-black text-background shadow-[0_2px_8px_rgba(204,255,0,0.3)]">✓</div>
                    )}
                    <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-2xl mx-auto mb-3 bg-neon/[0.04]">🤝</div>
                    <div className="font-display font-black text-sm uppercase tracking-[0.5px] mb-1">Cooperativo</div>
                    <div className="text-[11px] text-ace-muted leading-[1.4]">Evolução em dupla</div>
                </button>
            </div>

            {/* Player Count */}
            <div className="px-5 mb-5">
                <div className="font-display text-[9px] tracking-[5px] uppercase font-bold text-ace-muted mb-2.5">
                    Modo de Jogo
                </div>
                <div className="flex bg-ace-surface border border-ace-border rounded-xl p-1 gap-1">
                    {[
                        { val: 2, label: "Simples (2)" },
                        { val: 4, label: "Duplas (4)" }
                    ].map((opt) => (
                        <button
                            key={opt.val}
                            onClick={() => setPlayerCount(opt.val)}
                            className={`flex-1 h-[42px] rounded-lg flex items-center justify-center font-display font-extrabold text-sm tracking-[1px] cursor-pointer transition-all duration-250 active:scale-[0.94] ${playerCount === opt.val
                                ? "bg-neon text-background shadow-[0_2px_12px_rgba(204,255,0,0.2)]"
                                : "text-ace-muted"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ═══ Schedule Game Button ═══ */}
            <div className="px-5 mb-6">
                <button
                    onClick={() => setShowSchedule(!showSchedule)}
                    className={`w-full bg-ace-surface border-2 rounded-2xl p-[18px] cursor-pointer flex items-center gap-4 transition-all duration-250 active:scale-[0.97] text-left ${showSchedule ? "border-neon bg-neon/[0.04]" : "border-ace-border"
                        }`}
                >
                    <div className="w-[52px] h-[52px] bg-ace-surface2 rounded-[14px] flex items-center justify-center text-2xl shrink-0">
                        📅
                    </div>
                    <div className="flex-1">
                        <div className="font-display font-black text-base uppercase tracking-[0.3px] mb-[3px]">
                            Agendar Jogo
                        </div>
                        <div className="text-xs text-ace-muted leading-[1.4]">
                            Marque data/hora e avise a galera pelo WhatsApp
                        </div>
                    </div>
                    <div className="text-neon text-lg shrink-0">{showSchedule ? "▴" : "▾"}</div>
                </button>

                {/* Schedule Drawer */}
                {showSchedule && (
                    <div className="mt-2.5 bg-ace-surface border border-ace-border rounded-2xl p-5 animate-slide-up">
                        {/* Date */}
                        <div className="font-display text-[9px] tracking-[4px] uppercase font-bold text-ace-muted mb-2">
                            📅 Data
                        </div>
                        <input
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full h-[48px] bg-ace-surface2 border border-ace-border rounded-xl px-4 font-display text-sm font-bold text-foreground focus:border-neon focus:outline-none transition-all duration-200 mb-3.5 [color-scheme:dark]"
                        />

                        {/* Time */}
                        <div className="font-display text-[9px] tracking-[4px] uppercase font-bold text-ace-muted mb-2">
                            ⏰ Horário
                        </div>
                        <div className="flex gap-2 flex-wrap mb-4">
                            {["07:00", "08:00", "09:00", "10:00", "17:00", "18:00", "19:00", "20:00"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setScheduleTime(t)}
                                    className={`h-[40px] px-3.5 bg-ace-surface2 border-2 rounded-lg flex items-center justify-center font-display text-xs font-black cursor-pointer transition-all duration-200 active:scale-[0.94] ${scheduleTime === t
                                        ? "border-neon bg-neon/[0.06] text-neon"
                                        : "border-ace-border text-ace-mid"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Players to Notify */}
                        <div className="font-display text-[9px] tracking-[4px] uppercase font-bold text-ace-muted mb-2.5">
                            👥 Quem chamar?
                        </div>
                        <div className="flex gap-2 flex-wrap mb-5">
                            {rivals.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => togglePlayer(p.id)}
                                    className={`flex items-center gap-2 bg-ace-surface2 border-2 rounded-3xl px-3 py-1.5 font-display text-xs font-bold cursor-pointer transition-all duration-200 active:scale-[0.95] ${selectedPlayers.includes(p.id)
                                        ? "border-neon text-neon bg-neon/[0.06]"
                                        : "border-ace-border text-ace-muted"
                                        }`}
                                >
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center font-black text-[9px] shrink-0"
                                        style={{ background: p.gradient, color: p.textColor }}
                                    >
                                        {p.initials}
                                    </div>
                                    {p.displayName.split(" ")[0]}
                                    {selectedPlayers.includes(p.id) && <span className="text-neon">✓</span>}
                                </button>
                            ))}
                        </div>

                        {/* Summary Preview */}
                        {scheduleDate && scheduleTime && (
                            <div className="bg-neon/[0.04] border border-neon/15 rounded-xl p-3 mb-4 text-center animate-slide-up">
                                <div className="text-[9px] tracking-[3px] text-neon font-bold uppercase font-display mb-1.5">Resumo</div>
                                <div className="font-display font-black text-lg tracking-[-0.5px]">
                                    {getDayOfWeek(scheduleDate)}, {formatDateBR(scheduleDate)}
                                </div>
                                <div className="text-sm text-ace-mid font-semibold">às {scheduleTime}h</div>
                                {selectedPlayers.length > 0 && (
                                    <div className="text-[11px] text-ace-muted mt-1.5">
                                        📨 Notificar: {selectedPlayers.map(id => MOCK_PLAYERS.find(p => p.id === id)?.displayName.split(" ")[0]).join(", ")}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* WhatsApp Send Button */}
                        <button
                            onClick={handleScheduleWhatsApp}
                            disabled={!scheduleDate || !scheduleTime}
                            className="w-full h-[52px] bg-[#25D366] rounded-[14px] flex items-center justify-center gap-2.5 font-display font-black text-[12px] tracking-[2px] uppercase text-white cursor-pointer transition-all duration-200 shadow-[0_4px_20px_rgba(37,211,102,0.2)] active:scale-[0.96] disabled:opacity-25 disabled:pointer-events-none relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="shrink-0">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            {scheduleConfirmed ? "✅ ENVIADO!" : "AGENDAR E NOTIFICAR VIA WHATSAPP"}
                        </button>
                    </div>
                )}
            </div>

            {/* ═══ SET NORMAL — Primary Option ═══ */}
            <div className="text-[9px] tracking-[5px] uppercase font-bold text-ace-muted font-display px-5 mb-3">
                Jogo Principal
            </div>
            <div className="px-5 mb-6">
                <button
                    onClick={() => router.push(`/play/log?mode=${playerCount === 2 ? 'simples' : 'duplas'}`)}
                    className="w-full bg-gradient-to-br from-neon/[0.06] to-neon/[0.01] border-[2px] border-neon/30 rounded-2xl p-5 cursor-pointer flex items-center gap-4 transition-all duration-250 active:scale-[0.97] hover:border-neon/50 text-left relative overflow-hidden shadow-[0_2px_16px_rgba(204,255,0,0.06)]"
                >
                    <div className="absolute top-0 right-0 bg-neon text-background font-display text-[8px] font-black tracking-[2px] uppercase px-3 py-[4px] rounded-[0_16px_0_12px]">
                        ⭐ PRINCIPAL
                    </div>
                    <div className="w-[58px] h-[58px] bg-neon/[0.08] border border-neon/20 rounded-[16px] flex items-center justify-center text-3xl shrink-0">
                        🎾
                    </div>
                    <div className="flex-1">
                        <div className="font-display font-black text-lg uppercase tracking-[0.3px] mb-[3px] text-neon">
                            Set Normal
                        </div>
                        <div className="text-xs text-ace-mid leading-[1.4] mb-1.5">
                            Jogo livre sem regras especiais. Só bater bola e registrar o resultado.
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                            <span className="bg-white/[0.04] border border-ace-border rounded-md px-2 py-[3px] text-[9px] font-semibold text-ace-mid">
                                ⭐ Vale ranking
                            </span>
                            <span className="bg-white/[0.04] border border-ace-border rounded-md px-2 py-[3px] text-[9px] font-semibold text-ace-mid">
                                🏆 Vale pontos
                            </span>
                        </div>
                    </div>
                    <div className="text-neon text-2xl shrink-0 mr-1">→</div>
                </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 px-5 mb-4">
                <div className="flex-1 h-[1px] bg-ace-border" />
                <span className="text-[9px] tracking-[3px] text-ace-muted font-display font-bold uppercase">ou tente algo diferente</span>
                <div className="flex-1 h-[1px] bg-ace-border" />
            </div>

            {/* ═══ DRILLS SITUACIONAIS ═══ */}
            <div className="text-[9px] tracking-[5px] uppercase font-bold text-ace-muted font-display px-5 mb-3">
                🎯 Drills Situacionais
            </div>
            <div className="px-5 mb-2">
                <div className="text-[11px] text-ace-mid leading-[1.5] mb-3">
                    Exercícios com regras específicas para treinar situações de jogo. Cada drill foca em um aspecto diferente do tênis.
                </div>
            </div>
            <div className="px-5 space-y-2.5 mb-8">
                {drills.map((drill) => (
                    <button
                        key={drill.id}
                        onClick={() => router.push(`/drill/group-coxos/${drill.id}`)}
                        className="w-full bg-ace-surface border-2 border-ace-border rounded-2xl p-[18px] cursor-pointer flex items-center gap-4 transition-all duration-250 active:scale-[0.97] hover:border-neon/30 text-left"
                    >
                        <div className="w-[52px] h-[52px] bg-ace-surface2 rounded-[14px] flex items-center justify-center text-2xl shrink-0">
                            {drill.emoji}
                        </div>
                        <div className="flex-1">
                            <div className="font-display font-black text-base uppercase tracking-[0.3px] mb-[3px]">
                                {drill.title}
                            </div>
                            <div className="text-xs text-ace-muted leading-[1.4]">
                                {drill.shortDescription}
                            </div>
                        </div>
                        <div className="w-7 h-7 border-2 border-ace-border rounded-full shrink-0 flex items-center justify-center text-xs font-black text-transparent transition-all duration-250">
                            ✓
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
