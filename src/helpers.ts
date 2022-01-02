export const generateGameId = () => {
  const alphabet = [...'bcdfghjklmnpqrstwvxz']
  const randomElementFromList = () =>
    alphabet[Math.floor(Math.random() * alphabet.length)]

  return [...Array(11)]
    .map((e, i) => (i !== 3 && i !== 7 ? randomElementFromList() : '-'))
    .join('')
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}
