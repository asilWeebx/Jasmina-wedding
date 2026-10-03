import { createContext, useContext, useEffect, useState } from 'react'

const dict = {
  uz: {
    introKicker: 'Taklifnoma',
    introOpen: 'Ochish',
    introHint: 'taklifnomani oching',
    cardKicker: "Nikoh to'yiga taklifnoma",
    cardText: "Hayotimizdagi eng quvonchli kunda sizni yonimizda ko'rishdan baxtiyor bo'lamiz",
    at: 'soat',
    enter: "Taklifnomani ko'rish",
    heroKicker: "Nikoh to'yi",
    secInvite: 'Taklif',
    brideLbl: 'Kelin',
    groomLbl: 'Kuyov',
    dateLbl: 'Sana',
    dayLbl: 'Kun',
    timeLbl: 'Vaqt',
    placeLbl: 'Joy',
    and: 'va',
    scroll: 'pastga',
    inviteKicker: 'Aziz va qadrli mehmonimiz',
    inviteText:
      "Ikki qalb, ikki oila bir dasturxon atrofida jamlanadigan kunda — sizni yonimizda ko'rish biz uchun eng katta baxt.",
    inviteText2: "Sizni nikoh to'yimizga samimiy taklif qilamiz.",
    ayah:
      '«Uning oyatlaridan biri — sizlar uchun o\'zlaringizdan juftlar yaratgani, ular bilan sukunat topishingiz uchundir. Va oralaringizda muhabbat va rahmat paydo qildi»',
    ayahSrc: 'Rum surasi, 21-oyat',
    dateKicker: 'Sana',
    weekdays: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
    countdownKicker: "To'ygacha qoldi",
    days: 'kun',
    hours: 'soat',
    minutes: 'daqiqa',
    seconds: 'soniya',
    today: "Bugun — to'y kuni!",
    programKicker: "Kun tartibi",
    programTitle: 'Kechamiz qanday o\'tadi',
    venueKicker: 'Manzil',
    venueTitle: "To'y bo'lib o'tadigan joy",
    routeGoogle: 'Google Maps',
    routeYandex: 'Yandex Maps',
    rsvpKicker: 'Javobingiz',
    rsvpTitle: 'Tashrifingizni tasdiqlang',
    rsvpSub: "Iltimos, 20-oktabrgacha javob bering",
    name: 'Ismingiz',
    namePh: 'Ism va familiya',
    attend: 'Kela olasizmi?',
    yes: 'Albatta kelaman',
    no: 'Afsuski, kela olmayman',
    guests: 'Mehmonlar soni',
    send: 'Yuborish',
    sending: 'Yuborilmoqda…',
    thanksYes: "Rahmat! Sizni intiqlik bilan kutamiz.",
    thanksNo: 'Rahmat! Sizni duolarimizda eslaymiz.',
    nameErr: 'Iltimos, ismingizni yozing',
    closingLine: 'Sizni kutib qolamiz',
    closingSub: 'muhabbat va hurmat ila',
    music: 'Musiqa',
    tgMsg: (n, a, g) =>
      `Assalomu alaykum! Men, ${n}, ${a ? `to'yingizga ${g} kishi bo'lib kelaman` : "afsuski, to'yingizga kela olmayman"}.`,
  },
  ru: {
    introKicker: 'Приглашение',
    introOpen: 'Открыть',
    introHint: 'откройте приглашение',
    cardKicker: 'Приглашение на свадьбу',
    cardText: 'Будем счастливы разделить с вами самый радостный день нашей жизни',
    at: 'в',
    enter: 'Смотреть приглашение',
    heroKicker: 'Свадьба',
    secInvite: 'Приглашение',
    brideLbl: 'Невеста',
    groomLbl: 'Жених',
    dateLbl: 'Дата',
    dayLbl: 'День',
    timeLbl: 'Время',
    placeLbl: 'Место',
    and: 'и',
    scroll: 'вниз',
    inviteKicker: 'Дорогие гости',
    inviteText:
      'В день, когда два сердца и две семьи соберутся за одним столом, видеть вас рядом — наше самое большое счастье.',
    inviteText2: 'Сердечно приглашаем вас на нашу свадьбу.',
    ayah:
      '«Среди Его знамений — то, что Он сотворил для вас жён из вас самих, чтобы вы находили в них успокоение, и установил между вами любовь и милосердие»',
    ayahSrc: 'Сура Ар-Рум, аят 21',
    dateKicker: 'Дата',
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    countdownKicker: 'До свадьбы осталось',
    days: 'дней',
    hours: 'часов',
    minutes: 'минут',
    seconds: 'секунд',
    today: 'Сегодня — день свадьбы!',
    programKicker: 'Программа',
    programTitle: 'Как пройдёт наш вечер',
    venueKicker: 'Место',
    venueTitle: 'Где пройдёт торжество',
    routeGoogle: 'Google Maps',
    routeYandex: 'Яндекс Карты',
    rsvpKicker: 'Ваш ответ',
    rsvpTitle: 'Подтвердите присутствие',
    rsvpSub: 'Пожалуйста, ответьте до 20 октября',
    name: 'Ваше имя',
    namePh: 'Имя и фамилия',
    attend: 'Сможете прийти?',
    yes: 'Обязательно приду',
    no: 'К сожалению, не смогу',
    guests: 'Количество гостей',
    send: 'Отправить',
    sending: 'Отправка…',
    thanksYes: 'Спасибо! Будем вас ждать.',
    thanksNo: 'Спасибо! Вы в наших сердцах.',
    nameErr: 'Пожалуйста, укажите имя',
    closingLine: 'Ждём вас',
    closingSub: 'с любовью и уважением',
    music: 'Музыка',
    tgMsg: (n, a, g) =>
      `Здравствуйте! Я, ${n}, ${a ? `приду на свадьбу, нас будет ${g}` : 'к сожалению, не смогу прийти'}.`,
  },
}

export const months = {
  uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
  ru: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
}
export const weekdaysLong = {
  uz: ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'],
  ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
}

const Ctx = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('jm-lang') || 'uz'
    } catch {
      return 'uz'
    }
  })
  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('jm-lang', lang)
    } catch {}
  }, [lang])
  return <Ctx.Provider value={{ lang, setLang, t: dict[lang] }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
