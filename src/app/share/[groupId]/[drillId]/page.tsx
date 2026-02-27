"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { getDrillById } from "@/lib/drills";
import { CURRENT_USER, MOCK_PLAYERS, MOCK_LEADERBOARD, MOCK_GROUP } from "@/lib/data";



function ShareContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const cardRef = useRef<HTMLDivElement>(null);

    const drillId = params.drillId as string;
    const drill = getDrillById(drillId);
    const score = searchParams.get("score") || "6×2";
    const winnerId = searchParams.get("winner") || CURRENT_USER.id;
    const rivalId = searchParams.get("rival") || "user-rafael";

    const winner = MOCK_PLAYERS.find(p => p.id === winnerId) || CURRENT_USER;
    const rival = MOCK_PLAYERS.find(p => p.id === rivalId) || MOCK_PLAYERS[1];
    const loser = winnerId === CURRENT_USER.id ? rival : CURRENT_USER;

    const [showToast, setShowToast] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageSent, setImageSent] = useState(false);
    const [confetti, setConfetti] = useState<Array<{ id: number, left: string, color: string, delay: string, duration: string, size: string, radius: string }>>([]);

    useEffect(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3500);

        const colors = ["#CCFF00", "#FFD700", "#EF4444", "#2979FF", "#B388FF", "#FAFAFA"];
        const items = Array.from({ length: 40 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: `${Math.random() * 0.8}s`,
            duration: `${1 + Math.random()}s`,
            size: `${4 + Math.random() * 8}px`,
            radius: Math.random() > 0.5 ? "50%" : "2px",
        }));
        setConfetti(items);
        setTimeout(() => setConfetti([]), 3000);
    }, []);

    // Auto-generate image on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            generateImage();
        }, 500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const generateImage = useCallback(async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);
        try {
            // Get actual dimensions of the card
            const rect = cardRef.current.getBoundingClientRect();
            const dataUrl = await toPng(cardRef.current, {
                quality: 1.0,
                pixelRatio: 3,
                backgroundColor: "#080A00",
                width: rect.width,
                height: rect.height,
                style: {
                    overflow: "visible",
                    borderRadius: "0",
                    margin: "0",
                    transform: "none",
                },
            });
            setImageUrl(dataUrl);
        } catch (err) {
            console.error("Error generating image:", err);
        }
        setIsGenerating(false);
    }, []);

    const handleShareImage = async () => {
        if (!imageUrl) {
            await generateImage();
            return;
        }

        try {
            const res = await fetch(imageUrl);
            const blob = await res.blob();
            const file = new File([blob], "ace-resultado.png", { type: "image/png" });

            // Share IMAGE ONLY (no text)
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file] });
                setImageSent(true);
            } else {
                // Fallback: download image
                const link = document.createElement("a");
                link.download = "ace-resultado.png";
                link.href = imageUrl;
                link.click();
                setImageSent(true);
            }
        } catch (err) {
            console.error("Share failed:", err);
            // If user dismissed share dialog, still allow step 2
            setImageSent(true);
        }
    };

    // Step 2: Send the link text AFTER the image
    const handleSendLink = () => {
        const shareText = `🎾 Resultado\n\n📲 Entre na comunidade ACE: ace.app/join/${MOCK_GROUP.inviteCode}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
    };

    const handleDownloadImage = async () => {
        if (!imageUrl) await generateImage();
        if (imageUrl) {
            const link = document.createElement("a");
            link.download = "ace-resultado.png";
            link.href = imageUrl;
            link.click();
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Top Bar */}
            <header className="flex items-center justify-between px-5 pt-14 pb-3.5 sticky top-0 bg-background/92 backdrop-blur-[24px] saturate-[180%] z-50 border-b border-white/[0.04]">
                <div className="font-display font-black text-[22px] tracking-[-1.5px] uppercase flex items-center gap-2.5">
                    <div className="w-[22px] h-[22px] bg-neon rounded-full relative shadow-[0_0_16px_rgba(204,255,0,0.25)]">
                        <div className="absolute inset-[3px] rounded-full border-[1.5px] border-black/20" />
                    </div>
                    <span className="text-neon neon-text-glow">ACE</span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {/* Title */}
                <div className="px-5 pt-3 pb-3.5">
                    <h1 className="font-display font-black text-[38px] uppercase tracking-[-2px] leading-[0.92]">
                        COMPARTI-<br />LHE <span className="text-neon">🏆</span>
                    </h1>
                </div>

                {/* ═══ SHARE CARD (captured by html-to-image) ═══ */}
                <div
                    ref={cardRef}
                    className="mx-4 mb-4 bg-gradient-to-br from-[#0C1400] to-[#080A00] border border-neon/15 rounded-[22px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_60px_rgba(204,255,0,0.03)]"
                    style={{ fontFamily: "'Montserrat', 'Arial', sans-serif" }}
                >
                    {/* Card Header */}
                    <div className="flex items-center justify-between px-[18px] py-4 border-b border-white/[0.03]">
                        <div>
                            <div className="font-display font-black text-base uppercase tracking-[-0.5px]">
                                <span className="text-neon">ACE</span>
                            </div>
                            <div className="text-[8px] tracking-[4px] text-ace-muted uppercase font-display font-bold">
                                Tênis Competitivo
                            </div>
                        </div>
                        <div className="text-[10px] text-ace-muted text-right">
                            Grupo<strong className="block text-white text-[13px] font-bold">{MOCK_GROUP.name}</strong>
                        </div>
                    </div>

                    {/* Mission + VS */}
                    <div className="px-[18px] py-[18px] border-b border-white/[0.03] text-center">
                        <div className="text-[8px] tracking-[5px] text-neon font-bold uppercase font-display mb-3.5">
                            {drill?.emoji} {drill?.title || "Set Normal"}
                        </div>
                        <div className="flex items-center justify-center gap-3.5">
                            {/* Winner */}
                            <div className="text-center flex-1">
                                <div
                                    className="w-[52px] h-[52px] rounded-full mx-auto mb-2 flex items-center justify-center font-display font-black text-[17px] border-2 border-neon"
                                    style={{ background: winner.gradient, color: winner.textColor }}
                                >
                                    {winner.initials}
                                </div>
                                <div className="font-bold text-[13px] text-white">{winner.displayName.split(" ")[0]}</div>
                                <div className="text-[9px] font-extrabold text-neon mt-1 font-display tracking-[1.5px]">🏆 VENCEDOR</div>
                            </div>

                            {/* Score */}
                            <div className="font-display font-black text-[44px] tracking-[-1px] text-white">{score}</div>

                            {/* Loser */}
                            <div className="text-center flex-1">
                                <div
                                    className="w-[52px] h-[52px] rounded-full mx-auto mb-2 flex items-center justify-center font-display font-black text-[17px] border-2 border-white/20 opacity-40"
                                    style={{ background: loser.gradient, color: loser.textColor }}
                                >
                                    {loser.initials}
                                </div>
                                <div className="font-bold text-[13px] text-white/50">{loser.displayName.split(" ")[0]}</div>
                            </div>
                        </div>
                    </div>

                    {/* Top 3 */}
                    <div className="px-[18px] py-3.5 border-b border-white/[0.03]">
                        <div className="text-[8px] tracking-[4px] uppercase text-ace-muted font-display font-bold mb-3">
                            Top 3 Atualizado
                        </div>
                        {MOCK_LEADERBOARD.slice(0, 3).map((entry, i) => (
                            <div key={entry.userId} className="flex items-center gap-2.5 mb-2">
                                <div className={`font-display font-black text-sm w-[18px] ${i === 0 ? "text-[#FFD700]" : i === 1 ? "text-[#C0C0C0]" : "text-[#CD7F32]"
                                    }`}>
                                    {i + 1}
                                </div>
                                <div
                                    className="w-[26px] h-[26px] rounded-full flex items-center justify-center font-black text-[9px]"
                                    style={{ background: entry.player.gradient, color: entry.player.textColor }}
                                >
                                    {entry.player.initials}
                                </div>
                                <div className={`flex-1 text-[13px] font-semibold ${entry.userId === CURRENT_USER.id ? "text-neon" : i === 2 ? "text-white/50" : "text-white"
                                    }`}>
                                    {entry.player.displayName.split(" ")[0]} {entry.userId === CURRENT_USER.id && "←"}
                                </div>
                                <div className="font-display text-xs font-black text-neon">{entry.points}</div>
                            </div>
                        ))}
                    </div>

                    {/* Badges */}
                    <div className="grid grid-cols-2 gap-2 px-[18px] py-3.5 border-b border-white/[0.03]">
                        <div className="rounded-xl p-3 text-center bg-[#FFD700]/5 border border-[#FFD700]/15">
                            <span className="text-2xl block mb-1">🏆</span>
                            <div className="text-[8px] font-extrabold tracking-[1.5px] uppercase font-display text-[#FFD700]">Campeão</div>
                            <div className="text-[11px] font-bold mt-[3px] text-white">Rafael M.</div>
                        </div>
                        <div className="rounded-xl p-3 text-center bg-[#EF4444]/5 border border-[#EF4444]/[0.12]">
                            <span className="text-2xl block mb-1">🏮</span>
                            <div className="text-[8px] font-extrabold tracking-[1.5px] uppercase font-display text-[#EF4444]">Lanterna</div>
                            <div className="text-[11px] font-bold mt-[3px] text-white">João P.</div>
                        </div>
                    </div>

                    {/* Invite Code */}
                    <div className="px-[18px] py-3.5 text-center">
                        <span className="font-display font-black text-[22px] tracking-[6px] text-neon block">
                            {MOCK_GROUP.inviteCode}
                        </span>
                        <span className="text-[9px] tracking-[4px] text-ace-muted uppercase mt-[3px] font-display block">
                            entre no grupo · ace app
                        </span>
                    </div>
                </div>

                {/* Compact Image Preview */}
                {imageUrl && (
                    <div className="mx-4 mb-3 bg-ace-surface border border-neon/10 rounded-xl p-2.5 flex items-center gap-3 animate-slide-up">
                        <img src={imageUrl} alt="Share card preview" className="w-[72px] h-[72px] rounded-lg border border-white/[0.06] object-cover object-top shrink-0" />
                        <div className="flex-1 min-w-0">
                            <div className="text-[9px] tracking-[2px] text-neon font-bold uppercase font-display mb-1">📸 Imagem Pronta</div>
                            <div className="text-[11px] text-ace-mid font-semibold">{winner.displayName.split(" ")[0]} {score} {loser.displayName.split(" ")[0]}</div>
                            <div className="text-[10px] text-ace-muted mt-0.5">PNG · Alta resolução</div>
                        </div>
                        <div className="text-neon text-lg shrink-0">✓</div>
                    </div>
                )}

                {/* Status */}
                {isGenerating && (
                    <div className="mx-4 mb-3 text-center text-[11px] text-neon font-display font-bold tracking-[2px] uppercase animate-pulse">
                        ⏳ Gerando imagem...
                    </div>
                )}

                {/* ═══ SHARE BUTTONS — TWO-STEP FLOW ═══ */}

                {/* Step 1: Send Image */}
                {!imageSent ? (
                    <button
                        onClick={handleShareImage}
                        disabled={isGenerating}
                        className="mx-4 mb-2.5 h-[58px] bg-[#25D366] rounded-[14px] flex items-center justify-center gap-2.5 font-display font-black text-[12px] tracking-[2px] uppercase text-white cursor-pointer transition-all duration-200 shadow-[0_4px_20px_rgba(37,211,102,0.2)] active:scale-[0.97] w-[calc(100%-32px)] disabled:opacity-50 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        ① ENVIAR IMAGEM
                    </button>
                ) : (
                    <>
                        {/* Step 1 done indicator */}
                        <div className="mx-4 mb-2 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl py-2.5 flex items-center justify-center gap-2 font-display font-bold text-[11px] tracking-[1.5px] uppercase text-[#25D366]">
                            ✅ Imagem enviada!
                        </div>

                        {/* Step 2: Send Link Text */}
                        <button
                            onClick={handleSendLink}
                            className="mx-4 mb-2.5 h-[58px] bg-[#25D366] rounded-[14px] flex items-center justify-center gap-2.5 font-display font-black text-[12px] tracking-[2px] uppercase text-white cursor-pointer transition-all duration-200 shadow-[0_4px_20px_rgba(37,211,102,0.2)] active:scale-[0.97] w-[calc(100%-32px)] relative overflow-hidden animate-slide-up"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            ② ENVIAR LINK DA COMUNIDADE
                        </button>
                    </>
                )}

                {/* Download image */}
                <button
                    onClick={handleDownloadImage}
                    disabled={isGenerating}
                    className="mx-4 mb-2.5 h-[48px] bg-ace-surface border-[1.5px] border-ace-border rounded-xl flex items-center justify-center gap-2 font-display text-[11px] font-extrabold tracking-[1.5px] uppercase text-ace-mid cursor-pointer transition-all duration-200 active:border-neon active:text-neon w-[calc(100%-32px)]"
                >
                    📥 SALVAR IMAGEM NA GALERIA
                </button>

                <div className="px-4 pb-7">
                    <button
                        onClick={() => router.push("/home")}
                        className="w-full h-[48px] bg-transparent border-[1.5px] border-ace-border rounded-xl font-display text-[11px] font-extrabold tracking-[1.5px] uppercase text-ace-muted cursor-pointer transition-all duration-200 active:border-neon active:text-neon active:bg-neon/[0.03]"
                    >
                        ← VOLTAR PRA ARENA
                    </button>
                </div>
            </div>

            {/* Toast */}
            <div className={`fixed left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[400px] bg-neon text-background font-display font-black text-xs tracking-[2.5px] text-center uppercase py-[18px] px-5 z-[1100] transition-[top] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-2xl shadow-[0_8px_32px_rgba(204,255,0,0.3)] ${showToast ? "top-14" : "-top-20"
                }`}>
                🏆 RESULTADO SALVO! RANKING ATUALIZADO!
            </div>

            {/* Confetti */}
            <div className="fixed inset-0 pointer-events-none z-[998] overflow-hidden">
                {confetti.map((c) => (
                    <div
                        key={c.id}
                        className="absolute"
                        style={{
                            left: c.left,
                            width: c.size,
                            height: c.size,
                            background: c.color,
                            borderRadius: c.radius,
                            animation: `confetti-fall ${c.duration} ease-in forwards`,
                            animationDelay: c.delay,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default function SharePage() {
    return (
        <Suspense fallback={<div className="h-full flex items-center justify-center text-ace-muted">Carregando...</div>}>
            <ShareContent />
        </Suspense>
    );
}
