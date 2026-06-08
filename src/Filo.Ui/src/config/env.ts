interface EnvConfig {
  apiBaseUrl: string
  appName: string
}

function getEnvVar(key: string): string {
  const value = import.meta.env[key] as string | undefined
  if (value === undefined) {
    throw new Error(
      `Missing environment variable: ${key}. ` +
        `Please ensure it is defined in your .env file.`,
    )
  }
  return value
}

export const env: EnvConfig = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL'),
  appName: getEnvVar('VITE_APP_NAME'),
}
