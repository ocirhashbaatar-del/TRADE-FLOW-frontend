import { FormEvent, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { apiClient } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { AuthResponse } from '@/types'

export default function AcceptInvitePage() {
  const [params] = useSearchParams(), navigate = useNavigate(), [error, setError] = useState('')
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data=new FormData(event.currentTarget); try { const response=(await apiClient.post<AuthResponse & { refreshToken?: string }>('/auth/accept-invite', { token: params.get('token'), password: data.get('password') })).data; localStorage.setItem('tradeflow-token', response.token); localStorage.setItem('tradeflow-user', JSON.stringify(response.user)); if (response.refreshToken) localStorage.setItem('tradeflow-refresh-token', response.refreshToken); window.dispatchEvent(new Event('tradeflow-auth-changed')); navigate('/', { replace: true }) } catch { setError('Урилга хүчингүй эсвэл хугацаа дууссан байна.') } }
  return <div className="grid min-h-[70vh] place-items-center p-4"><Card className="w-full max-w-md p-7"><h1 className="text-2xl font-bold">Ажилтны урилга зөвшөөрөх</h1><p className="mt-2 text-sm text-slate-500">Нууц үгээ тохируулаад TradeFlow-д нэвтэрнэ.</p><form onSubmit={submit} className="mt-6 space-y-3"><Input name="password" required type="password" minLength={8} placeholder="Шинэ нууц үг" /><Button className="w-full">Урилга зөвшөөрөх</Button></form>{error && <p className="mt-3 text-sm text-rose-600">{error}</p>}</Card></div>
}
