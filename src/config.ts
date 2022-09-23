export const getEnv = (name: string, defaultValue?: string): string => {
  const val = process.env[name]

  if (val === undefined && defaultValue === undefined) {
    throw Error(`Missing required environment variable: ${name}`)
  }

  return val || defaultValue as string
}
