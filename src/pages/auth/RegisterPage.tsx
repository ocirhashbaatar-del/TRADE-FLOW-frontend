import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'
import { apiClient } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { useAuth } from '@/contexts/auth-context'
import { usePageTitle } from '@/hooks/use-page-title'

type AuthResult = { token: string; refreshToken: string; user: unknown }
export default function RegisterPage() {
  usePageTitle('Бүртгүүлэх — FreshFlow')
  const [mode, setMode] = useState<'email' | 'phone'>('phone')
  const [name, setName] = useState(''), [phone, setPhone] = useState(''), [otp, setOtp] = useState(''), [challengeId, setChallengeId] = useState('')
  const [loading, setLoading] = useState(false), [error, setError] = useState('')
  const { register: emailRegister } = useAuth(); const navigate = useNavigate()
  const saveAuth = (result: AuthResult) => { localStorage.setItem('tradeflow-token', result.token); localStorage.setItem('tradeflow-refresh-token', result.refreshToken); localStorage.setItem('tradeflow-user', JSON.stringify(result.user)); window.dispatchEvent(new Event('tradeflow-auth-changed')); navigate('/products', { replace: true }) }
  const registerPhone = async () => { setLoading(true); setError(''); try { if (!challengeId) { const result = (await apiClient.post<{ challengeId: string; devCode?: string }>('/auth/phone/register/request', { name, phone })).data; setChallengeId(result.challengeId); if (result.devCode) setOtp(result.devCode) } else saveAuth((await apiClient.post<AuthResult>('/auth/phone/register/verify', { name, challengeId, code: otp })).data) } catch (reason: any) { setError(reason?.response?.data?.message ?? 'Утасны OTP бүртгэл амжилтгүй.') } finally { setLoading(false) } }
  const registerEmail = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setLoading(true); setError(''); const data = new FormData(event.currentTarget), password = String(data.get('password')); try { if (password !== String(data.get('confirmPassword'))) throw new Error('Нууц үг таарахгүй байна.'); await emailRegister({ name: String(data.get('name')), email: String(data.get('email')), password }); navigate('/products', { replace: true }) } catch (reason: any) { setError(reason?.response?.data?.message ?? reason?.message ?? 'Бүртгэл амжилтгүй.') } finally { setLoading(false) } }
  const phoneDisabled = Boolean(name.trim().length < 2 || (!challengeId && phone.length < 8) || (challengeId && otp.length !== 6))
  return <div className="min-h-[calc(100vh-72px)] bg-[#fffaf2] px-4 py-10 dark:bg-[#17120c]"><main className="mx-auto max-w-xl rounded-[32px] bg-white p-7 shadow-xl sm:p-12 dark:bg-[#211a12]"><h1 className="text-4xl font-black">Бүртгэл үүсгэх</h1><p className="mt-2 text-slate-500">Бүртгүүлэх аргаа сонгоно уу.</p>
    <div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
      <button onClick={() => { setMode('phone'); setError('') }} className={`rounded-lg p-3 text-sm font-bold ${mode === 'phone' ? 'bg-white text-orange-600 shadow-sm dark:bg-white/10' : 'text-slate-500'}`}><Phone className="mr-2 inline size-4" />Утасны дугаараар</button>
      <button onClick={() => { setMode('email'); setError('') }} className={`rounded-lg p-3 text-sm font-bold ${mode === 'email' ? 'bg-white text-orange-600 shadow-sm dark:bg-white/10' : 'text-slate-500'}`}><Mail className="mr-2 inline size-4" />Имэйлээр</button>
    </div>
    {mode === 'phone' ? <div className="mt-6 space-y-4">
      <div><Label>Таны нэр</Label><Input className="mt-2 h-13" value={name} onChange={(event) => setName(event.target.value)} placeholder="Овог, нэр" /></div>
      <div><Label>{challengeId ? 'OTP код' : 'Утасны дугаар'}</Label><Input className="mt-2 h-13" value={challengeId ? otp : phone} onChange={(event) => challengeId ? setOtp(event.target.value) : setPhone(event.target.value)} inputMode="numeric" maxLength={challengeId ? 6 : 20} placeholder={challengeId ? '6 оронтой код' : '99112233'} /></div>
      <Button className="h-13 w-full" loading={loading} disabled={phoneDisabled} onClick={registerPhone}>{challengeId ? 'OTP баталгаажуулж бүртгүүлэх' : 'OTP код авах'}</Button>
      {challengeId && <button className="w-full text-xs font-bold text-orange-600" onClick={() => { setChallengeId(''); setOtp('') }}>Дугаар солих</button>}
    </div> : <form onSubmit={registerEmail} className="mt-6 space-y-4">
      <div><Label>Таны нэр</Label><Input className="mt-2 h-13" name="name" required minLength={2} /></div><div><Label>Имэйл</Label><Input className="mt-2 h-13" name="email" type="email" required /></div><div><Label>Нууц үг</Label><Input className="mt-2 h-13" name="password" type="password" required minLength={8} /></div><div><Label>Нууц үг давтах</Label><Input className="mt-2 h-13" name="confirmPassword" type="password" required minLength={8} /></div><Button className="h-13 w-full" loading={loading}>Имэйлээр бүртгүүлэх</Button>
    </form>}
    {error && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}<div className="my-6 border-t" /><OAuthButtons /><p className="mt-6 text-center text-sm text-slate-500">Бүртгэлтэй юу? <Link to="/auth/login" className="font-bold text-orange-600">Нэвтрэх</Link></p></main></div>
}
