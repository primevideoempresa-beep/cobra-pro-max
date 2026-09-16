export const LANGUAGES = [
  { id: "en", label: "English" },
  { id: "de", label: "Deutsch" },
  { id: "es", label: "Español" },
  { id: "fi", label: "Suomi" },
  { id: "fr", label: "Français" },
  { id: "id", label: "Indonesia" },
  { id: "it", label: "Italiano" },
  { id: "ja", label: "日本語" },
  { id: "ko", label: "한국어" },
  { id: "pl", label: "Polski" },
  { id: "pt", label: "Português" },
  { id: "ru", label: "Русский" },
  { id: "th", label: "ภาษาไทย" },
  { id: "tr", label: "Türkçe" },
  { id: "uk", label: "Українська" },
  { id: "vi", label: "Tiếng Việt" },
  { id: "zh-Hans", label: "简体中文" },
  { id: "zh-Hant", label: "繁體中文" },
  { id: "hi", label: "हिन्दी" },
  { id: "bn", label: "বাংলা" },
] as const;

export type LocaleId = (typeof LANGUAGES)[number]["id"];

const pt = {
  settings: "Configurações",
  options: "Opções",
  arena: "Arena",
  controls: "Controles",
  background: "Tela de fundo",
  food: "Alimento",
  emoji: "Emoji",
  language: "Idioma",
  music: "Música",
  sounds: "Sons",
  battle: "Vamos à batalha!",
  wardrobe: "Guarda-roupa de minhocas",
  paused: "Jogo Pausado",
  continue: "Continuar Batalha",
  mute: "Silenciar Som",
  unmute: "Ativar Som",
  menu: "Voltar ao Menu",
  selected: "Selecionado",
  buy: "Comprar",
  bestPlayers: "Melhores jogadores",
  playAgain: "Jogar Novamente",
  gameOver: "Fim de Jogo!",
};

type Dict = typeof pt;
const en: Dict = { settings: "Settings", options: "Options", arena: "Arena", controls: "Controls", background: "Background", food: "Food", emoji: "Emoji", language: "Language", music: "Music", sounds: "Sounds", battle: "Let's battle!", wardrobe: "Worm wardrobe", paused: "Game Paused", continue: "Resume Battle", mute: "Mute Sound", unmute: "Unmute Sound", menu: "Back to Menu", selected: "Selected", buy: "Buy", bestPlayers: "Top players", playAgain: "Play Again", gameOver: "Game Over!" };
const es: Dict = { ...en, settings: "Ajustes", language: "Idioma", music: "Música", sounds: "Sonidos", battle: "¡A la batalla!", paused: "Juego en pausa", continue: "Continuar", mute: "Silenciar", unmute: "Activar sonido", menu: "Volver al menú" };
const de: Dict = { ...en, settings: "Einstellungen", language: "Sprache", music: "Musik", sounds: "Töne", battle: "Auf in die Schlacht!", paused: "Pausiert", continue: "Weiter", mute: "Stumm", unmute: "Ton an", menu: "Zum Menü" };
const fr: Dict = { ...en, settings: "Paramètres", language: "Langue", music: "Musique", sounds: "Sons", battle: "Au combat !", paused: "Pause", continue: "Reprendre", mute: "Couper le son", unmute: "Activer le son", menu: "Menu" };
const it: Dict = { ...en, settings: "Impostazioni", language: "Lingua", music: "Musica", sounds: "Suoni", battle: "In battaglia!", paused: "In pausa", continue: "Continua", mute: "Silenzia", unmute: "Attiva audio", menu: "Menu" };
const ru: Dict = { ...en, settings: "Настройки", language: "Язык", music: "Музыка", sounds: "Звуки", battle: "В бой!", paused: "Пауза", continue: "Продолжить", mute: "Без звука", unmute: "Включить звук", menu: "Меню" };
const ja: Dict = { ...en, settings: "設定", language: "言語", music: "音楽", sounds: "効果音", battle: "バトルへ！", paused: "一時停止", continue: "再開", mute: "消音", unmute: "音を出す", menu: "メニュー" };
const ko: Dict = { ...en, settings: "설정", language: "언어", music: "음악", sounds: "효과음", battle: "전투 시작!", paused: "일시정지", continue: "계속", mute: "음소거", unmute: "소리 켜기", menu: "메뉴" };
const zhHans: Dict = { ...en, settings: "设置", language: "语言", music: "音乐", sounds: "音效", battle: "开始战斗！", paused: "已暂停", continue: "继续", mute: "静音", unmute: "打开声音", menu: "菜单" };
const zhHant: Dict = { ...en, settings: "設定", language: "語言", music: "音樂", sounds: "音效", battle: "開始戰鬥！", paused: "已暫停", continue: "繼續", mute: "靜音", unmute: "開啟聲音", menu: "選單" };
const tr: Dict = { ...en, settings: "Ayarlar", language: "Dil", music: "Müzik", sounds: "Sesler", battle: "Savaşa!", paused: "Duraklatıldı", continue: "Devam", mute: "Sesi kapat", unmute: "Sesi aç", menu: "Menü" };
const vi: Dict = { ...en, settings: "Cài đặt", language: "Ngôn ngữ", music: "Nhạc", sounds: "Âm thanh", battle: "Vào trận!", paused: "Tạm dừng", continue: "Tiếp tục", mute: "Tắt tiếng", unmute: "Bật tiếng", menu: "Menu" };
const pl: Dict = { ...en, settings: "Ustawienia", language: "Język", music: "Muzyka", sounds: "Dźwięki", battle: "Do boju!", paused: "Pauza", continue: "Wznów", mute: "Wycisz", unmute: "Włącz dźwięk", menu: "Menu" };
const id: Dict = { ...en, settings: "Pengaturan", language: "Bahasa", music: "Musik", sounds: "Suara", battle: "Bertempur!", paused: "Jeda", continue: "Lanjut", mute: "Bisukan", unmute: "Nyalakan suara", menu: "Menu" };
const fi: Dict = { ...en, settings: "Asetukset", language: "Kieli", music: "Musiikki", sounds: "Äänet", battle: "Taisteluun!", paused: "Tauko", continue: "Jatka", mute: "Mykistä", unmute: "Äänet päälle", menu: "Valikko" };
const th: Dict = { ...en, settings: "ตั้งค่า", language: "ภาษา", music: "เพลง", sounds: "เสียง", battle: "เข้าสู่การต่อสู้!", paused: "หยุดชั่วคราว", continue: "เล่นต่อ", mute: "ปิดเสียง", unmute: "เปิดเสียง", menu: "เมนู" };
const uk: Dict = { ...en, settings: "Налаштування", language: "Мова", music: "Музика", sounds: "Звуки", battle: "До бою!", paused: "Пауза", continue: "Продовжити", mute: "Вимкнути звук", unmute: "Увімкнути звук", menu: "Меню" };
const hi: Dict = { ...en, settings: "सेटिंग्स", language: "भाषा", music: "संगीत", sounds: "आवाज़", battle: "युद्ध पर चलें!", paused: "रुका हुआ", continue: "जारी रखें", mute: "म्यूट", unmute: "आवाज़ चालू", menu: "मेनू" };
const bn: Dict = { ...en, settings: "সেটিংস", language: "ভাষা", music: "সঙ্গীত", sounds: "শব্দ", battle: "যুদ্ধে যাও!", paused: "বিরতি", continue: "চালিয়ে যাও", mute: "মিউট", unmute: "শব্দ চালু", menu: "মেনু" };

const DICTS: Record<string, Dict> = { pt, en, es, de, fr, it, ru, ja, ko, tr, vi, pl, id, fi, th, uk, hi, bn, "zh-Hans": zhHans, "zh-Hant": zhHant };

export function t(locale: string | undefined, key: keyof Dict) {
  const d = DICTS[locale || "pt"] || pt;
  return d[key] || pt[key];
}
