const SAVE_KEY = "cobrapromax.save.v1";
const USER_ID_KEY = "cobrapromax.userId";

export type LocalSave = {
  userId: string;
  user: Record<string, unknown>;
  powerupCounts?: Record<string, number>;
  unlockedBackgrounds?: string[];
  unlockedFoodPacks?: string[];
  unlockedEmojis?: string[];
  muted?: boolean;
  savedAt: number;
};

export function rememberUserId(userId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_ID_KEY, userId);
}

export function rememberedUserId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_KEY);
}

export function writeLocalSave(save: LocalSave) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    rememberUserId(save.userId);
  } catch {
    // storage full or private mode
  }
}

export function readLocalSave(): LocalSave | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LocalSave;
  } catch {
    return null;
  }
}
