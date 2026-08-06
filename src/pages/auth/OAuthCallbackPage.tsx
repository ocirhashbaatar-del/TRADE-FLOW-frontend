import { useEffect, useRef, useState } from 'react'
import { LoaderCircle, ShieldCheck } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'

export default function OAuthCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { oauthExchange } = useAuth()
  const code = params.get('code')
  const [error, setError] = useState(() => !code || params.get('error') ? 'Social login амжилтгүй боллоо.' : '')
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    if (!code) return
    oauthExchange(code).then(() => {
      const destination = sessionStorage.getItem('tradeflow-oauth-return') ?? '/'
      sessionStorage.removeItem('tradeflow-oauth-return')
      navigate(destination, { replace: true })
    }).catch(() => setError('OAuth code хүчингүй эсвэл хугацаа дууссан.'))
  }, [code, oauthExchange, navigate])

  return <div className="grid min-h-[70vh] place-items-center bg-[#f4faf7] px-4 dark:bg-[#04110d]"><div className="w-full max-w-md rounded-[32px] border border-emerald-950/10 bg-white p-10 text-center shadow-2xl dark:border-white/10 dark:bg-[#091914]">{error ? <><ShieldCheck className="mx-auto size-12 text-rose-500" /><h1 className="mt-5 text-2xl font-bold">Нэвтрэх боломжгүй</h1><p className="mt-3 text-sm text-slate-500">{error}</p><Link to="/auth/login" state={{ from: '/' }} className="mt-6 inline-block font-bold text-emerald-600">Login руу буцах</Link></> : <><LoaderCircle className="mx-auto size-12 animate-spin text-emerald-600" /><h1 className="mt-5 text-2xl font-bold">Бүртгэлийг баталгаажуулж байна</h1><p className="mt-3 text-sm text-slate-500">Түр хүлээнэ үү...</p></>}</div></div>
}
