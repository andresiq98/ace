"use client";

import { BottomNav } from "@/components/bottom-nav";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full flex flex-col relative">
            {/* Top Bar */}
            <header className="flex items-center justify-between px-5 pt-14 pb-3.5 sticky top-0 bg-background/92 backdrop-blur-[24px] saturate-[180%] z-50 border-b border-white/[0.04]">
                <div className="font-display font-black text-[22px] tracking-[-1.5px] uppercase flex items-center gap-2.5">
                    <div className="w-[22px] h-[22px] bg-neon rounded-full relative shadow-[0_0_16px_rgba(204,255,0,0.25)]">
                        <div className="absolute inset-[3px] rounded-full border-[1.5px] border-black/20" />
                    </div>
                    <span className="text-neon neon-text-glow">ACE</span>
                </div>
                <div className="flex gap-2">
                    <button className="w-[38px] h-[38px] bg-ace-surface2 border border-ace-border rounded-[10px] flex items-center justify-center text-[15px] transition-all duration-200 active:scale-90 active:border-neon">
                        🔔
                    </button>
                    <button className="w-[38px] h-[38px] bg-ace-surface2 border border-ace-border rounded-[10px] flex items-center justify-center text-[15px] transition-all duration-200 active:scale-90 active:border-neon">
                        👤
                    </button>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-[100px]">
                {children}
            </main>

            <BottomNav />
        </div>
    );
}
