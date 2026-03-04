// ═══ ACE Firestore Service ═══
// Real data layer replacing mock data — reads/writes to Firestore

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    increment,
    Timestamp,
    onSnapshot,
    type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { User } from "firebase/auth";

// ═══ TYPES ═══

export interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    initials: string;
    gradient: string;
    textColor: string;
    groupIds: string[];
    totalPoints: number;
    totalWins: number;
    totalLosses: number;
    totalGamesPlayed: number;
    createdAt: any;
}

export interface Group {
    id: string;
    name: string;
    inviteCode: string;
    tone: "zoeira" | "misto" | "respeitoso";
    createdBy: string;
    memberIds: string[];
    memberCount: number;
    createdAt: any;
}

export interface MatchRecord {
    id: string;
    groupId: string;
    drillId: string;
    drillTitle: string;
    drillEmoji: string;
    winnerId: string;
    loserId: string;
    winnerName: string;
    loserName: string;
    score: string;
    duration: number;
    mode: "competitive" | "cooperative";
    mvpId?: string;
    pointsAwarded: { userId: string; points: number; breakdown: string[] }[];
    createdAt: any;
}

export interface ScheduledMatch {
    id: string;
    groupId: string;
    challengerId: string;
    challengerName: string;
    rivalId: string;
    rivalName: string;
    date: string; // ISO string or simple YYYY-MM-DDTHH:mm
    location: string;
    status: "pending" | "accepted" | "declined" | "completed";
    createdAt: any;
}

export interface LeaderboardEntry {
    odoc_id: string;
    odoc_userId: string;
    userId: string;
    displayName: string;
    photoURL: string;
    initials: string;
    gradient: string;
    textColor: string;
    points: number;
    wins: number;
    losses: number;
    gamesPlayed: number;
    streak: number;
    badge?: "champion" | "lantern" | "mvp";
}

// ═══ GRADIENT PALETTE ═══
// Auto-assign gradients to new users
const GRADIENT_PALETTE = [
    { gradient: "linear-gradient(135deg, #CCFF00, #A8D400)", textColor: "#000" },
    { gradient: "linear-gradient(135deg, #FFD700, #FF8F00)", textColor: "#000" },
    { gradient: "linear-gradient(135deg, #2979FF, #0D47A1)", textColor: "#fff" },
    { gradient: "linear-gradient(135deg, #FF6E40, #BF360C)", textColor: "#fff" },
    { gradient: "linear-gradient(135deg, #B388FF, #4527A0)", textColor: "#fff" },
    { gradient: "linear-gradient(135deg, #546E7A, #263238)", textColor: "#fff" },
    { gradient: "linear-gradient(135deg, #00E676, #00C853)", textColor: "#000" },
    { gradient: "linear-gradient(135deg, #FF4081, #C51162)", textColor: "#fff" },
    { gradient: "linear-gradient(135deg, #00BCD4, #006064)", textColor: "#fff" },
    { gradient: "linear-gradient(135deg, #FF9100, #E65100)", textColor: "#000" },
];

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (name.substring(0, 2)).toUpperCase();
}

function getGradientForUser(uid: string) {
    // Deterministic gradient based on UID hash
    let hash = 0;
    for (let i = 0; i < uid.length; i++) {
        hash = ((hash << 5) - hash) + uid.charCodeAt(i);
        hash |= 0;
    }
    const index = Math.abs(hash) % GRADIENT_PALETTE.length;
    return GRADIENT_PALETTE[index];
}

// ═══ USER OPERATIONS ═══

/**
 * Get or create a user profile from Firebase Auth user.
 * Called on every login to ensure the profile exists.
 */
export async function ensureUserProfile(authUser: User): Promise<UserProfile> {
    const userRef = doc(db, "users", authUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        // Update display name and photo if changed
        const data = userSnap.data();
        if (
            data.displayName !== authUser.displayName ||
            data.photoURL !== (authUser.photoURL || "")
        ) {
            await updateDoc(userRef, {
                displayName: authUser.displayName || "",
                photoURL: authUser.photoURL || "",
                initials: getInitials(authUser.displayName || ""),
            });
        }
        return { uid: authUser.uid, ...userSnap.data() } as UserProfile;
    }

    // Create new profile
    const colors = getGradientForUser(authUser.uid);
    const newProfile: Omit<UserProfile, "uid"> = {
        displayName: authUser.displayName || "Jogador",
        email: authUser.email || "",
        photoURL: authUser.photoURL || "",
        initials: getInitials(authUser.displayName || "Jogador"),
        gradient: colors.gradient,
        textColor: colors.textColor,
        groupIds: [],
        totalPoints: 0,
        totalWins: 0,
        totalLosses: 0,
        totalGamesPlayed: 0,
        createdAt: serverTimestamp(),
    };

    await setDoc(userRef, newProfile);
    return { uid: authUser.uid, ...newProfile };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return null;
    return { uid, ...userSnap.data() } as UserProfile;
}

export async function getUserProfiles(uids: string[]): Promise<UserProfile[]> {
    if (uids.length === 0) return [];
    const profiles: UserProfile[] = [];
    // Firestore 'in' queries support max 30 items
    const chunks = [];
    for (let i = 0; i < uids.length; i += 30) {
        chunks.push(uids.slice(i, i + 30));
    }
    for (const chunk of chunks) {
        const q = query(collection(db, "users"), where("__name__", "in", chunk));
        const snap = await getDocs(q);
        snap.forEach((d) => {
            profiles.push({ uid: d.id, ...d.data() } as UserProfile);
        });
    }
    return profiles;
}

// ═══ GROUP OPERATIONS ═══

function generateInviteCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

export async function createGroup(
    name: string,
    tone: Group["tone"],
    creatorUid: string
): Promise<Group> {
    const inviteCode = generateInviteCode();

    const groupData = {
        name,
        inviteCode,
        tone,
        createdBy: creatorUid,
        memberIds: [creatorUid],
        memberCount: 1,
        createdAt: serverTimestamp(),
    };

    const groupRef = await addDoc(collection(db, "groups"), groupData);

    // Add group to user's groupIds
    const userRef = doc(db, "users", creatorUid);
    await updateDoc(userRef, {
        groupIds: arrayUnion(groupRef.id),
    });

    // Create initial leaderboard entry for the creator
    const creatorProfile = await getUserProfile(creatorUid);
    if (creatorProfile) {
        await setDoc(doc(db, "groups", groupRef.id, "leaderboard", creatorUid), {
            userId: creatorUid,
            displayName: creatorProfile.displayName,
            photoURL: creatorProfile.photoURL,
            initials: creatorProfile.initials,
            gradient: creatorProfile.gradient,
            textColor: creatorProfile.textColor,
            points: 0,
            wins: 0,
            losses: 0,
            gamesPlayed: 0,
            streak: 0,
        });
    }

    return { id: groupRef.id, ...groupData } as Group;
}

export async function joinGroupByCode(
    inviteCode: string,
    uid: string
): Promise<Group | null> {
    const q = query(
        collection(db, "groups"),
        where("inviteCode", "==", inviteCode.toUpperCase()),
        limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const groupDoc = snap.docs[0];
    const groupData = groupDoc.data() as Omit<Group, "id">;

    // Check if user is already a member
    if (groupData.memberIds.includes(uid)) {
        return { id: groupDoc.id, ...groupData } as Group;
    }

    // Add user to group
    await updateDoc(doc(db, "groups", groupDoc.id), {
        memberIds: arrayUnion(uid),
        memberCount: increment(1),
    });

    // Add group to user's groupIds
    await updateDoc(doc(db, "users", uid), {
        groupIds: arrayUnion(groupDoc.id),
    });

    // Create leaderboard entry
    const profile = await getUserProfile(uid);
    if (profile) {
        await setDoc(doc(db, "groups", groupDoc.id, "leaderboard", uid), {
            userId: uid,
            displayName: profile.displayName,
            photoURL: profile.photoURL,
            initials: profile.initials,
            gradient: profile.gradient,
            textColor: profile.textColor,
            points: 0,
            wins: 0,
            losses: 0,
            gamesPlayed: 0,
            streak: 0,
        });
    }

    return {
        id: groupDoc.id,
        ...groupData,
        memberIds: [...groupData.memberIds, uid],
        memberCount: groupData.memberCount + 1,
    } as Group;
}

export async function getGroup(groupId: string): Promise<Group | null> {
    const groupRef = doc(db, "groups", groupId);
    const groupSnap = await getDoc(groupRef);
    if (!groupSnap.exists()) return null;
    return { id: groupSnap.id, ...groupSnap.data() } as Group;
}

export async function getUserGroups(uid: string): Promise<Group[]> {
    const q = query(
        collection(db, "groups"),
        where("memberIds", "array-contains", uid)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Group);
}

// ═══ MATCH OPERATIONS ═══

export async function recordMatch(
    groupId: string,
    matchData: Omit<MatchRecord, "id" | "createdAt">
): Promise<MatchRecord> {
    const matchRef = await addDoc(
        collection(db, "groups", groupId, "matches"),
        {
            ...matchData,
            createdAt: serverTimestamp(),
        }
    );

    // Update leaderboard for both players
    for (const award of matchData.pointsAwarded) {
        const lbRef = doc(db, "groups", groupId, "leaderboard", award.userId);
        const lbSnap = await getDoc(lbRef);

        const isWinner = award.userId === matchData.winnerId;

        if (lbSnap.exists()) {
            const current = lbSnap.data();
            const currentStreak = current.streak || 0;
            const newStreak = isWinner
                ? (currentStreak >= 0 ? currentStreak + 1 : 1)
                : (currentStreak <= 0 ? currentStreak - 1 : -1);

            await updateDoc(lbRef, {
                points: increment(award.points),
                wins: increment(isWinner ? 1 : 0),
                losses: increment(isWinner ? 0 : 1),
                gamesPlayed: increment(1),
                streak: newStreak,
            });
        }

        // Also update user's global stats
        const userRef = doc(db, "users", award.userId);
        await updateDoc(userRef, {
            totalPoints: increment(award.points),
            totalWins: increment(isWinner ? 1 : 0),
            totalLosses: increment(isWinner ? 0 : 1),
            totalGamesPlayed: increment(1),
        });
    }

    return { id: matchRef.id, ...matchData, createdAt: Timestamp.now() } as MatchRecord;
}

export async function getGroupMatches(
    groupId: string,
    maxResults: number = 20
): Promise<MatchRecord[]> {
    const q = query(
        collection(db, "groups", groupId, "matches"),
        orderBy("createdAt", "desc"),
        limit(maxResults)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as MatchRecord);
}

// ═══ LEADERBOARD OPERATIONS ═══

export async function getGroupLeaderboard(
    groupId: string
): Promise<LeaderboardEntry[]> {
    const q = query(
        collection(db, "groups", groupId, "leaderboard"),
        orderBy("points", "desc")
    );
    const snap = await getDocs(q);
    const entries = snap.docs.map((d, index) => {
        const data = d.data();
        return {
            odoc_id: d.id,
            odoc_userId: d.id,
            userId: d.id,
            displayName: data.displayName,
            photoURL: data.photoURL,
            initials: data.initials,
            gradient: data.gradient,
            textColor: data.textColor,
            points: data.points || 0,
            wins: data.wins || 0,
            losses: data.losses || 0,
            gamesPlayed: data.gamesPlayed || 0,
            streak: data.streak || 0,
        } as LeaderboardEntry;
    });

    // Assign badges
    if (entries.length > 0) {
        entries[0].badge = "champion";
        const last = entries[entries.length - 1];
        if (entries.length > 1 && last.gamesPlayed > 0) {
            last.badge = "lantern";
        }
    }

    return entries;
}

// ═══ FEED (DERIVED FROM MATCHES) ═══

export interface FeedItem {
    id: string;
    type: "match";
    playerName: string;
    playerInitials: string;
    playerGradient: string;
    playerTextColor: string;
    playerPhotoURL: string;
    content: string;
    score: string;
    timestamp: string;
    drillEmoji: string;
}

export async function getGroupFeed(
    groupId: string,
    maxResults: number = 10
): Promise<FeedItem[]> {
    const matches = await getGroupMatches(groupId, maxResults);

    return matches.map((m) => {
        const timeAgo = getTimeAgo(m.createdAt);
        return {
            id: m.id,
            type: "match" as const,
            playerName: m.winnerName,
            playerInitials: "",
            playerGradient: "",
            playerTextColor: "",
            playerPhotoURL: "",
            content: `<strong>${m.winnerName}</strong> venceu <strong>${m.loserName}</strong> no ${m.drillEmoji} ${m.drillTitle}!`,
            score: m.score,
            timestamp: timeAgo,
            drillEmoji: m.drillEmoji,
        };
    });
}

function getTimeAgo(timestamp: any): string {
    if (!timestamp) return "Agora";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return "Agora";
    if (diffMin < 60) return `Há ${diffMin} min`;
    if (diffHours < 24) return `Há ${diffHours}h`;
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `Há ${diffDays} dias`;
    return date.toLocaleDateString("pt-BR");
}

// ═══ REAL-TIME SUBSCRIPTIONS ═══

export function subscribeToLeaderboard(
    groupId: string,
    callback: (entries: LeaderboardEntry[]) => void
): Unsubscribe {
    const q = query(
        collection(db, "groups", groupId, "leaderboard"),
        orderBy("points", "desc")
    );

    return onSnapshot(q, (snap) => {
        const entries = snap.docs.map((d) => {
            const data = d.data();
            return {
                odoc_id: d.id,
                odoc_userId: d.id,
                userId: d.id,
                displayName: data.displayName,
                photoURL: data.photoURL,
                initials: data.initials,
                gradient: data.gradient,
                textColor: data.textColor,
                points: data.points || 0,
                wins: data.wins || 0,
                losses: data.losses || 0,
                gamesPlayed: data.gamesPlayed || 0,
                streak: data.streak || 0,
            } as LeaderboardEntry;
        });

        if (entries.length > 0) {
            entries[0].badge = "champion";
            const last = entries[entries.length - 1];
            if (entries.length > 1 && last.gamesPlayed > 0) {
                last.badge = "lantern";
            }
        }

        callback(entries);
    });
}

// ═══ SCHEDULED MATCHES ═══

export async function createScheduledMatch(
    groupId: string,
    matchData: Omit<ScheduledMatch, "id" | "createdAt" | "status">
): Promise<ScheduledMatch> {
    const data = {
        ...matchData,
        groupId,
        status: "pending",
        createdAt: serverTimestamp(),
    };

    const matchRef = await addDoc(collection(db, "groups", groupId, "scheduledMatches"), data);

    return { id: matchRef.id, ...data, createdAt: Timestamp.now() } as ScheduledMatch;
}

export async function getScheduledMatch(
    groupId: string,
    matchId: string
): Promise<ScheduledMatch | null> {
    const matchRef = doc(db, "groups", groupId, "scheduledMatches", matchId);
    const snap = await getDoc(matchRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as ScheduledMatch;
}

export async function updateScheduledMatchStatus(
    groupId: string,
    matchId: string,
    status: ScheduledMatch["status"]
): Promise<void> {
    const matchRef = doc(db, "groups", groupId, "scheduledMatches", matchId);
    await updateDoc(matchRef, { status });
}

