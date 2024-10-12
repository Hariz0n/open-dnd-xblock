export const swapKeyAndValue = <O extends Record<string, S>, S extends string | number | null>(obj: O) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = {} as any

  for (const key in obj) {
    const value = obj[key] as string

    if (!value) {
      continue;
    }

    result[value] = key
  }

  return result;
}