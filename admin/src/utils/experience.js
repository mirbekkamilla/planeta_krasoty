export const EXPERIENCE_OPTIONS = [
  '1 год', '2 года', '3 года', '4 года', '5 лет',
  '6 лет', '7 лет', '8 лет', '9 лет', '10+ лет'
]

export const formatExperience = (value) => {
  if (!value) return ''

  const match = String(value).trim().match(/^(\d+)\s*Years?$/i)
  if (!match) return value

  const years = Number(match[1])
  if (years >= 10) return `${years}+ лет`
  if (years === 1) return '1 год'
  if (years >= 2 && years <= 4) return `${years} года`
  return `${years} лет`
}
