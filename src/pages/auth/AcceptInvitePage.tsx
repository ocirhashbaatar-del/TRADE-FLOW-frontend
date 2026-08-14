import axios from 'axios'
import { type FormEvent, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiClient } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { AuthResponse } from '@/types'
import { getRoleHome } from '@/utils/role-routing'

export default function AcceptInvitePage() {
  const [params] = useSearchParams()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const submittingRef = useRef(false)
  const token = params.get('token')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submittingRef.current) return
    if (!token) { setError('Урилгын холбоос дутуу байна.'); return }
    submittingRef.current = true
    setError('')
    setSubmitting(true)
    const data = new FormData(event.currentTarget)
    try {
      const response = (await apiClient.post<AuthResponse & { refreshToken?: string }>('/auth/accept-invite', { token, password: data.get('password') })).data
      localStorage.setItem('tradeflow-token', response.token)
      localStorage.setItem('tradeflow-user', JSON.stringify(response.user))
      if (response.refreshToken) localStorage.setItem('tradeflow-refresh-token', response.refreshToken)
      window.location.replace(getRoleHome(response.user.role))
    } catch (requestError) {
      const message = axios.isAxiosError(requestError) ? requestError.response?.data?.message : undefined
      setError(String(message ?? 'Урилгыг зөвшөөрөхөд алдаа гарлаа. Дахин оролдоно уу.'))
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  return <div className="grid min-h-[70vh] place-items-center p-4"><Card className="w-full max-w-md p-7"><h1 className="text-2xl font-bold">Ажилтны урилга зөвшөөрөх</h1><p className="mt-2 text-sm text-slate-500">Нууц үгээ тохируулаад TradeFlow-д нэвтэрнэ.</p><form onSubmit={submit} className="mt-6 space-y-3"><Input name="password" required type="password" minLength={8} autoComplete="new-password" placeholder="Шинэ нууц үг" /><Button className="w-full" loading={submitting} disabled={submitting || !token}>Урилга зөвшөөрөх</Button></form>{error && <p className="mt-3 text-sm text-rose-600">{error}</p>}</Card></div>
}
