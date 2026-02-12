export const daysFromNow = (n: number): Date => {
  const date = new Date()

  date.setDate(date.getDate() + n)

  return date
}

export const now = () => new Date()
