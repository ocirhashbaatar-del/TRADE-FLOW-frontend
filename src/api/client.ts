import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1'

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('tradeflow-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }
let refreshPromise: Promise<string> | null = null

const clearSession = () => {
  localStorage.removeItem('tradeflow-token')
  localStorage.removeItem('tradeflow-refresh-token')
  localStorage.removeItem('tradeflow-user')
  window.dispatchEvent(new Event('tradeflow-auth-changed'))
}

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('tradeflow-refresh-token')
  if (!refreshToken) throw new Error('Refresh token байхгүй.')
  const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(`${baseURL}/auth/refresh`, { refreshToken }, { headers: { 'Content-Type': 'application/json' } })
  localStorage.setItem('tradeflow-token', data.accessToken)
  localStorage.setItem('tradeflow-refresh-token', data.refreshToken)
  return data.accessToken
}

apiClient.interceptors.response.use((response) => response, async (error: AxiosError) => {
  const config = error.config as RetryConfig | undefined
  const isAuthRequest = config?.url?.startsWith('/auth/login') || config?.url?.startsWith('/auth/refresh') || config?.url?.startsWith('/auth/guest')
  if (error.response?.status !== 401 || !config || config._retry || isAuthRequest) return Promise.reject(error)
  config._retry = true
  try {
    refreshPromise ??= refreshAccessToken().finally(() => { refreshPromise = null })
    const accessToken = await refreshPromise
    config.headers.Authorization = `Bearer ${accessToken}`
    return apiClient(config)
  } catch (refreshError) {
    clearSession()
    return Promise.reject(refreshError)
  }
})
