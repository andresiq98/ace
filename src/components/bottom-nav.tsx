"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Zap, Play, User } from "lucide-react";

const NAV_ITEMS = [
    { href: "/home", label: "Resenha", icon: Home },
    { href: "/home/ranking", label: "Tabela", icon: Zap },
    { href: "/home/play", label: "Jogar", icon: Play },
    { href: "/home/profile", label: "Perfil", icon: User },
];

export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[1000] px-3.5 pb-6 pointer-events-auto">
            <nav className="bg-ace-surface/96 backdrop-blur-[28px] saturate-[180%] border border-white/[0.06] rounded-[20px] flex overflow-hidden shadow-[0_-4px_40px_rgba(0,0,0,0.5)]">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href === "/home" && pathname === "/home") ||
                        (item.href !== "/home" && pathname?.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className={`flex-1 flex flex-col items-center gap-[3px] py-3.5 px-2 cursor-pointer font-display text-[8px] font-bold tracking-[1.5px] uppercase transition-all duration-250 relative ${isActive ? "text-neon" : "text-ace-muted"
                                }`}
                        >
                            {isActive && (
                                <span className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-neon rounded-b-sm shadow-[0_0_12px_rgba(204,255,0,0.25)]" />
                            )}
                            <Icon
                                className={`w-5 h-5 transition-transform duration-250 ${isActive ? "scale-[1.15]" : ""
                                    }`}
                            />
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
