export const generateGameId = () => {
  const allowedLetters = 'bcdfghjklmnpqrstwvxz'
  const allowedLettersArray = [...allowedLetters]
  const getRandomAllowedLetter = () =>
    allowedLettersArray[Math.floor(Math.random() * allowedLettersArray.length)]

  return [...Array(11)]
    .map((e, i) => (i !== 3 && i !== 7 ? getRandomAllowedLetter() : '-'))
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
