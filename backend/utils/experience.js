const normalizeExperience = (value) => {
    if (!value) return value

    const match = String(value).trim().match(/^(\d+)\s*Years?$/i)
    if (!match) return String(value).trim()

    const years = Number(match[1])
    if (years >= 10) return `${years}+ лет`
    if (years === 1) return '1 год'
    if (years >= 2 && years <= 4) return `${years} года`
    return `${years} лет`
}

export default normalizeExperience
