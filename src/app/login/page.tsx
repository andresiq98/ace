"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [showPhoneInput, setShowPhoneInput] = useState(false);

    const handleWhatsAppLogin = () => {
        // MVP: Mock login — redirect to home
        // TODO: Integrate Firebase Auth with WhatsApp Business API
        router.push("/home");
    };

    const handlePhoneLogin = () => {
        if (phone.length >= 10) {
            // MVP: Mock login — redirect to home
            // TODO: Integrate Firebase Phone Auth (SMS verification)
            router.push("/home");
        }
    };

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 11);
        if (digits.length <= 2) return `(${digits}`;
        if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    };

    return (
        <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(204,255,0,0.08)_0%,transparent_65%)] -top-[120px] left-1/2 -translate-x-1/2 animate-pulse-glow" />
                <div className="absolute w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(204,255,0,0.04)_0%,transparent_70%)] bottom-[10%] -right-[60px] animate-pulse-glow [animation-delay:1s]" />
            </div>

            {/* Content */}
            <div className="flex flex-col items-center px-9 w-full relative z-10">
                {/* Brand */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    {/* Ball */}
                    <div className="w-20 h-20 relative animate-float">
                        <div className="w-20 h-20 bg-neon rounded-full shadow-[0_0_60px_rgba(204,255,0,0.4),0_0_120px_rgba(204,255,0,0.15)] relative overflow-hidden">
                            <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_35%_30%,rgba(255,255,255,0.35)_0%,transparent_50%)]" />
                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                <div className="absolute border-2 border-black/20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[45%]" />
                                <div className="absolute border-2 border-black/20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] h-full" />
                            </div>
                        </div>
                    </div>

                    {/* Wordmark */}
                    <div className="text-center">
                        <h1 className="font-display font-black text-[80px] leading-none tracking-[-4px] uppercase text-white [text-shadow:0_0_80px_rgba(255,255,255,0.08)]">
                            ACE
                        </h1>
                        <p className="text-[10px] tracking-[7px] font-bold text-neon uppercase neon-text-glow">
                            Tênis Competitivo
                        </p>
                    </div>
                </div>

                {/* Tagline */}
                <p className="text-[15px] text-muted-foreground text-center leading-[1.7] italic mb-10 max-w-[260px]">
                    Amassando os amigos,<br />um ace de cada vez.
                </p>

                {/* WhatsApp Login — Primary */}
                <button
                    onClick={handleWhatsAppLogin}
                    className="w-full h-[58px] bg-[#25D366] rounded-[14px] flex items-center justify-center gap-3 font-display text-[13px] font-extrabold tracking-[1.5px] uppercase text-white cursor-pointer mb-2.5 transition-all duration-200 shadow-[0_4px_20px_rgba(37,211,102,0.25)] relative overflow-hidden active:scale-[0.96] active:shadow-[0_2px_10px_rgba(37,211,102,0.15)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] to-transparent pointer-events-none" />
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" className="shrink-0">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Entrar com WhatsApp
                </button>

                {/* Phone Login */}
                {!showPhoneInput ? (
                    <button
                        onClick={() => setShowPhoneInput(true)}
                        className="w-full h-[52px] bg-transparent border-[1.5px] border-ace-border rounded-xl font-display text-xs font-extrabold tracking-[1.5px] uppercase text-muted-foreground cursor-pointer mb-2.5 transition-all duration-200 active:border-neon active:text-neon flex items-center justify-center gap-2.5"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        Entrar com Telefone
                    </button>
                ) : (
                    <div className="w-full mb-2.5 animate-slide-up">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="tel"
                                    placeholder="(11) 99999-9999"
                                    value={phone}
                                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                                    className="w-full h-[52px] bg-ace-surface border-[1.5px] border-ace-border rounded-xl px-4 font-display text-sm font-bold text-foreground placeholder:text-ace-muted focus:border-neon focus:outline-none transition-all duration-200"
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={handlePhoneLogin}
                                disabled={phone.replace(/\D/g, "").length < 10}
                                className="h-[52px] px-5 bg-neon text-background rounded-xl font-display font-black text-xs tracking-[1px] uppercase transition-all duration-200 active:scale-[0.94] disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center gap-1.5 shrink-0"
                            >
                                ENTRAR →
                            </button>
                        </div>
                        <p className="text-[10px] text-ace-muted mt-2 text-center">
                            Enviaremos um código SMS para verificação
                        </p>
                    </div>
                )}

                {/* Divider */}
                <div className="flex items-center gap-3 w-full my-3">
                    <div className="flex-1 h-[1px] bg-ace-border" />
                    <span className="text-[9px] tracking-[3px] text-ace-muted font-display font-bold uppercase">ou</span>
                    <div className="flex-1 h-[1px] bg-ace-border" />
                </div>

                {/* Google Login — Secondary */}
                <button
                    onClick={handleWhatsAppLogin}
                    className="w-full h-[48px] bg-transparent border-[1.5px] border-ace-border rounded-xl font-display text-[11px] font-extrabold tracking-[1.5px] uppercase text-muted-foreground cursor-pointer mb-7 transition-all duration-200 active:border-neon active:text-neon flex items-center justify-center gap-2.5"
                >
                    <div className="w-5 h-5 rounded-full bg-[conic-gradient(#4285F4_0deg_90deg,#34A853_90deg_180deg,#FBBC05_180deg_270deg,#EA4335_270deg_360deg)] flex items-center justify-center text-[9px] font-black text-white shrink-0">
                        G
                    </div>
                    Entrar com Google
                </button>

                <p className="text-[11px] text-ace-muted text-center leading-[1.6]">
                    Liga privada · Apenas amigos 🎾
                </p>
            </div>
        </div>
    );
}
