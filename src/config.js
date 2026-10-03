// ─────────────────────────────────────────────────────────────
//  Barcha to'y ma'lumotlari shu yerda. Faqat shu faylni tahrirlang.
// ─────────────────────────────────────────────────────────────

export const wedding = {
  bride: { uz: 'Jasmina', ru: 'Жасмина', surname: { uz: 'Choriyeva', ru: 'Чориева' } },
  groom: { uz: 'Mirjaxon', ru: 'Миржахон', surname: { uz: "Mo'minov", ru: 'Муминов' } },

  // Sana (YYYY-MM-DD), vaqt (HH:MM) va vaqt zonasi (Toshkent = +05:00)
  date: '2026-10-27',
  time: '18:00', // TODO: aniq vaqtni kiriting
  tz: '+05:00',

  // Lady Gaga & Bruno Mars — «Die With A Smile».
  // Faylni public/music.mp3 nomi bilan qo'ying. Fayl bo'lmasa, tugma o'zi yashirinadi.
  music: '/music.mp3',
  // Qo'shiqni shu soniyadan boshlash (masalan, eng chiroyli joyidan: 0 yoki 60)
  musicStart: 0,

  venue: {
    name: { uz: "«Mo'jiza» to'yxonasi", ru: "Тойхона «Mo'jiza»" },
    address: {
      uz: "Qashqadaryo viloyati, Qarshi sh., Jayxun ko'chasi, 7/56",
      ru: 'Кашкадарьинская область, г. Карши, улица Джайхун, 7/56',
    },
    // Yandex Maps: yandex.uz/maps/org/mo_jiza/58469686794
    lat: 38.878197,
    lng: 65.814617,
    yandexUrl: 'https://yandex.uz/maps/-/CXa8FCzl',
  },

  timeline: [
    { time: '18:00', title: { uz: 'Mehmonlarni kutib olish', ru: 'Сбор гостей' } },
    { time: '18:30', title: { uz: 'Kelin-kuyovning kirib kelishi', ru: 'Выход молодожёнов' } },
    { time: '19:00', title: { uz: 'Tantanali ziyofat', ru: 'Праздничный ужин' } },
    { time: '22:30', title: { uz: 'Yakuniy raqs', ru: 'Последний танец' } },
  ],

  rsvp: {
    maxGuests: 5,
    // Javoblar qayerga boradi (ikkalasidan biri):
    // 1) endpoint — JSON POST qabul qiladigan URL (masalan Google Apps Script)
    endpoint: '',
    // 2) telegram — username (@siz). Mehmon Telegram'da tayyor xabar bilan ochiladi.
    telegram: '',
  },
}
