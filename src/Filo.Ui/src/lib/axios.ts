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
