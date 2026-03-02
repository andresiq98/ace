"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { joinGroupByCode } from "@/lib/firestore-service";

export default function JoinGroupPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [code, setCode] = useState("");
    const [isJoining, setIsJoining] = useState(false);

    const handleJoin = async () => {
        if (!code.trim() || code.length < 4) {
            return alert("Digite um código válido!");
        }
        if (!user) return alert("Você precisa estar logado!");

        setIsJoining(true);
        try {
            const group = await joinGroupByCode(code.trim(), user.uid);
            if (!group) {
                alert("Código não encontrado! Verifique e tente novamente.");
                return;
            }
            console.log("[ACE] Joined group:", group.id, group.name);
            router.push("/home");
        } catch (err: any) {
            console.error("[ACE] Failed to join group:", err);
            alert(`Erro ao entrar no grupo: ${err.message}`);
        } finally {
            setIsJoining(false);
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
                    Entrar em Grupo
                </div>
                <div className="w-10"></div>
            </div>

            <div className="flex flex-col flex-1 px-5 justify-center pb-20">
                <div className="text-center mb-8">
                    <div className="text-[48px] mb-4">🎟️</div>
                    <h1 className="font-montserrat font-black text-3xl uppercase tracking-tighter leading-tight mb-2">
                        Código de<br />
                        <span className="text-[#CCFF00]">Convite</span>
                    </h1>
                    <p className="text-[#A1A1AA] text-sm">Peça o código para o admin do grupo.</p>
                </div>

                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="EX: A1B2C"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        className="w-full h-[64px] bg-[#18181B] border-2 border-[#27272A] rounded-xl text-center text-white font-montserrat text-[24px] font-black tracking-[8px] uppercase outline-none focus:border-[#CCFF00] focus:shadow-[0_0_20px_rgba(204,255,0,0.1)] transition-all placeholder:tracking-[4px] placeholder:text-[#52525B]"
                    />
                </div>

                <button
                    onClick={handleJoin}
                    disabled={isJoining}
                    className="w-full flex items-center justify-center gap-2 h-[52px] bg-[#CCFF00] text-black font-montserrat font-black text-[13px] tracking-[2px] uppercase rounded-xl transition-transform active:scale-95 shadow-[0_4px_20px_rgba(204,255,0,0.2)] disabled:opacity-50"
                >
                    {isJoining ? "Entrando..." : "Entrar na Arena"}
                </button>
            </div>
        </div>
    );
}
