import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        const returnUrl = window.location.pathname + window.location.search
        window.location.href = `/api/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`
        return Promise.reject(error)
      }

      const normalized = {
        status: error.response?.status ?? 0,
        message: error.response?.data?.detail ?? error.response?.data?.message ?? error.message,
        errors: error.response?.data?.errors,
      }
      return Promise.reject(normalized)
    }
    return Promise.reject(error)
  },
)

export { apiClient }
