"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/home");
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    try {
      await signInWithGoogle();
      // Router redirection is handled in the useEffect above
    } catch (error) {
      console.error("Failed to login", error);
      setIsAuthenticating(false);
    }
  };

  const handleWhatsAppLogin = () => {
    // For MVP WhatsApp login, we'll prompt the user or redirect to a WA bot
    // Since native Firebase WA requires identity platform or custom auth,
    // we can use a placeholder alert for now or implement phone auth.
    alert("Login via WhatsApp em desenvolvimento. Use o Google Sign-In para testar o MVP.");
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;

  return (
    <div className="flex flex-col items-center justify-center p-10 h-full relative overflow-hidden bg-black text-white">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(204,255,0,0.08)_0%,transparent_65%)] animate-[pulseGlow_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-[10%] right-[-60px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(204,255,0,0.04)_0%,transparent_70%)] animate-[pulseGlow_5s_ease-in-out_infinite_1s]" />
      </div>

      <div className="flex flex-col items-center w-full relative z-10 flex-1 justify-center">
        {/* Logo Brand */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative w-20 h-20 animate-[floatBall_3s_ease-in-out_infinite]">
            <div className="w-20 h-20 bg-[#CCFF00] rounded-full shadow-[0_0_60px_rgba(204,255,0,0.4),_0_0_120px_rgba(204,255,0,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_35%_30%,rgba(255,255,255,0.35)_0%,transparent_50%)]" />
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute w-full h-[45%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[2px] border-black/20 rounded-full" />
                <div className="absolute w-[45%] h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[2px] border-black/20 rounded-full" />
              </div>
            </div>
          </div>
          <div className="text-center">
            <h1 className="font-montserrat font-black text-[80px] tracking-[-4px] uppercase leading-none text-white drop-shadow-[0_0_80px_rgba(255,255,255,0.08)]">ACE</h1>
            <p className="text-[10px] tracking-[7px] font-bold text-[#CCFF00] uppercase drop-shadow-[0_0_20px_rgba(204,255,0,0.4)]">Tênis Competitivo</p>
          </div>
        </div>

        <p className="text-[15px] text-[#52525B] text-center italic mb-12 max-w-[260px] leading-relaxed">
          Amassando os amigos,<br />um ace de cada vez.
        </p>

        {/* Action Buttons */}
        <div className="w-full max-w-[300px] flex flex-col gap-3">
          <button
            onClick={handleWhatsAppLogin}
            disabled={isAuthenticating}
            className="w-full flex items-center justify-center gap-2 h-[52px] bg-[#25D366] text-white font-montserrat font-black text-[13px] tracking-[2px] uppercase rounded-xl transition-transform active:scale-95 shadow-[0_4px_20px_rgba(37,211,102,0.2)] disabled:opacity-50"
          >
            📱 Entrar com WhatsApp
          </button>

          <div className="text-center text-[#A1A1AA] text-xs my-2 font-bold">OU</div>

          <button
            onClick={handleGoogleLogin}
            disabled={isAuthenticating}
            className="w-full h-[52px] bg-white border-none rounded-xl flex items-center justify-center gap-3 font-montserrat text-xs font-extrabold tracking-[1.5px] uppercase text-black cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
          >
            🔵 Entrar com Google
          </button>
        </div>

        <p className="text-[11px] text-[#52525B] text-center leading-relaxed mt-10">
          Liga privada · Apenas amigos 🎾
        </p>
      </div>
    </div>
  );
}
