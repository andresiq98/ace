"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinGroupPage() {
    const router = useRouter();
    const [code, setCode] = useState("");

    const handleJoin = () => {
        if (!code.trim() || code.length < 4) {
            return alert("Digite um código válido!");
        }

        // For MVP, simulate joining and redirect
        console.log("Joining Group with code:", code);

        // In the real app, we check Firestore for the group code,
        // Add user to the group members list, and redirect
        router.push("/home");
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
                        placeholder="EX: A1B2"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        maxLength={6}
                        className="w-full h-[64px] bg-[#18181B] border-2 border-[#27272A] rounded-xl text-center text-white font-montserrat text-[24px] font-black tracking-[8px] uppercase outline-none focus:border-[#CCFF00] focus:shadow-[0_0_20px_rgba(204,255,0,0.1)] transition-all placeholder:tracking-[4px] placeholder:text-[#52525B]"
                    />
                </div>

                <button
                    onClick={handleJoin}
                    className="w-full flex items-center justify-center gap-2 h-[52px] bg-[#CCFF00] text-black font-montserrat font-black text-[13px] tracking-[2px] uppercase rounded-xl transition-transform active:scale-95 shadow-[0_4px_20px_rgba(204,255,0,0.2)]"
                >
                    Entrar na Arena
                </button>
            </div>
        </div>
    );
}
