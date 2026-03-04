"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { getDrillById } from "@/lib/drills";
import { getGroup, getGroupLeaderboard, LeaderboardEntry, Group } from "@/lib/firestore-service";
import { useAuth } from "@/lib/auth-context";

function ShareContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();
    const cardRef = useRef<HTMLDivElement>(null);

    const drillId = params.drillId as string;
    const groupId = params.groupId as string;

    // Fallback drill info
    const drillRaw = getDrillById(drillId);
    const drill = drillRaw || { emoji: "🎾", title: "Set Normal" };

    const score = searchParams.get("score") || "6×0";
    const winnerId = searchParams.get("winner");
    const rivalId = searchParams.get("rival");

    const [group, setGroup] = useState<Group | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [showToast, setShowToast] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageSent, setImageSent] = useState(false);
    const [confetti, setConfetti] = useState<Array<{ id: number, left: string, color: string, delay: string, duration: string, size: string, radius: string }>>([]);

    useEffect(() => {
        async function loadData() {
            if (!groupId) return;
            try {
                const groupData = await getGroup(groupId);
                setGroup(groupData);

                const lb = await getGroupLeaderboard(groupId);
                setLeaderboard(lb);
            } catch (err) {
                console.error("Failed to load share data:", err);
            } finally {
                setIsLoadingData(false);
            }
        }
        loadData();
    }, [groupId]);

    useEffect(() => {
        if (isLoadingData) return;

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
    }, [isLoadingData]);

    const generateImage = useCallback(async () => {
        if (!cardRef.current || isLoadingData) return;
        setIsGenerating(true);
        try {
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
    }, [isLoadingData]);

    // Auto-generate image on mount when data is ready
    useEffect(() => {
        if (isLoadingData) return;
        const timer = setTimeout(() => {
            generateImage();
        }, 500);
        return () => clearTimeout(timer);
    }, [isLoadingData, generateImage]);

    const handleShareImage = async () => {
        if (!imageUrl) {
            await generateImage();
            return;
        }

        try {
            const res = await fetch(imageUrl);
            const blob = await res.blob();
            const file = new File([blob], "ace-resultado.png", { type: "image/png" });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file] });
                setImageSent(true);
            } else {
                const link = document.createElement("a");
                link.download = "ace-resultado.png";
                link.href = imageUrl;
                link.click();
                setImageSent(true);
            }
        } catch (err) {
            console.error("Share failed:", err);
            setImageSent(true);
        }
    };

    const handleSendLink = () => {
        const inviteCode = group?.inviteCode || "";
        // In real life this would point to the domain. Since we're in MVP with Firebase Hosting, we use the host
        const domain = window.location.host;
        const link = `https://${domain}/groups/join?code=${inviteCode}`;
        const shareText = `🎾 Resultado da máquina!\n\n📲 Entre no grupo ${group?.name || "ACE"} para participar do ranking:\n${link}`;

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

    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="w-6 h-6 border-2 border-[#CCFF00]/30 border-t-[#CCFF00] rounded-full animate-spin" />
            </div>
        );
    }

    const winnerEntry = leaderboard.find(l => l.userId === winnerId) || leaderboard[0];
    const loserEntry = leaderboard.find(l => l.userId === rivalId && rivalId !== winnerId) || leaderboard.find(l => l.userId !== winnerId);

    // Fallback if missing
    const winner = winnerEntry || { displayName: "Player 1", initials: "P1", gradient: "linear-gradient(135deg, #CCFF00, #A8D400)", textColor: "#000", photoURL: undefined };
    const loser = loserEntry || { displayName: "Player 2", initials: "P2", gradient: "linear-gradient(135deg, #2979FF, #0D47A1)", textColor: "#FFF", photoURL: undefined };

    const top3 = leaderboard.slice(0, 3);
    const isPlayerInTop3 = top3.some(l => l.userId === user?.uid);

    return (
        <div className="h-full flex flex-col">
            <header className="flex items-center justify-between px-5 pt-14 pb-3.5 sticky top-0 bg-background/92 backdrop-blur-[24px] saturate-[180%] z-50 border-b border-white/[0.04]">
                <div className="font-display font-black text-[22px] tracking-[-1.5px] uppercase flex items-center gap-2.5">
                    <div className="w-[22px] h-[22px] bg-neon rounded-full relative shadow-[0_0_16px_rgba(204,255,0,0.25)]">
                        <div className="absolute inset-[3px] rounded-full border-[1.5px] border-black/20" />
                    </div>
                    <span className="text-neon neon-text-glow">ACE</span>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="px-5 pt-3 pb-3.5">
                    <h1 className="font-display font-black text-[38px] uppercase tracking-[-2px] leading-[0.92]">
                        COMPARTI-<br />LHE <span className="text-neon">🏆</span>
                    </h1>
                </div>

                {/* ═══ SHARE CARD ═══ */}
                <div
                    ref={cardRef}
                    className="mx-4 mb-4 bg-gradient-to-br from-[#0C1400] to-[#080A00] border border-neon/15 rounded-[22px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_60px_rgba(204,255,0,0.03)]"
                    style={{ fontFamily: "'Montserrat', 'Arial', sans-serif" }}
                >
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
                            Grupo<strong className="block text-white text-[13px] font-bold">{group?.name || "ACE"}</strong>
                        </div>
                    </div>

                    <div className="px-[18px] py-[18px] border-b border-white/[0.03] text-center">
                        <div className="text-[8px] tracking-[5px] text-neon font-bold uppercase font-display mb-3.5">
                            {drill.emoji} {drill.title}
                        </div>
                        <div className="flex items-center justify-center gap-3.5">
                            <div className="text-center flex-1">
                                <div
                                    className="w-[52px] h-[52px] rounded-full mx-auto mb-2 flex items-center justify-center font-display font-black text-[17px] border-2 border-neon overflow-hidden"
                                    style={{ background: winner.gradient, color: winner.textColor }}
                                >
                                    {winner.photoURL ? <img src={winner.photoURL} alt="" className="w-full h-full object-cover" /> : winner.initials}
                                </div>
                                <div className="font-bold text-[13px] text-white">{winner.displayName.split(" ")[0]}</div>
                                <div className="text-[9px] font-extrabold text-neon mt-1 font-display tracking-[1.5px]">🏆 VENCEDOR</div>
                            </div>
                            <div className="font-display font-black text-[44px] tracking-[-1px] text-white">{score}</div>
                            <div className="text-center flex-1">
                                <div
                                    className="w-[52px] h-[52px] rounded-full mx-auto mb-2 flex items-center justify-center font-display font-black text-[17px] border-2 border-white/20 opacity-40 overflow-hidden"
                                    style={{ background: loser.gradient, color: loser.textColor }}
                                >
                                    {loser.photoURL ? <img src={loser.photoURL} alt="" className="w-full h-full object-cover" /> : loser.initials}
                                </div>
                                <div className="font-bold text-[13px] text-white/50">{loser.displayName.split(" ")[0]}</div>
                            </div>
                        </div>
                    </div>

                    <div className="px-[18px] py-3.5 border-b border-white/[0.03]">
                        <div className="text-[8px] tracking-[4px] uppercase text-ace-muted font-display font-bold mb-3">
                            Top 3 Atualizado
                        </div>
                        {top3.map((entry, i) => (
                            <div key={entry.userId} className="flex items-center gap-2.5 mb-2">
                                <div className={`font-display font-black text-sm w-[18px] ${i === 0 ? "text-[#FFD700]" : i === 1 ? "text-[#C0C0C0]" : "text-[#CD7F32]"}`}>
                                    {i + 1}
                                </div>
                                <div
                                    className="w-[26px] h-[26px] rounded-full flex items-center justify-center font-black text-[9px] overflow-hidden"
                                    style={{ background: entry.gradient, color: entry.textColor }}
                                >
                                    {entry.photoURL ? <img src={entry.photoURL} alt="" className="w-full h-full object-cover" /> : entry.initials}
                                </div>
                                <div className={`flex-1 text-[13px] font-semibold ${entry.userId === user?.uid ? "text-neon" : i === 2 ? "text-white/50" : "text-white"}`}>
                                    {entry.displayName.split(" ")[0]} {entry.userId === user?.uid && "←"}
                                </div>
                                <div className="font-display text-xs font-black text-neon">{entry.points}</div>
                            </div>
                        ))}
                        {user && !isPlayerInTop3 && (
                            <div className="flex items-center gap-2.5 mt-3 pt-2 border-t border-white/[0.05]">
                                <div className="font-display font-black text-xs w-[18px] text-ace-muted">→</div>
                                <div className="flex-1 text-[11px] font-semibold text-ace-muted">
                                    Seu lugar te espera. Bora jogar!
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-[18px] py-4 text-center">
                        <span className="font-display font-black text-[22px] tracking-[6px] text-neon block">
                            {group?.inviteCode || "ACE"}
                        </span>
                        <span className="text-[9px] tracking-[4px] text-ace-muted uppercase mt-[3px] font-display block">
                            entre no grupo usando o código
                        </span>
                    </div>
                </div>

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

                {isGenerating && (
                    <div className="mx-4 mb-3 text-center text-[11px] text-neon font-display font-bold tracking-[2px] uppercase animate-pulse">
                        ⏳ Gerando imagem...
                    </div>
                )}

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
                        <div className="mx-4 mb-2 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl py-2.5 flex items-center justify-center gap-2 font-display font-bold text-[11px] tracking-[1.5px] uppercase text-[#25D366]">
                            ✅ Imagem enviada!
                        </div>
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

            <div className={`fixed left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[400px] bg-neon text-background font-display font-black text-xs tracking-[2.5px] text-center uppercase py-[18px] px-5 z-[1100] transition-[top] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-2xl shadow-[0_8px_32px_rgba(204,255,0,0.3)] ${showToast ? "top-14" : "-top-20"}`}>
                🏆 RESULTADO COMPARTILHÁVEL PRONTO!
            </div>

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
        <Suspense fallback={<div className="h-full flex items-center justify-center text-ace-muted"><div className="w-6 h-6 border-2 border-[#CCFF00]/30 border-t-[#CCFF00] rounded-full animate-spin" /></div>}>
            <ShareContent />
        </Suspense>
    );
}
