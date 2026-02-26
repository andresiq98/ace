"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Player = { id: string; name: string; color: string; text: string };

const ME: Player = { id: "CA", name: "Carlos A.", color: "from-[#CCFF00] to-[#9ACD32]", text: "text-black" };

const MOCK_RIVALS: Player[] = [
    { id: "RM", name: "Rafael M.", color: "from-[#FFD700] to-[#FF8F00]", text: "text-black" },
    { id: "LP", name: "Lucas P.", color: "from-[#2979FF] to-[#0D47A1]", text: "text-white" },
    { id: "MF", name: "Marcos F.", color: "from-[#FF6E40] to-[#BF360C]", text: "text-white" },
    { id: "GS", name: "Gabriel S.", color: "from-[#B388FF] to-[#4527A0]", text: "text-white" },
    { id: "JP", name: "João P.", color: "from-[#546E7A] to-[#263238]", text: "text-white" },
];

const SCORES = ["6×0", "6×1", "6×2", "6×3", "6×4", "7×5", "7×6"];

function PlayerBubble({ player, selected, onClick, size = "w-14 h-14" }: { player: Player; selected: boolean; onClick: () => void; size?: string }) {
    return (
        <div onClick={onClick} className="flex flex-col items-center gap-1.5 cursor-pointer transition-transform">
            <div className={`${size} rounded-full flex items-center justify-center font-montserrat font-black text-sm bg-gradient-to-br transition-all ${player.color} ${player.text} ${selected ? "ring-4 ring-[#CCFF00] ring-offset-2 ring-offset-black scale-110" : "border-2 border-white/10 opacity-60 scale-95"}`}>
                {player.id}
            </div>
            <div className={`text-[11px] font-bold ${selected ? "text-[#CCFF00]" : "text-white"}`}>{player.name}</div>
        </div>
    );
}

export default function LogMatchPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [mode, setMode] = useState<"simples" | "duplas">("simples");

    // Singles state
    const [rival, setRival] = useState<Player | null>(null);

    // Doubles state
    const [partner, setPartner] = useState<Player | null>(null);
    const [opponents, setOpponents] = useState<Player[]>([]);

    // Shared state
    const [winner, setWinner] = useState<"me" | "rival" | null>(null);
    const [score, setScore] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) router.push("/");
    }, [user, loading, router]);

    if (loading || !user) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;

    const resetSelections = () => {
        setRival(null);
        setPartner(null);
        setOpponents([]);
        setWinner(null);
        setScore(null);
    };

    const handleModeChange = (newMode: "simples" | "duplas") => {
        if (newMode !== mode) {
            setMode(newMode);
            resetSelections();
        }
    };

    const toggleOpponent = (p: Player) => {
        if (opponents.find(o => o.id === p.id)) {
            setOpponents(opponents.filter(o => o.id !== p.id));
        } else if (opponents.length < 2) {
            setOpponents([...opponents, p]);
        }
    };

    const availableForPartner = MOCK_RIVALS;
    const availableForOpponents = MOCK_RIVALS.filter(p => p.id !== partner?.id);

    const isPlayersReady = mode === "simples"
        ? !!rival
        : !!partner && opponents.length === 2;

    const isComplete = isPlayersReady && winner && score;

    const handleSaveResult = () => {
        if (!isComplete) return;

        console.log("Saving Match:", { mode, rival, partner, opponents, winner, score });

        const rivalName = mode === "simples"
            ? rival!.name
            : `${opponents[0].name} & ${opponents[1].name}`;
        const pts = winner === "me" ? "12.5" : "4";

        router.push(`/celebration?win=${winner === "me"}&score=${encodeURIComponent(score!)}&rival=${encodeURIComponent(rivalName)}&mode=${mode}&pts=${pts}`);
    };

    return (
        <div className="flex flex-col h-full bg-black text-white relative overflow-hidden overflow-y-auto pb-32">
            {/* Topbar */}
            <div className="flex items-center justify-between p-5 pt-8 relative z-10 w-full sticky top-0 bg-black/90 backdrop-blur-sm z-20">
                <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center text-xl text-white font-black">←</button>
                <div className="font-montserrat font-black text-[13px] tracking-[1.5px] uppercase">Resultado</div>
                <div className="w-10" />
            </div>

            <div className="px-5 mb-5">
                <h1 className="font-montserrat font-black text-3xl uppercase tracking-tighter leading-tight">
                    REGISTRAR<br /><span className="text-[#CCFF00]">RESULTADO</span>
                </h1>
            </div>

            <div className="px-5 flex flex-col gap-6 relative z-10">

                {/* Mode Toggle */}
                <section>
                    <h3 className="text-[11px] font-extrabold tracking-[2px] uppercase text-[#A1A1AA] mb-3">TIPO DE JOGO</h3>
                    <div className="flex bg-[#111113] border border-[#27272A] rounded-xl p-1 gap-1">
                        <button
                            onClick={() => handleModeChange("simples")}
                            className={`flex-1 h-11 rounded-lg flex items-center justify-center font-montserrat font-extrabold text-sm tracking-[1px] transition-all gap-2 ${mode === "simples" ? "bg-[#CCFF00] text-black shadow-[0_2px_12px_rgba(204,255,0,0.2)]" : "text-[#A1A1AA] hover:text-white"}`}
                        >
                            👤 Simples
                        </button>
                        <button
                            onClick={() => handleModeChange("duplas")}
                            className={`flex-1 h-11 rounded-lg flex items-center justify-center font-montserrat font-extrabold text-sm tracking-[1px] transition-all gap-2 ${mode === "duplas" ? "bg-[#CCFF00] text-black shadow-[0_2px_12px_rgba(204,255,0,0.2)]" : "text-[#A1A1AA] hover:text-white"}`}
                        >
                            👥 Duplas
                        </button>
                    </div>
                </section>

                {/* ─── SIMPLES ─── */}
                {mode === "simples" && (
                    <>
                        <section>
                            <h3 className="text-[11px] font-extrabold tracking-[2px] uppercase text-[#A1A1AA] mb-4">1. ESCOLHA O RIVAL</h3>
                            <div className="flex gap-4 overflow-x-auto pb-2 snap-x -mx-5 px-5 scrollbar-hide">
                                {MOCK_RIVALS.map(r => (
                                    <PlayerBubble key={r.id} player={r} selected={rival?.id === r.id} onClick={() => setRival(r)} />
                                ))}
                            </div>

                            {rival && (
                                <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-4 flex items-center justify-center gap-6 mt-3 animate-[fadeIn_0.3s_ease-out]">
                                    <div className="flex flex-col items-center">
                                        <div className="w-11 h-11 rounded-full flex items-center justify-center font-montserrat font-black bg-[#CCFF00] text-black text-sm">CA</div>
                                        <div className="text-[11px] font-bold mt-1">Carlos A.</div>
                                        <div className="text-[8px] font-bold text-[#A1A1AA] bg-[#27272A] px-1.5 py-0.5 rounded mt-1">VOCÊ</div>
                                    </div>
                                    <div className="font-montserrat font-black text-[#52525B] text-lg italic">VS</div>
                                    <div className="flex flex-col items-center">
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-montserrat font-black bg-gradient-to-br text-sm ${rival.color} ${rival.text}`}>{rival.id}</div>
                                        <div className="text-[11px] font-bold mt-1 text-[#A1A1AA]">{rival.name}</div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </>
                )}

                {/* ─── DUPLAS ─── */}
                {mode === "duplas" && (
                    <>
                        {/* Step 1: Pick Partner */}
                        <section>
                            <h3 className="text-[11px] font-extrabold tracking-[2px] uppercase text-[#A1A1AA] mb-4">1. ESCOLHA SUA DUPLA</h3>
                            <div className="flex gap-4 overflow-x-auto pb-2 snap-x -mx-5 px-5 scrollbar-hide">
                                {availableForPartner.map(r => (
                                    <PlayerBubble key={r.id} player={r} selected={partner?.id === r.id} onClick={() => { setPartner(r); setOpponents(prev => prev.filter(o => o.id !== r.id)); }} />
                                ))}
                            </div>
                        </section>

                        {/* Step 2: Pick 2 Opponents */}
                        {partner && (
                            <section className="animate-[fadeIn_0.3s_ease-out]">
                                <h3 className="text-[11px] font-extrabold tracking-[2px] uppercase text-[#A1A1AA] mb-4">
                                    2. OPONENTES <span className="text-[#52525B]">({opponents.length}/2)</span>
                                </h3>
                                <div className="flex gap-4 overflow-x-auto pb-2 snap-x -mx-5 px-5 scrollbar-hide">
                                    {availableForOpponents.map(r => (
                                        <PlayerBubble key={r.id} player={r} selected={opponents.some(o => o.id === r.id)} onClick={() => toggleOpponent(r)} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Match Preview */}
                        {partner && opponents.length === 2 && (
                            <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-4 animate-[fadeIn_0.3s_ease-out]">
                                <div className="flex items-center justify-center gap-4">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="text-[8px] font-bold text-[#CCFF00] tracking-[2px] uppercase mb-1">TIME A</div>
                                        <div className="flex gap-2">
                                            <div className="flex flex-col items-center">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-montserrat font-black bg-[#CCFF00] text-black text-xs">CA</div>
                                                <div className="text-[9px] font-bold mt-1">Você</div>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-montserrat font-black bg-gradient-to-br text-xs ${partner.color} ${partner.text}`}>{partner.id}</div>
                                                <div className="text-[9px] font-bold mt-1 text-[#A1A1AA]">{partner.name.split(" ")[0]}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-montserrat font-black text-[#52525B] text-lg italic">VS</div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="text-[8px] font-bold text-[#A1A1AA] tracking-[2px] uppercase mb-1">TIME B</div>
                                        <div className="flex gap-2">
                                            {opponents.map(o => (
                                                <div key={o.id} className="flex flex-col items-center">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-montserrat font-black bg-gradient-to-br text-xs ${o.color} ${o.text}`}>{o.id}</div>
                                                    <div className="text-[9px] font-bold mt-1 text-[#A1A1AA]">{o.name.split(" ")[0]}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* ─── WINNER ─── */}
                {isPlayersReady && (
                    <section className="animate-[fadeIn_0.3s_ease-out]">
                        <h3 className="text-[11px] font-extrabold tracking-[2px] uppercase text-[#A1A1AA] mb-4">
                            {mode === "simples" ? "2" : "3"}. QUEM GANHOU?
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                onClick={() => setWinner("me")}
                                className={`bg-[#111113] border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${winner === "me" ? "border-[#CCFF00] bg-[rgba(204,255,0,0.04)] shadow-[0_0_20px_rgba(204,255,0,0.1)]" : "border-[#27272A] opacity-60 hover:opacity-100"}`}
                            >
                                {mode === "simples" ? (
                                    <>
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-montserrat font-black bg-[#CCFF00] text-black">CA</div>
                                        <div className="text-sm font-bold">Carlos A.</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex -space-x-2">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-montserrat font-black bg-[#CCFF00] text-black text-xs border-2 border-black z-10">CA</div>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-montserrat font-black bg-gradient-to-br text-xs border-2 border-black ${partner!.color} ${partner!.text}`}>{partner!.id}</div>
                                        </div>
                                        <div className="text-xs font-bold text-center">Time A</div>
                                    </>
                                )}
                                <div className="text-[9px] font-bold text-[#A1A1AA] uppercase">você</div>
                            </div>
                            <div
                                onClick={() => setWinner("rival")}
                                className={`bg-[#111113] border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${winner === "rival" ? "border-white bg-[rgba(255,255,255,0.04)] shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "border-[#27272A] opacity-60 hover:opacity-100"}`}
                            >
                                {mode === "simples" ? (
                                    <>
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-montserrat font-black bg-gradient-to-br ${rival!.color} ${rival!.text}`}>{rival!.id}</div>
                                        <div className="text-sm font-bold text-[#A1A1AA]">{rival!.name}</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex -space-x-2">
                                            {opponents.map((o, i) => (
                                                <div key={o.id} className={`w-10 h-10 rounded-full flex items-center justify-center font-montserrat font-black bg-gradient-to-br text-xs border-2 border-black ${o.color} ${o.text} ${i === 0 ? "z-10" : ""}`}>{o.id}</div>
                                            ))}
                                        </div>
                                        <div className="text-xs font-bold text-[#A1A1AA] text-center">Time B</div>
                                    </>
                                )}
                                <div className="text-[9px] font-bold text-[#A1A1AA] uppercase opacity-0">x</div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ─── SCORE ─── */}
                {winner && (
                    <section className="animate-[fadeIn_0.3s_ease-out]">
                        <h3 className="text-[11px] font-extrabold tracking-[2px] uppercase text-[#A1A1AA] mb-4">
                            {mode === "simples" ? "3" : "4"}. PLACAR
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {SCORES.map(s => (
                                <div key={s} onClick={() => setScore(s)} className={`h-12 px-4 rounded-xl flex items-center justify-center font-montserrat font-black text-lg cursor-pointer transition-all ${score === s ? "bg-[#CCFF00] text-black shadow-[0_0_16px_rgba(204,255,0,0.3)]" : "bg-[#18181B] border border-[#27272A] text-white"}`}>
                                    {s}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ─── POINTS PREVIEW ─── */}
                {isComplete && (
                    <div className="mt-2 p-4 rounded-xl border border-[rgba(204,255,0,0.2)] bg-[rgba(204,255,0,0.02)] flex flex-col gap-2 animate-[fadeIn_0.3s_ease-out]">
                        <div className="text-[10px] font-extrabold tracking-[2px] uppercase text-[#A1A1AA] mb-1">
                            {mode === "duplas" ? "📊 Pontos Individuais" : "📊 Pontos"}
                        </div>
                        <div className="text-[11px] font-bold text-[#A1A1AA] flex items-center gap-2">
                            <span className="text-[#CCFF00]">✓</span> Participação +4 {mode === "duplas" && <span className="text-[#52525B]">(para cada jogador faturar individualmente)</span>}
                        </div>
                        {winner === "me" && (
                            <div className="text-[11px] font-bold text-[#CCFF00] flex items-center gap-2">
                                <span>🏆</span> Vitória +6 {mode === "duplas" && <span className="text-[#52525B]">(para cada um do time)</span>}
                            </div>
                        )}
                        <div className="text-[10px] text-[#52525B] mt-1 italic leading-tight">
                            Atenção: no tênis de duplas, os pontos do ranking vão INVIDIDUALMENTE para cada jogador. Jogue com parceiros diferentes e suba sozinho!
                        </div>
                    </div>
                )}
            </div>

            {/* Save Button */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black to-transparent z-20">
                <button
                    onClick={handleSaveResult}
                    disabled={!isComplete}
                    className="w-full flex items-center justify-center gap-2 h-[56px] bg-[#CCFF00] text-black font-montserrat font-black text-[14px] tracking-[2px] uppercase rounded-xl transition-transform active:scale-95 shadow-[0_4px_24px_rgba(204,255,0,0.25)] disabled:opacity-30 disabled:pointer-events-none"
                >
                    SALVAR RESULTADO
                </button>
            </div>
        </div>
    );
}
