interface EnvConfig {
  appName: string
}

function getEnvVar(key: string, fallback?: string): string {
  const value = import.meta.env[key] as string | undefined
  return value ?? fallback ?? ''
}

export const env: EnvConfig = {
  appName: getEnvVar('VITE_APP_NAME', 'Filo'),
}
