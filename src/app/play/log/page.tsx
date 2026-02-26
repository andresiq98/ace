"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock players from group
const MOCK_RIVALS = [
    { id: "RM", name: "Rafael M.", color: "from-[#FFD700] to-[#FF8F00]", text: "text-black" },
    { id: "LP", name: "Lucas P.", color: "from-[#2979FF] to-[#0D47A1]", text: "text-white" },
    { id: "MF", name: "Marcos F.", color: "from-[#FF6E40] to-[#BF360C]", text: "text-white" },
    { id: "GS", name: "Gabriel S.", color: "from-[#B388FF] to-[#4527A0]", text: "text-white" },
    { id: "JP", name: "João P.", color: "from-[#546E7A] to-[#263238]", text: "text-white" }
];

const SCORES = ["6×0", "6×1", "6×2", "6×3", "6×4", "7×5", "7×6"];

export default function LogMatchPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [rival, setRival] = useState<typeof MOCK_RIVALS[0] | null>(null);
    const [winner, setWinner] = useState<"me" | "rival" | null>(null);
    const [score, setScore] = useState<string | null>(null);
    const [mvp, setMvp] = useState<"none" | "CA" | "RM" | null>("none");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading || !user) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;

    const handleSaveResult = () => {
        if (!rival || !winner || !score) return;

        // Simulate save and go to celebration
        console.log("Saving Match:", { rival, winner, score, mvp });
        // In MVP, we skip the celebratory screen directly to home for speed, or we can build one.
        // Let's redirect back to Home directly for now.
        alert(`Resultado Salvo!\nVocê: ${winner === 'me' ? 'Venceu' : 'Perdeu'} de ${score} contra ${rival.name}`);
        router.push("/home");
    };

    const isComplete = rival && winner && score;

    return (
        <div className="flex flex-col h-full bg-black text-white relative overflow-hidden overflow-y-auto pb-32">
            {/* Topbar */}
            <div className="flex items-center justify-between p-5 pt-8 relative z-10 w-full sticky top-0 bg-gradient-to-b from-black to-transparent">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center text-xl text-white font-black"
                >
                    ←
                </button>
                <div className="font-montserrat font-black text-[13px] tracking-[1.5px] uppercase flex items-center gap-2">
                    Resultado
                </div>
                <div className="w-10"></div>
            </div>

            <div className="px-5 mb-6">
                <h1 className="font-montserrat font-black text-3xl uppercase tracking-tighter leading-tight mt-2">
                    REGISTRAR<br />
                    <span className="text-[#CCFF00]">RESULTADO</span>
                </h1>
            </div>

            <div className="px-5 flex flex-col gap-6 relative z-10">

                {/* Step 1: Rival */}
                <section>
                    <h3 className="text-[11px] font-extrabold tracking-[2px] uppercase text-[#A1A1AA] mb-4">1. Escolha o rival</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x -mx-5 px-5 scrollbar-hide">
                        {MOCK_RIVALS.map((r) => (
                            <div
                                key={r.id}
                                onClick={() => setRival(r)}
                                className={`flex flex-col items-center gap-2 snap-center cursor-pointer transition-transform ${rival?.id === r.id ? 'scale-110' : 'opacity-60 scale-95'}`}
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-montserrat font-black text-lg bg-gradient-to-br transition-all ${r.color} ${r.text} ${rival?.id === r.id ? 'ring-4 ring-[#CCFF00] ring-offset-2 ring-offset-black' : 'border-2 border-white/10'}`}>
                                    {r.id}
                                </div>
                                <div className={`text-[11px] font-bold ${rival?.id === r.id ? 'text-[#CCFF00]' : 'text-white'}`}>{r.name}</div>
                            </div>
                        ))}
                    </div>

                    {rival && (
                        <div className="bg-[#111113] border border-[#27272A] rounded-2xl p-4 flex items-center justify-center gap-4 mt-2 mb-6 animate-[fadeIn_0.3s_ease-out]">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center font-montserrat font-black bg-[#CCFF00] text-black border-2 border-[#CCFF00]">CA</div>
                                <div className="text-[12px] font-bold mt-1">Carlos A.</div>
                                <div className="text-[9px] font-bold text-[#A1A1AA] bg-[#27272A] px-2 py-0.5 rounded mt-1">VOCÊ</div>
                            </div>
                            <div className="font-montserrat font-black text-[#52525B] text-xl italic px-4">VS</div>
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-montserrat font-black bg-gradient-to-br border-2 border-transparent ${rival.color} ${rival.text}`}>{rival.id}</div>
                                <div className="text-[12px] font-bold mt-1 text-[#A1A1AA]">{rival.name}</div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Step 2: Winner */}
                {rival && (
                    <section className="animate-[fadeIn_0.3s_ease-out]">
                        <h3 className="text-[11px] font-extrabold tracking-[2px] uppercase text-[#A1A1AA] mb-4">2. Quem Ganhou?</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                onClick={() => setWinner("me")}
                                className={`bg-[#111113] border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${winner === 'me' ? 'border-[#CCFF00] bg-[rgba(204,255,0,0.04)] shadow-[0_0_20px_rgba(204,255,0,0.1)]' : 'border-[#27272A] opacity-60 hover:opacity-100'}`}
                            >
                                <div className="w-12 h-12 rounded-full flex items-center justify-center font-montserrat font-black bg-[#CCFF00] text-black border-2 border-[#CCFF00]">CA</div>
                                <div className="text-sm font-bold">Carlos A.</div>
                                <div className="text-[9px] font-bold text-[#A1A1AA] uppercase">você</div>
                            </div>
                            <div
                                onClick={() => setWinner("rival")}
                                className={`bg-[#111113] border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${winner === 'rival' ? `border-white shadow-[0_0_20px_rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)]` : 'border-[#27272A] opacity-60 hover:opacity-100'}`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-montserrat font-black bg-gradient-to-br border-2 border-transparent ${rival.color} ${rival.text}`}>{rival.id}</div>
                                <div className="text-sm font-bold text-[#A1A1AA] mt-1">{rival.name}</div>
                                <div className="text-[9px] font-bold text-[#A1A1AA] uppercase opacity-0">rival</div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Step 3: Score */}
                {winner && (
                    <section className="animate-[fadeIn_0.3s_ease-out]">
                        <h3 className="text-[11px] font-extrabold tracking-[2px] uppercase text-[#A1A1AA] mb-4">3. Placar</h3>
                        <div className="flex flex-wrap gap-2">
                            {SCORES.map((s) => (
                                <div
                                    key={s}
                                    onClick={() => setScore(s)}
                                    className={`h-12 px-4 rounded-xl flex items-center justify-center font-montserrat font-black text-lg cursor-pointer transition-all ${score === s ? 'bg-[#CCFF00] text-black shadow-[0_0_16px_rgba(204,255,0,0.3)]' : 'bg-[#18181B] border border-[#27272A] text-white'}`}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Points Preview */}
                {isComplete && (
                    <div className="mt-4 p-4 rounded-xl border border-[rgba(204,255,0,0.2)] bg-[rgba(204,255,0,0.02)] flex flex-col gap-2">
                        <div className="text-[11px] font-bold text-[#A1A1AA] flex items-center gap-2">
                            <span className="text-[#CCFF00]">✓</span> Participação +4
                        </div>
                        {winner === 'me' && (
                            <div className="text-[11px] font-bold text-[#CCFF00] flex items-center gap-2">
                                <span>🏆</span> Vitória +6
                            </div>
                        )}
                        <div className="text-[11px] font-bold text-[#A1A1AA] flex items-center gap-2">
                            <span>⏱</span> Bônus 60min (×1.25)
                        </div>
                    </div>
                )}

            </div>

            {/* Save Action */}
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
