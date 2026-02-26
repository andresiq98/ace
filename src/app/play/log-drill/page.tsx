"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";

type Player = { id: string; name: string; color: string; text: string };

const ME: Player = { id: "CA", name: "Carlos A.", color: "from-[#CCFF00] to-[#9ACD32]", text: "text-black" };

const MOCK_PARTNERS: Player[] = [
    { id: "RM", name: "Rafael M.", color: "from-[#FFD700] to-[#FF8F00]", text: "text-black" },
    { id: "LP", name: "Lucas P.", color: "from-[#2979FF] to-[#0D47A1]", text: "text-white" },
    { id: "MF", name: "Marcos F.", color: "from-[#FF6E40] to-[#BF360C]", text: "text-white" },
    { id: "GS", name: "Gabriel S.", color: "from-[#B388FF] to-[#4527A0]", text: "text-white" },
    { id: "JP", name: "João P.", color: "from-[#546E7A] to-[#263238]", text: "text-white" },
];

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

function LogDrillForm() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const drillId = searchParams.get("drill") || "padrao";

    const drillNames: Record<string, string> = {
        "1": "O Sniper do Saque",
        "2": "Paredão de Voleio",
        "3": "Muralha no Fundo",
        "padrao": "Treino Geral"
    };

    const drillName = drillNames[drillId] || "Treino";

    // Who did I train with? (optional, could be multiple, let's keep it max 2 for simplicity)
    const [partners, setPartners] = useState<Player[]>([]);

    useEffect(() => {
        if (!loading && !user) router.push("/");
    }, [user, loading, router]);

    if (loading || !user) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;


    const handleSaveDrill = () => {
        // Just log participation points, no winner/loser
        console.log("Saving Drill:", { drillId, partners });

        // Pass "treino" as mode, which we will handle specially in /celebration
        const partnersText = partners.length > 0 ? partners.map(p => p.name).join(", ") : "Sozinho";
        const pts = "2"; // 2 points for training

        router.push(`/celebration?win=true&score=Treino&rival=${encodeURIComponent(partnersText)}&mode=treino&pts=${pts}&drill=${encodeURIComponent(drillName)}`);
    };

    return (
        <div className="flex flex-col h-full bg-black text-white relative overflow-hidden overflow-y-auto pb-32">
            {/* Topbar */}
            <div className="flex items-center justify-between p-5 pt-8 relative z-10 w-full sticky top-0 bg-black/90 backdrop-blur-sm z-20">
                <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center text-xl text-white font-black">←</button>
                <div className="font-montserrat font-black text-[13px] tracking-[1.5px] uppercase text-[#CCFF00]">
                    Treinos & Drills
                </div>
                <div className="w-10" />
            </div>

            <div className="px-5 mb-5 mt-2">
                <h1 className="font-montserrat font-black text-3xl uppercase tracking-tighter leading-tight text-[#A1A1AA]">
                    Registrar <br />
                    <span className="text-white">{drillName}</span>
                </h1>
                <p className="text-[12px] text-[#A1A1AA] mt-2 font-medium">Bora registrar que o dever de casa foi feito.</p>
            </div>

            <div className="px-5 flex flex-col gap-6 relative z-10">
                {/* ─── PARCEIROS DE TREINO ─── */}
                <section>
                    <h3 className="text-[11px] font-extrabold tracking-[2px] uppercase text-[#A1A1AA] mb-4">
                        QUEM TREINOU CONTIGO? <span className="text-[#52525B]">(Opcional)</span>
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 snap-x -mx-5 px-5 scrollbar-hide">
                        {MOCK_PARTNERS.map(r => (
                            <PlayerBubble
                                key={r.id}
                                player={r}
                                selected={partners.some(p => p.id === r.id)}
                                onClick={() => {
                                    if (partners.some(p => p.id === r.id)) {
                                        setPartners(partners.filter(p => p.id !== r.id));
                                    } else {
                                        setPartners([...partners, r]);
                                    }
                                }}
                            />
                        ))}
                    </div>

                    <div className="mt-6 bg-[#111113] border border-[#27272A] rounded-2xl p-4 flex flex-col items-center py-8">
                        <div className="text-[48px] mb-2 opacity-80 animate-pulse">🎾</div>
                        <div className="font-montserrat font-black text-[#A1A1AA] text-lg uppercase tracking-tight text-center">
                            {partners.length === 0 ? "TREINO INDIVIDUAL" : `COM ${partners.length} PARCEIRO${partners.length > 1 ? 'S' : ''}`}
                        </div>
                    </div>
                </section>


                {/* ─── POINTS PREVIEW ─── */}
                <div className="mt-2 p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-2">
                    <div className="text-[10px] font-extrabold tracking-[2px] uppercase text-white mb-1">
                        📊 EXP de Treino
                    </div>
                    <div className="text-[11px] font-bold text-white flex items-center gap-2">
                        <span className="text-[#CCFF00]">✓</span> Presença confirmada +2 pts
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black to-transparent z-20">
                <button
                    onClick={handleSaveDrill}
                    className="w-full flex items-center justify-center gap-2 h-[56px] bg-white text-black font-montserrat font-black text-[14px] tracking-[2px] uppercase rounded-xl transition-transform active:scale-95 shadow-[0_4px_24px_rgba(255,255,255,0.25)]"
                >
                    SALVAR TREINO
                </button>
            </div>
        </div>
    );
}

export default function LogDrillPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>}>
            <LogDrillForm />
        </Suspense>
    );
}
