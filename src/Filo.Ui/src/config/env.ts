interface EnvConfig {
  apiBaseUrl: string
  appName: string
}

function getEnvVar(key: string, fallback?: string): string {
  const value = import.meta.env[key] as string | undefined
  return value ?? fallback ?? ''
}

export const env: EnvConfig = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL'),
  appName: getEnvVar('VITE_APP_NAME', 'Filo'),
}
