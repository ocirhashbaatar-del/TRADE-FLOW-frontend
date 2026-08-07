import { useLocation } from 'react-router-dom'

const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1'

export function OAuthButtons() {
  const location = useLocation()
  const rememberReturnPath = () => {
    const requested = (location.state as { from?: unknown } | null)?.from
    sessionStorage.setItem('tradeflow-oauth-return', typeof requested === 'string' && requested.startsWith('/') && requested !== '/' ? requested : '/products')
  }
  return <div className="space-y-3">
    <a onClick={rememberReturnPath} href={`${apiBase}/auth/oauth/google/start`} className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 dark:border-white/10 dark:bg-white/5 dark:text-white"><span className="text-base font-black text-[#4285F4]">G</span>Google-ээр үргэлжлүүлэх</a>
    <a onClick={rememberReturnPath} href={`${apiBase}/auth/oauth/facebook/start`} className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#1877F2]/20 bg-[#1877F2] text-sm font-semibold text-white shadow-sm transition hover:bg-[#1268d3]"><span className="grid size-5 place-items-center rounded-full bg-white text-base font-black text-[#1877F2]">f</span>Facebook-ээр үргэлжлүүлэх</a>
  </div>
}
