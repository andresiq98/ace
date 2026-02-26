"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, signInWithGoogle, loading, error: authError } = useAuth();
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = localError || authError;

  useEffect(() => {
    console.log("[LoginPage] Auth State:", { loading, user: user?.uid });

    // Using a small timeout to ensure we don't race redirect loops
    if (!loading && user) {
      console.log("[LoginPage] Authorized user found. Redirecting to groups/create.");
      router.push("/groups/create");
    }
  }, [user, loading, router]);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setLocalError(null);
    try {
      await signInWithGoogle();
      // Router redirection is handled in the useEffect above
    } catch (err: any) {
      console.error("Failed to login", err);
      setLocalError(`Erro: ${err.message || "Falha desconhecida."}`);
      setIsAuthenticating(false);
    }
  };

  const handleWhatsAppLogin = () => {
    alert(
      "Login via WhatsApp em breve! Use o Google Sign-In por enquanto. 🎾"
    );
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-neon rounded-full animate-pulse shadow-[0_0_40px_rgba(204,255,0,0.3)]" />
          <p className="text-xs text-muted-foreground font-display font-bold tracking-[3px] uppercase">
            Carregando...
          </p>
        </div>
      </div>
    );
  }

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

        {/* Error message */}
        {displayError && (
          <div className="w-full mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
            <p className="text-red-400 text-xs font-bold whitespace-pre-line">{displayError}</p>
          </div>
        )}

        {/* Google Login — Primary */}
        <button
          onClick={handleGoogleLogin}
          disabled={isAuthenticating}
          className="w-full h-[58px] bg-white rounded-[14px] flex items-center justify-center gap-3 font-display text-[13px] font-extrabold tracking-[1.5px] uppercase text-black cursor-pointer mb-2.5 transition-all duration-200 shadow-[0_4px_20px_rgba(255,255,255,0.1)] relative overflow-hidden active:scale-[0.96] active:shadow-[0_2px_10px_rgba(255,255,255,0.05)] disabled:opacity-50 disabled:pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] to-transparent pointer-events-none" />
          {isAuthenticating ? (
            <>
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Entrando...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Entrar com Google
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full my-3">
          <div className="flex-1 h-[1px] bg-ace-border" />
          <span className="text-[9px] tracking-[3px] text-ace-muted font-display font-bold uppercase">
            ou
          </span>
          <div className="flex-1 h-[1px] bg-ace-border" />
        </div>

        {/* WhatsApp Login — Secondary */}
        <button
          onClick={handleWhatsAppLogin}
          disabled={isAuthenticating}
          className="w-full h-[52px] bg-transparent border-[1.5px] border-ace-border rounded-xl font-display text-xs font-extrabold tracking-[1.5px] uppercase text-muted-foreground cursor-pointer mb-7 transition-all duration-200 active:border-[#25D366] active:text-[#25D366] flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Entrar com WhatsApp
          <span className="text-[8px] text-ace-muted ml-1">(em breve)</span>
        </button>

        <p className="text-[11px] text-ace-muted text-center leading-[1.6]">
          Liga privada · Apenas amigos 🎾
        </p>
      </div>
    </div>
  );
}
