"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createGroup } from "@/lib/firestore-service";

const EMOJIS = ["🎾", "🏆", "⚡", "🔥", "💀", "🦁"];

export default function CreateGroupPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("🎾");
    const [resetFilter, setResetFilter] = useState("Semanal");
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) return alert("Digite um nome para a liga!");
        if (!user) return alert("Você precisa estar logado!");

        setIsCreating(true);
        try {
            const group = await createGroup(name.trim(), "zoeira", user.uid);
            console.log("[ACE] Group created:", group.id, "Code:", group.inviteCode);
            router.push(`/home`);
        } catch (err: any) {
            console.error("[ACE] Failed to create group:", err);
            alert(`Erro ao criar grupo: ${err.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black text-white relative overflow-hidden">
            {/* Topbar */}
            <div className="flex items-center justify-between p-5 pt-8 relative z-10 w-full mb-4">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center text-xl text-white font-black"
                >
                    ←
                </button>
                <div className="font-montserrat font-black text-[13px] tracking-[1.5px] uppercase flex items-center gap-2">
                    Criar Grupo
                </div>
                <div className="w-10"></div>
            </div>

            <div className="px-5 mb-6">
                <h1 className="font-montserrat font-black text-3xl uppercase tracking-tighter leading-tight">
                    Monte sua<br />
                    <span className="text-[#CCFF00]">arena 🏟️</span>
                </h1>
            </div>

            <div className="px-5 flex flex-col flex-1 pb-10">
                <div className="mb-5 relative">
                    <label className="text-[9px] tracking-[4px] uppercase font-bold text-[#A1A1AA] font-montserrat block mb-2">Nome do grupo</label>
                    <input
                        type="text"
                        placeholder="Ex: Clube dos Coxos"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-[52px] bg-[#18181B] border-2 border-[#27272A] rounded-xl px-4 text-white font-montserrat text-[15px] font-bold outline-none focus:border-[#CCFF00] focus:shadow-[0_0_16px_rgba(204,255,0,0.08)] transition-all"
                    />
                </div>

                <div className="mb-5">
                    <label className="text-[9px] tracking-[4px] uppercase font-bold text-[#A1A1AA] font-montserrat block mb-2">Emoji do grupo</label>
                    <div className="flex gap-2">
                        {EMOJIS.map(e => (
                            <button
                                key={e}
                                onClick={() => setEmoji(e)}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${emoji === e ? 'border-2 border-[#CCFF00] bg-[rgba(204,255,0,0.04)]' : 'border-2 border-[#27272A] bg-transparent'}`}
                            >
                                {e}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <label className="text-[9px] tracking-[4px] uppercase font-bold text-[#A1A1AA] font-montserrat block mb-2">Ranking reseta</label>
                    <div className="flex bg-[#111113] border border-[#27272A] rounded-xl p-1 gap-1">
                        <button
                            onClick={() => setResetFilter("Semanal")}
                            className={`flex-1 h-10 rounded-lg flex items-center justify-center font-montserrat font-extrabold text-sm tracking-[1px] transition-all ${resetFilter === 'Semanal' ? 'bg-[#CCFF00] text-black shadow-[0_2px_12px_rgba(204,255,0,0.2)]' : 'text-[#A1A1AA] hover:text-white'}`}
                        >
                            Semanal
                        </button>
                        <button
                            onClick={() => setResetFilter("Mensal")}
                            className={`flex-1 h-10 rounded-lg flex items-center justify-center font-montserrat font-extrabold text-sm tracking-[1px] transition-all ${resetFilter === 'Mensal' ? 'bg-[#CCFF00] text-black shadow-[0_2px_12px_rgba(204,255,0,0.2)]' : 'text-[#A1A1AA] hover:text-white'}`}
                        >
                            Mensal
                        </button>
                    </div>
                </div>

                <div className="mt-auto">
                    <button
                        onClick={handleCreate}
                        disabled={isCreating}
                        className="w-full flex items-center justify-center gap-2 h-[52px] bg-[#CCFF00] text-black font-montserrat font-black text-[13px] tracking-[2px] uppercase rounded-xl transition-transform active:scale-95 shadow-[0_4px_20px_rgba(204,255,0,0.2)] disabled:opacity-50"
                    >
                        {isCreating ? "Criando..." : "🏟️ Criar Arena"}
                    </button>
                </div>
            </div>
        </div>
    );
}
