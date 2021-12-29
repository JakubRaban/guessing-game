export const generateGameId = () => {
  const alphabet = [...'bcdfghjklmnpqrstwvxz']
  const randomElementFromList = () =>
    alphabet[Math.floor(Math.random() * alphabet.length)]

  return [...Array(11)]
    .map((e, i) => (i !== 3 && i !== 7 ? randomElementFromList() : '-'))
    .join('')
}
