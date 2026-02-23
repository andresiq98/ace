// ═══ ACE Mock Data ═══
// Mock data for MVP — will be replaced with Firestore in production

export interface Player {
    id: string;
    displayName: string;
    initials: string;
    photoURL?: string;
    gradient: string;
    textColor: string;
}

export interface GroupData {
    id: string;
    name: string;
    inviteCode: string;
    tone: "zoeira" | "misto" | "respeitoso";
    createdBy: string;
    playerCount: number;
}

export interface MatchResult {
    id: string;
    drillId: string;
    drillTitle: string;
    drillEmoji: string;
    winnerId: string;
    loserId: string;
    score: string;
    mvpId?: string;
    timestamp: Date;
    pointsAwarded: { userId: string; points: number; breakdown: string[] }[];
}

export interface LeaderboardEntry {
    userId: string;
    player: Player;
    points: number;
    wins: number;
    losses: number;
    gamesPlayed: number;
    streak: number;
    badge?: "champion" | "lantern" | "mvp";
}

// ═══ MOCK PLAYERS ═══
export const MOCK_PLAYERS: Player[] = [
    {
        id: "user-carlos",
        displayName: "Carlos Augusto",
        initials: "CA",
        gradient: "linear-gradient(135deg, #CCFF00, #A8D400)",
        textColor: "#000",
    },
    {
        id: "user-rafael",
        displayName: "Rafael Moura",
        initials: "RM",
        gradient: "linear-gradient(135deg, #FFD700, #FF8F00)",
        textColor: "#000",
    },
    {
        id: "user-lucas",
        displayName: "Lucas Pinheiro",
        initials: "LP",
        gradient: "linear-gradient(135deg, #2979FF, #0D47A1)",
        textColor: "#fff",
    },
    {
        id: "user-marcos",
        displayName: "Marcos Figueiredo",
        initials: "MF",
        gradient: "linear-gradient(135deg, #FF6E40, #BF360C)",
        textColor: "#fff",
    },
    {
        id: "user-gabriel",
        displayName: "Gabriel Silva",
        initials: "GS",
        gradient: "linear-gradient(135deg, #B388FF, #4527A0)",
        textColor: "#fff",
    },
    {
        id: "user-joao",
        displayName: "João Pedro",
        initials: "JP",
        gradient: "linear-gradient(135deg, #546E7A, #263238)",
        textColor: "#fff",
    },
];

export const CURRENT_USER = MOCK_PLAYERS[0]; // Carlos Augusto

export const MOCK_GROUP: GroupData = {
    id: "group-coxos",
    name: "Clube dos Coxos",
    inviteCode: "ACE24",
    tone: "zoeira",
    createdBy: "user-carlos",
    playerCount: 6,
};

// ═══ MOCK LEADERBOARD ═══
export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    {
        userId: "user-rafael",
        player: MOCK_PLAYERS[1],
        points: 58,
        wins: 5,
        losses: 1,
        gamesPlayed: 6,
        streak: 3,
        badge: "champion",
    },
    {
        userId: "user-carlos",
        player: MOCK_PLAYERS[0],
        points: 47,
        wins: 3,
        losses: 2,
        gamesPlayed: 5,
        streak: 1,
        badge: "mvp",
    },
    {
        userId: "user-lucas",
        player: MOCK_PLAYERS[2],
        points: 41,
        wins: 3,
        losses: 1,
        gamesPlayed: 4,
        streak: 2,
    },
    {
        userId: "user-marcos",
        player: MOCK_PLAYERS[3],
        points: 35,
        wins: 2,
        losses: 2,
        gamesPlayed: 4,
        streak: 0,
    },
    {
        userId: "user-gabriel",
        player: MOCK_PLAYERS[4],
        points: 22,
        wins: 1,
        losses: 2,
        gamesPlayed: 3,
        streak: 0,
    },
    {
        userId: "user-joao",
        player: MOCK_PLAYERS[5],
        points: 8,
        wins: 0,
        losses: 4,
        gamesPlayed: 4,
        streak: -4,
        badge: "lantern",
    },
];

// ═══ MOCK FEED ═══
export interface FeedItem {
    id: string;
    type: "match" | "schedule" | "achievement";
    player: Player;
    content: string;
    score?: string;
    timestamp: string;
    reactions?: { emoji: string; label: string }[];
}

export const MOCK_FEED: FeedItem[] = [
    {
        id: "feed-1",
        type: "match",
        player: MOCK_PLAYERS[1],
        content: '<strong>@Guga</strong> levou um pneu hoje! 🥐 Nem viu a cor da bola no primeiro set. Tmj! 😆',
        score: "6·0 · 6·1",
        timestamp: "Há 20 min · Quadra 3",
        reactions: [
            { emoji: "👍", label: "BOA!" },
            { emoji: "😤", label: "FALTOU RAÇA" },
        ],
    },
    {
        id: "feed-2",
        type: "match",
        player: MOCK_PLAYERS[0],
        content: 'Missão <strong>"Dominador do Cruzado"</strong> concluída. A paciência venceu! 💪',
        score: "7·5",
        timestamp: "Ontem · Quadra 1",
        reactions: [
            { emoji: "🔥", label: "DEMOROU!" },
            { emoji: "🫡", label: "RESPEITA" },
        ],
    },
];

// ═══ SCORING ENGINE ═══
export const POINTS = {
    PARTICIPATION: 3,
    WIN: 5,
    COOP_SUCCESS: 4,
    STREAK_BONUS: 3,
    MVP: 2,
} as const;

// ═══ DURATION-BASED SCORE OPTIONS ═══
export const SCORE_OPTIONS_BY_DURATION: Record<number, string[]> = {
    // 30 min — Jogo Rápido: pontos corridos, tie-break, sets curtos
    30: ["11×0", "11×3", "11×5", "11×7", "11×9", "7×5", "7×3", "7×1", "4×0", "4×1", "4×2", "4×3"],
    // 60 min — Set Completo: 1 set padrão com possível tie-break
    60: ["6×0", "6×1", "6×2", "6×3", "6×4", "7×5", "7×6"],
    // 90 min — Melhor de 3: scores de match completo
    90: ["2×0", "2×1", "6×0 6×0", "6×0 6×1", "6×1 6×2", "6×2 6×3", "6×4 7×5", "7×5 7×6", "6×1 4×6 6×3", "7×5 3×6 6×4"],
};

export const getScoreOptions = (duration: number): string[] => {
    return SCORE_OPTIONS_BY_DURATION[duration] || SCORE_OPTIONS_BY_DURATION[60];
};

// Legacy compat
export const SCORE_OPTIONS = SCORE_OPTIONS_BY_DURATION[60];

export type ScoreOption = string;

// Duration format labels
export const DURATION_FORMAT: Record<number, { label: string; setsLabel: string }> = {
    30: { label: "Jogo Rápido", setsLabel: "PONTOS CORRIDOS" },
    60: { label: "Set Completo", setsLabel: "1 SET" },
    90: { label: "Melhor de 3", setsLabel: "MATCH" },
};

// Duration bonus multiplier — longer sessions = more points
export const getDurationMultiplier = (duration: number): number => {
    switch (duration) {
        case 30: return 1.0;
        case 60: return 1.25;
        case 90: return 1.5;
        default: return 1.0;
    }
};

// Calculate points for a match result
export function calculatePoints(
    won: boolean,
    isMvp: boolean,
    streakCount: number,
    isCoop: boolean,
    coopSuccess: boolean,
    duration: number = 60
): { total: number; breakdown: string[] } {
    const breakdown: string[] = [];
    let total = 0;
    const multiplier = getDurationMultiplier(duration);

    // Participation
    const partPts = Math.round(POINTS.PARTICIPATION * multiplier);
    total += partPts;
    breakdown.push(`✓ Participação +${partPts}`);

    if (isCoop) {
        if (coopSuccess) {
            const coopPts = Math.round(POINTS.COOP_SUCCESS * multiplier);
            total += coopPts;
            breakdown.push(`🤝 Coop sucesso +${coopPts}`);
        }
    } else {
        if (won) {
            const winPts = Math.round(POINTS.WIN * multiplier);
            total += winPts;
            breakdown.push(`🏆 Vitória +${winPts}`);
        }
    }

    if (streakCount >= 3) {
        total += POINTS.STREAK_BONUS;
        breakdown.push(`🔥 Streak bonus +${POINTS.STREAK_BONUS}`);
    }

    if (isMvp) {
        total += POINTS.MVP;
        breakdown.push(`⭐ MVP +${POINTS.MVP}`);
    }

    if (multiplier > 1.0) {
        breakdown.push(`⏱ Bônus ${duration}min (×${multiplier})`);
    }

    return { total, breakdown };
}


