import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, ShoppingBag } from 'lucide-react'
import { apiClient } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { usePageTitle } from '@/hooks/use-page-title'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { resolveAuthRedirect } from '@/utils/auth-redirect'

type AuthResult = { token: string; refreshToken: string; user: unknown }
export default function LoginPage() {
  usePageTitle('Нэвтрэх — FreshFlow')
  const [mode, setMode] = useState<'email' | 'phone'>('email'), [error, setError] = useState(''), [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState(''), [otp, setOtp] = useState(''), [challengeId, setChallengeId] = useState('')
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation()
  const finish = () => { const from = (location.state as { from?: unknown } | null)?.from; navigate(resolveAuthRedirect(from), { replace: true }) }
  const saveAuth = (result: AuthResult) => { localStorage.setItem('tradeflow-token', result.token); localStorage.setItem('tradeflow-refresh-token', result.refreshToken); localStorage.setItem('tradeflow-user', JSON.stringify(result.user)); window.dispatchEvent(new Event('tradeflow-auth-changed')); finish() }
  const emailLogin = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setLoading(true); setError(''); const data = new FormData(event.currentTarget); try { await login({ email: String(data.get('email')), password: String(data.get('password')) }); finish() } catch (reason: any) { setError(reason?.response?.data?.message ?? 'Имэйл эсвэл нууц үг буруу.') } finally { setLoading(false) } }
  const phoneLogin = async () => { setLoading(true); setError(''); try { if (!challengeId) { const result = (await apiClient.post<{ challengeId: string; devCode?: string }>('/auth/phone/request', { phone })).data; setChallengeId(result.challengeId); if (result.devCode) setOtp(result.devCode) } else saveAuth((await apiClient.post<AuthResult>('/auth/phone/verify', { challengeId, code: otp })).data) } catch (reason: any) { setError(reason?.response?.data?.message ?? 'Утасны OTP нэвтрэлт амжилтгүй.') } finally { setLoading(false) } }
  return <div className="min-h-[calc(100vh-72px)] bg-[#fffaf2] px-4 py-10 dark:bg-[#17120c]"><div className="mx-auto grid max-w-5xl overflow-hidden rounded-[32px] border border-orange-100 bg-white shadow-xl lg:grid-cols-2 dark:border-white/10 dark:bg-[#211a12]">
    <aside className="relative hidden min-h-[680px] lg:block"><img src="/images/supermarket-hero-v2.png" alt="FreshFlow" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 to-transparent" /><div className="absolute bottom-0 p-10 text-white"><ShoppingBag className="size-10" /><h1 className="mt-5 text-5xl font-black">Хэрэгтэй бүхнээ<br />нэг дороос.</h1></div></aside>
    <main className="flex items-center p-7 sm:p-12"><div className="mx-auto w-full max-w-md"><Link to="/" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-500"><ArrowLeft className="size-4" />Нүүр хуудас</Link><h2 className="text-4xl font-black">Тавтай морил!</h2><p className="mt-2 text-slate-500">Нэвтрэх аргаа сонгоно уу.</p>
      <div className="mt-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-white/5"><button onClick={() => { setMode('email'); setError('') }} className={`rounded-lg p-3 text-sm font-bold ${mode === 'email' ? 'bg-white text-orange-600 shadow-sm dark:bg-white/10' : 'text-slate-500'}`}><Mail className="mr-2 inline size-4" />Имэйлээр нэвтрэх</button><button onClick={() => { setMode('phone'); setError('') }} className={`rounded-lg p-3 text-sm font-bold ${mode === 'phone' ? 'bg-white text-orange-600 shadow-sm dark:bg-white/10' : 'text-slate-500'}`}><Phone className="mr-2 inline size-4" />Утасны дугаараар</button></div>
      {mode === 'email' ? <form onSubmit={emailLogin} className="mt-6 space-y-4"><div><Label>Имэйл хаяг</Label><Input className="mt-2 h-13" name="email" type="email" required autoComplete="email" placeholder="name@example.com" /></div><div><div className="flex justify-between"><Label>Нууц үг</Label><Link to="/auth/forgot-password" className="text-xs font-bold text-orange-600">Нууц үгээ мартсан уу?</Link></div><Input className="mt-2 h-13" name="password" type="password" required minLength={6} autoComplete="current-password" /></div><Button className="h-13 w-full" loading={loading}>Имэйлээр нэвтрэх</Button></form> : <div className="mt-6 space-y-4"><div><Label>{challengeId ? 'OTP код' : 'Утасны дугаар'}</Label><Input className="mt-2 h-13" value={challengeId ? otp : phone} onChange={(event) => challengeId ? setOtp(event.target.value) : setPhone(event.target.value)} placeholder={challengeId ? '6 оронтой код' : '99112233'} inputMode="numeric" maxLength={challengeId ? 6 : 20} /></div><Button className="h-13 w-full" loading={loading} onClick={phoneLogin}>{challengeId ? 'OTP кодоор нэвтрэх' : 'OTP код авах'}</Button>{challengeId && <button className="w-full text-xs font-bold text-orange-600" onClick={() => { setChallengeId(''); setOtp('') }}>Дугаар солих</button>}</div>}
      {error && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}<div className="my-6 border-t" /><OAuthButtons /><p className="mt-6 text-center text-sm text-slate-500">Бүртгэлгүй юу? <Link to="/auth/register" className="font-bold text-orange-600">Бүртгэл үүсгэх</Link></p>
    </div></main></div></div>
}
