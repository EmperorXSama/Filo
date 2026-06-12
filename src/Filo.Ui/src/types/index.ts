export interface User {
  id: string
  email: string
  name: string
}

export interface CurrentUser {
  userId: string
  identityId: string
  email: string
  fullName: string
  roles: string[]
  permissions: string[]
  avatar: string
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

export interface SystemInfo {
  machineName: string
  osVersion: string
  osArchitecture: string
  processArchitecture: string
  runtimeVersion: string
  clrVersion: string
  runtimeIdentifier: string
  environment: string
  workingDirectory: string
  userName: string
  userDomainName: string
  is64BitProcess: boolean
  processorCount: number
  processUptime: string
  applicationVersion: string
  applicationName: string
  userInteractive: boolean
}


