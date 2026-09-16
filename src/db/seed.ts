import { db } from "./index";
import {
  users,
  skins,
  userSkins,
  quests,
  userQuests,
  matches,
  userPowerups,
  chatMessages,
} from "./schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  try {
    const defaultSkins = [
      {
        id: "classic_white",
        name: "Minhoca Clássica",
        category: "standard",
        priceCoins: 0,
        headColor: "#ffffff",
        bodyColor: "#f3f4f6",
        secondaryColor: "#e5e7eb",
        bodyPattern: "solid",
        eyeType: "cartoon_googly",
        hatType: "cap_red",
        speedBonus: 1.0,
        isUnlockedByDefault: true,
      },
      {
        id: "cyber_neon",
        name: "Cobra Cyber Neon",
        category: "epic",
        priceCoins: 250,
        headColor: "#06b6d4",
        bodyColor: "#0891b2",
        secondaryColor: "#ec4899",
        bodyPattern: "neon",
        eyeType: "cool_shades",
        hatType: "halo",
        speedBonus: 1.05,
        isUnlockedByDefault: false,
      },
      {
        id: "fire_dragon",
        name: "Dragão Escarlate",
        category: "legendary",
        priceCoins: 500,
        headColor: "#ef4444",
        bodyColor: "#ea580c",
        secondaryColor: "#facc15",
        bodyPattern: "striped",
        eyeType: "angry",
        hatType: "crown",
        speedBonus: 1.08,
        isUnlockedByDefault: false,
      },
      {
        id: "golden_emperor",
        name: "Imperador Dourado",
        category: "legendary",
        priceCoins: 1000,
        headColor: "#f59e0b",
        bodyColor: "#fbbf24",
        secondaryColor: "#fef08a",
        bodyPattern: "gradient",
        eyeType: "cartoon_googly",
        hatType: "crown",
        speedBonus: 1.1,
        isUnlockedByDefault: false,
      },
      {
        id: "toxic_viper",
        name: "Víbora Tóxica",
        category: "epic",
        priceCoins: 350,
        headColor: "#22c55e",
        bodyColor: "#15803d",
        secondaryColor: "#a855f7",
        bodyPattern: "spotted",
        eyeType: "angry",
        hatType: "cowboy",
        speedBonus: 1.04,
        isUnlockedByDefault: false,
      },
      {
        id: "candy_swirl",
        name: "Doce Turbilhão",
        category: "standard",
        priceCoins: 150,
        headColor: "#f472b6",
        bodyColor: "#fb7185",
        secondaryColor: "#38bdf8",
        bodyPattern: "striped",
        eyeType: "cartoon_googly",
        hatType: "party",
        speedBonus: 1.02,
        isUnlockedByDefault: false,
      },
    ];

    for (const skin of defaultSkins) {
      const existing = await db.select().from(skins).where(eq(skins.id, skin.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(skins).values(skin);
      }
    }

    const demoUserId = "demo-user-1";
    const existingUser = await db.select().from(users).where(eq(users.id, demoUserId)).limit(1);
    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: demoUserId,
        username: "CobraMestre",
        email: "player@cobrapromax.game",
        passwordHash: "demo123",
        avatar: "/images/worm-mascot.png",
        level: 2,
        xp: 340,
        coins: 480,
        apples: 20,
        selectedSkinId: "classic_white",
        packageName: "com.cobrapromax.game",
        role: "admin",
      });

      await db.insert(userSkins).values([
        { userId: demoUserId, skinId: "classic_white" },
        { userId: demoUserId, skinId: "candy_swirl" },
      ]);

      await db.insert(userPowerups).values({
        userId: demoUserId,
        magnetCount: 4,
        boostCount: 5,
        zoomCount: 3,
        multiplierCount: 2,
      });
    }

    const defaultQuests = [
      {
        id: 1,
        title: "Sobreviva 240 segundos",
        description: "Permaneça vivo na arena de batalha por 4 minutos sem colidir.",
        targetType: "survive_time",
        targetValue: 240,
        rewardCoins: 150,
        rewardXp: 100,
        rewardApples: 5,
      },
      {
        id: 2,
        title: "Banquete Guloso",
        description: "Devore 60 itens de comida espalhados pela arena.",
        targetType: "eat_food",
        targetValue: 60,
        rewardCoins: 80,
        rewardXp: 60,
        rewardApples: 2,
      },
      {
        id: 3,
        title: "Caçador de Cobras",
        description: "Derrote 3 minhocas rivais fazendo-as colidir em seu corpo.",
        targetType: "defeat_worms",
        targetValue: 3,
        rewardCoins: 200,
        rewardXp: 150,
        rewardApples: 5,
      },
      {
        id: 4,
        title: "Grande Campeão",
        description: "Atinja 50.000 pontos em uma única partida.",
        targetType: "score",
        targetValue: 50000,
        rewardCoins: 300,
        rewardXp: 250,
        rewardApples: 10,
      },
    ];

    for (const q of defaultQuests) {
      const existingQ = await db.select().from(quests).where(eq(quests.id, q.id)).limit(1);
      if (existingQ.length === 0) {
        await db.insert(quests).values(q);
      }
    }

    for (const q of defaultQuests) {
      const existingUserQ = await db.select().from(userQuests).where(eq(userQuests.questId, q.id)).limit(1);
      if (existingUserQ.length === 0) {
        await db.insert(userQuests).values({
          userId: demoUserId,
          questId: q.id,
          currentProgress: q.id === 1 ? 4 : q.id === 2 ? 28 : 0,
          isCompleted: false,
          isClaimed: false,
        });
      }
    }

    const existingMatches = await db.select().from(matches).limit(5);
    if (existingMatches.length === 0) {
      await db.insert(matches).values([
        {
          userId: "bot-1",
          playerName: "Người chơi_95098672",
          score: 1115757,
          coinsEarned: 120,
          foodEaten: 940,
          wormsDefeated: 28,
          survivalSeconds: 840,
          maxLength: 850,
          rankAchieved: 1,
        },
        {
          userId: "bot-2",
          playerName: "ViperKing_BR",
          score: 1054086,
          coinsEarned: 110,
          foodEaten: 880,
          wormsDefeated: 24,
          survivalSeconds: 790,
          maxLength: 810,
          rankAchieved: 2,
        },
        {
          userId: "bot-3",
          playerName: "Player_1569632917",
          score: 1037146,
          coinsEarned: 105,
          foodEaten: 820,
          wormsDefeated: 19,
          survivalSeconds: 750,
          maxLength: 780,
          rankAchieved: 3,
        },
        {
          userId: "bot-4",
          playerName: "Jacob Anderson",
          score: 972104,
          coinsEarned: 95,
          foodEaten: 760,
          wormsDefeated: 18,
          survivalSeconds: 690,
          maxLength: 720,
          rankAchieved: 4,
        },
        {
          userId: "bot-5",
          playerName: "Oliver Davies",
          score: 765993,
          coinsEarned: 80,
          foodEaten: 650,
          wormsDefeated: 15,
          survivalSeconds: 580,
          maxLength: 640,
          rankAchieved: 5,
        },
        {
          userId: demoUserId,
          playerName: "CobraMestre",
          score: 12450,
          coinsEarned: 35,
          foodEaten: 98,
          wormsDefeated: 2,
          survivalSeconds: 135,
          maxLength: 140,
          rankAchieved: 10,
        },
      ]);
    }

    const existingChat = await db.select().from(chatMessages).limit(1);
    if (existingChat.length === 0) {
      await db.insert(chatMessages).values([
        {
          userId: "user_pro",
          userName: "SnakeMaster_99",
          message: "Atenção galera, peguem o ímã quando uma cobra grande morrer!",
        },
        {
          userId: "user_lucas",
          userName: "Lucas_GamerBR",
          message: "O jogo Cobra Pro Max ficou muito liso! A rotação tá perfeita 🚀",
        },
      ]);
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
