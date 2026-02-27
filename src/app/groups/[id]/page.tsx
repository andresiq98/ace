"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



// Mock Data for MVP
const MOCK_RANKING = [
    { id: "1", name: "Rafael", fullName: "Rafael Moura", initials: "RM", points: 58, position: 1, color: "from-[#FFD700] to-[#FF8F00]", text: "text-black", stats: "7 jogos" },
    { id: "2", name: "Carlos", fullName: "Carlos Augusto", initials: "CA", points: 47, position: 2, color: "bg-[#CCFF00]", text: "text-black", stats: "5 jogos" },
    { id: "3", name: "Lucas", fullName: "Lucas Pereira", initials: "LP", points: 41, position: 3, color: "bg-[#2979FF]", text: "text-white", stats: "6 jogos" },
    { id: "4", name: "Marcos Figueiredo", initials: "MF", points: 35, position: 4, color: "bg-[#FF6E40]", text: "text-white", stats: "2 jogos" },
    { id: "5", name: "Gabriel Silva", initials: "GS", points: 22, position: 5, color: "bg-[#B388FF]", text: "text-white", stats: "1 jogo" },
    { id: "6", name: "João Pedro", initials: "JP", points: 8, position: 6, color: "bg-[#546E7A]", text: "text-white", stats: "🏮 GUARDIÃO DA LANTERNA", isLast: true }
];

export default function GroupRankingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading || !user) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;

    const podiumData = MOCK_RANKING.slice(0, 3);
    const restData = MOCK_RANKING.slice(3);

    return (
        <div className="flex flex-col h-full bg-black text-white relative overflow-hidden overflow-y-auto pb-24">
            {/* Topbar */}
            <div className="flex items-center justify-between p-5 pt-8 relative z-10 w-full sticky top-0 bg-gradient-to-b from-black to-transparent">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center text-xl text-white font-black"
                >
                    ←
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-[18px] h-[18px] bg-white rounded-full relative">
                        <div className="absolute inset-0 border-[2px] border-[#CCFF00] rounded-full scale-125 opacity-30 animate-pulse" />
                    </div>
                    <span className="font-montserrat font-black text-xs tracking-[1px] text-white">ACE</span>
                </div>
                <button className="text-xl w-10 h-10 flex items-center justify-end">⚙️</button>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-b from-[#0C1400] to-black px-5 pt-5 pb-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[radial-gradient(ellipse,rgba(204,255,0,0.05)_0%,transparent_70%)] pointer-events-none" />

                {/* Group Info */}
                <div className="flex items-center gap-2.5 mb-4 relative z-10">
                    <div className="w-2 h-2 bg-[#CCFF00] rounded-full shadow-[0_0_8px_rgba(204,255,0,0.25)]" />
                    <div className="text-[13px] font-semibold text-[#A1A1AA]">Clube dos Coxos</div>
                    <div className="ml-auto bg-[rgba(204,255,0,0.06)] border border-[rgba(204,255,0,0.15)] rounded-lg px-3 py-1 text-[11px] font-bold text-[#CCFF00] font-montserrat tracking-wider">
                        4d 12h
                    </div>
                </div>

                {/* User Card */}
                <div className="bg-[#111113] border border-[rgba(204,255,0,0.2)] rounded-3xl p-4 px-5 flex items-center gap-3.5 relative overflow-hidden z-10 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[#CCFF00] before:shadow-[0_0_12px_rgba(204,255,0,0.25)]">
                    <div className="font-montserrat font-black text-[42px] tracking-[-3px] leading-none text-[#CCFF00] pl-3">2°</div>
                    <div className="flex-1 ml-1">
                        <div className="font-bold text-[15px]">Carlos Augusto</div>
                        <div className="text-[11px] text-[#A1A1AA] mt-1">5 jogos · 3V 2D · você</div>
                    </div>
                    <div className="text-right ml-auto">
                        <div className="font-montserrat text-[20px] font-black text-[#CCFF00] tracking-[-1px] leading-tight">47</div>
                        <span className="text-[10px] font-semibold text-[#A1A1AA] block">pts</span>
                    </div>
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 px-5 mb-4">
                <button className="px-4 py-2 rounded-full font-montserrat text-[11px] font-extrabold tracking-[1px] uppercase border-[1.5px] border-[#CCFF00] text-[#CCFF00] bg-[rgba(204,255,0,0.06)]">Semanal</button>
                <button className="px-4 py-2 rounded-full font-montserrat text-[11px] font-extrabold tracking-[1px] uppercase border-[1.5px] border-[#27272A] text-[#A1A1AA] bg-transparent">Geral</button>
            </div>

            {/* Podium */}
            <div className="flex items-end justify-center gap-2 px-5 pt-5 relative z-10">
                {/* 3rd Place */}
                <div className="text-center flex-1 z-10 relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-montserrat font-black mx-auto border-2 border-white/10 ${podiumData[2].color} ${podiumData[2].text} text-sm`}>
                        {podiumData[2].initials}
                    </div>
                    <div className="text-[11px] font-bold mt-1 truncate">{podiumData[2].name}</div>
                    <div className="w-full bg-[#18181B] border border-[#27272A] rounded-t-lg flex items-center justify-center mt-1.5 h-[50px]">
                        <span className="font-montserrat font-black tracking-[-1px] text-[16px] text-[#CD7F32]">3°</span>
                    </div>
                </div>

                {/* 1st Place */}
                <div className="text-center flex-1 z-20 relative -mx-2 -mt-4">
                    <div className="text-[16px] text-center mb-1 animate-bounce">🏆</div>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-montserrat font-black mx-auto border-[2px] border-[#FFD700]/40 bg-gradient-to-br ${podiumData[0].color} ${podiumData[0].text} text-[16px] shadow-[0_0_20px_rgba(255,215,0,0.2)]`}>
                        {podiumData[0].initials}
                    </div>
                    <div className="text-[11px] font-bold mt-1 truncate">{podiumData[0].name}</div>
                    <div className="w-full bg-[#18181B] border border-[#FFD700]/30 rounded-t-lg flex items-start pt-2 justify-center mt-1.5 h-[70px]">
                        <span className="font-montserrat font-black tracking-[-1px] text-[18px] text-[#FFD700]">1°</span>
                    </div>
                </div>

                {/* 2nd Place */}
                <div className="text-center flex-1 z-10 relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-montserrat font-black mx-auto border-2 border-white/10 ${podiumData[1].color} ${podiumData[1].text} text-sm`}>
                        {podiumData[1].initials}
                    </div>
                    <div className="text-[11px] font-bold mt-1 truncate">{podiumData[1].name}</div>
                    <div className="w-full bg-[#18181B] border border-[#27272A] rounded-t-lg flex items-center justify-center mt-1.5 h-[58px]">
                        <span className="font-montserrat font-black tracking-[-1px] text-[16px] text-[#A1A1AA]">2°</span>
                    </div>
                </div>
            </div>

            {/* Full List */}
            <div className="px-5 pt-4 border-t border-white/5">
                <h3 className="font-montserrat font-extrabold text-[10px] tracking-[5px] uppercase text-[#A1A1AA] mb-3">Ranking Completo</h3>

                <div className="flex flex-col">
                    {restData.map((player) => (
                        <div key={player.id} className="flex items-center gap-3 py-3.5 border-b border-white/5 last:border-0 relative">
                            <div className={`font-montserrat font-black text-[20px] w-7 text-center shrink-0 ${player.isLast ? 'text-[#EF4444]' : 'text-[#A1A1AA]'}`}>
                                {player.position}
                            </div>
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-montserrat font-black text-[13px] shrink-0 relative ${player.color} ${player.text}`}>
                                {player.initials}
                                {player.isLast && (
                                    <div className="absolute -bottom-1 -right-1 text-[12px] w-5 h-5 bg-black rounded-full flex items-center justify-center border border-[#27272A]">🏮</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-[14px] truncate">{player.name}</div>
                                <div className={`text-[10px] mt-1 ${player.isLast ? 'text-[#EF4444] font-bold' : 'text-[#A1A1AA]'}`}>
                                    {player.stats}
                                </div>
                            </div>
                            <div className={`font-montserrat font-black text-[17px] tracking-[-1px] ${player.isLast ? 'text-[#EF4444]' : 'text-[#CCFF00]'}`}>
                                {player.points}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Group Invite Code */}
            <div className="mx-5 my-6 bg-[#111113] border border-[#27272A] rounded-2xl p-4 px-5 flex items-center justify-between">
                <div className="text-[12px] text-[#A1A1AA]">📨 Código do grupo</div>
                <div className="font-montserrat font-black text-[18px] tracking-[5px] text-[#CCFF00] drop-shadow-[0_0_20px_rgba(204,255,0,0.2)]">ACE24</div>
            </div>
        </div>
    );
}
