import { pgTable, serial, text, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  avatar: text("avatar").default("/images/worm-mascot.png").notNull(),
  level: integer("level").default(1).notNull(),
  xp: integer("xp").default(0).notNull(),
  coins: integer("coins").default(250).notNull(),
  apples: integer("apples").default(20).notNull(),
  selectedSkinId: text("selected_skin_id").default("classic_white").notNull(),
  packageName: text("package_name").default("com.cobrapromax.game").notNull(),
  role: text("role").default("player").notNull(),
  soundEnabled: boolean("sound_enabled").default(true).notNull(),
  musicEnabled: boolean("music_enabled").default(true).notNull(),
  musicVolume: integer("music_volume").default(6).notNull(),
  sfxVolume: integer("sfx_volume").default(5).notNull(),
  minimapPosition: text("minimap_position").default("right").notNull(),
  minimapScale: text("minimap_scale").default("1").notNull(),
  showInterface: boolean("show_interface").default(true).notNull(),
  showOverlay: boolean("show_overlay").default(true).notNull(),
  handedness: text("handedness").default("right").notNull(),
  controlScheme: text("control_scheme").default("pointer").notNull(),
  arenaBackground: text("arena_background").default("ocean").notNull(),
  foodPack: text("food_pack").default("apple").notNull(),
  wormEmoji: text("worm_emoji").default("wink").notNull(),
  soundMuted: boolean("sound_muted").default(false).notNull(),
  locale: text("locale").default("pt").notNull(),
  youtubeRewardClaimed: boolean("youtube_reward_claimed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const skins = pgTable("skins", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").default("standard").notNull(),
  priceCoins: integer("price_coins").default(0).notNull(),
  headColor: text("head_color").notNull(),
  bodyColor: text("body_color").notNull(),
  secondaryColor: text("secondary_color").notNull(),
  bodyPattern: text("body_pattern").default("striped").notNull(),
  eyeType: text("eye_type").default("cartoon_googly").notNull(),
  hatType: text("hat_type").default("cap_red").notNull(),
  speedBonus: real("speed_bonus").default(1.0).notNull(),
  isUnlockedByDefault: boolean("is_unlocked_by_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSkins = pgTable("user_skins", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  skinId: text("skin_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export const userWormSkins = pgTable("user_worm_skins", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  skinId: text("skin_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export const quests = pgTable("quests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetType: text("target_type").notNull(),
  targetValue: integer("target_value").notNull(),
  rewardCoins: integer("reward_coins").default(100).notNull(),
  rewardXp: integer("reward_xp").default(50).notNull(),
  rewardApples: integer("reward_apples").default(5).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const userQuests = pgTable("user_quests", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  questId: integer("quest_id").notNull(),
  currentProgress: integer("current_progress").default(0).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  isClaimed: boolean("is_claimed").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  playerName: text("player_name").notNull(),
  score: integer("score").default(0).notNull(),
  coinsEarned: integer("coins_earned").default(0).notNull(),
  foodEaten: integer("food_eaten").default(0).notNull(),
  wormsDefeated: integer("worms_defeated").default(0).notNull(),
  survivalSeconds: integer("survival_seconds").default(0).notNull(),
  maxLength: integer("max_length").default(10).notNull(),
  rankAchieved: integer("rank_achieved").default(100).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userPowerups = pgTable("user_powerups", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  magnetCount: integer("magnet_count").default(3).notNull(),
  boostCount: integer("boost_count").default(3).notNull(),
  zoomCount: integer("zoom_count").default(3).notNull(),
  multiplierCount: integer("multiplier_count").default(2).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  userName: text("user_name").notNull(),
  userAvatar: text("user_avatar").default("/images/worm-mascot.png").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shares = pgTable("shares", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  userName: text("user_name").notNull(),
  channel: text("channel").notNull(),
  inviteCode: text("invite_code").notNull(),
  shareUrl: text("share_url").notNull(),
  coinsAwarded: integer("coins_awarded").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userBackgrounds = pgTable("user_backgrounds", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  backgroundId: text("background_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export const userFoodPacks = pgTable("user_food_packs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  packId: text("pack_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export const userEmojis = pgTable("user_emojis", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  emojiId: text("emoji_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});
