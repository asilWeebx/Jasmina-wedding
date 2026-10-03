import { wedding } from '../config'

export const weddingDate = new Date(`${wedding.date}T${wedding.time}:00${wedding.tz}`)

const [Y, M, D] = wedding.date.split('-').map(Number)
export const year = Y
export const monthIndex = M - 1
export const day = D

// Kalendar katakchalari (hafta dushanbadan boshlanadi)
export function monthGrid() {
  const first = new Date(Date.UTC(Y, M - 1, 1)).getUTCDay() // 0 = yakshanba
  const offset = (first + 6) % 7
  const total = new Date(Date.UTC(Y, M, 0)).getUTCDate()
  const cells = Array(offset).fill(null)
  for (let d = 1; d <= total; d++) cells.push(d)
  while (cells.length % 7) cells.push(null)
  return cells
}

export const weekdayIndex = new Date(Date.UTC(Y, M - 1, D)).getUTCDay()

export function timeLeft(now = Date.now()) {
  const diff = Math.max(0, weddingDate.getTime() - now)
  return {
    done: diff === 0,
    d: Math.floor(diff / 864e5),
    h: Math.floor((diff / 36e5) % 24),
    m: Math.floor((diff / 6e4) % 60),
    s: Math.floor((diff / 1e3) % 60),
  }
}
