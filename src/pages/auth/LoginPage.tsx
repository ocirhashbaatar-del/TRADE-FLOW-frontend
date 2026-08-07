import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShoppingBag, Sparkles, Truck } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { usePageTitle } from '@/hooks/use-page-title'
import { OAuthButtons } from '@/components/auth/OAuthButtons'

const schema = z.object({
  email: z.email('Имэйл хаягаа зөв оруулна уу'),
  password: z.string().min(6, 'Нууц үг хамгийн багадаа 6 тэмдэгт байна'),
  remember: z.boolean().optional(),
})
type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  usePageTitle('Нэвтрэх — FreshFlow')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'ocirhashbaatar@gmail.com', password: 'Aa88016745', remember: true },
  })

  const finishLogin = () => {
    const requestedPath = (location.state as { from?: unknown } | null)?.from
    navigate(typeof requestedPath === 'string' && requestedPath.startsWith('/') && requestedPath !== '/' ? requestedPath : '/products', { replace: true })
  }

  const submit = async (values: FormValues) => {
    setAuthError('')
    try { await login(values); finishLogin() } catch { setAuthError('Нэвтрэхэд алдаа гарлаа. Имэйл болон нууц үгээ шалгана уу.') }
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#fffaf2] px-4 py-6 dark:bg-[#17120c] sm:px-6 lg:py-10">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[32px] border border-orange-100 bg-white shadow-[0_24px_80px_-30px_rgba(120,72,16,.28)] lg:min-h-[720px] lg:grid-cols-[1.02fr_.98fr] dark:border-white/10 dark:bg-[#211a12]">
        <aside className="relative hidden min-h-full overflow-hidden lg:block">
          <img src="/images/supermarket-hero-v2.png" alt="FreshFlow хүнсний шинэ бүтээгдэхүүнүүд" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#163b2a]/95 via-[#163b2a]/28 to-transparent" />
          <Link to="/" className="absolute left-8 top-8 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white"><ArrowLeft className="size-4" /> Нүүр хуудас</Link>
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ff9f1c] px-4 py-2 text-xs font-extrabold uppercase tracking-[.16em]"><Sparkles className="size-4" /> Өдөр бүр шинэхэн</div>
            <h1 className="mt-5 max-w-lg text-5xl font-black leading-[1.08] tracking-[-.045em]">Хэрэгтэй бүхнээ<br />нэг дороос.</h1>
            <p className="mt-4 max-w-md text-lg leading-7 text-white/80">Шинэ хүнс, өргөн хэрэглээний бараагаа хурдан сонгож, гэртээ хүргүүлээрэй.</p>
            <div className="mt-7 flex gap-3 text-sm font-semibold"><span className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-3 backdrop-blur"><Truck className="size-5 text-orange-300" /> Шуурхай хүргэлт</span><span className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-3 backdrop-blur"><ShoppingBag className="size-5 text-orange-300" /> Шинэ бараа</span></div>
          </div>
        </aside>

        <main className="flex items-center p-6 sm:p-10 lg:p-14">
          <div className="mx-auto w-full max-w-md">
            <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-600 lg:hidden"><ArrowLeft className="size-4" /> Нүүр хуудас</Link>
            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600"><ShoppingBag className="size-7" /></div>
            <h2 className="mt-5 text-4xl font-black tracking-[-.04em] text-slate-900 dark:text-white">Тавтай морил!</h2>
            <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">Бүртгэлдээ нэвтэрч худалдан авалтаа үргэлжлүүлээрэй.</p>

            <form onSubmit={handleSubmit(submit)} className="mt-8 space-y-5">
              <div className="space-y-2"><Label htmlFor="email" className="font-bold">Имэйл хаяг</Label><div className="relative"><Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" /><Input id="email" type="email" autoComplete="email" placeholder="name@example.com" className="h-14 rounded-xl border-slate-200 bg-[#fffdf9] pl-12 focus:border-orange-400 dark:border-white/10 dark:bg-white/5" {...register('email')} /></div>{errors.email && <p className="text-xs font-medium text-rose-600">{errors.email.message}</p>}</div>
              <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="password" className="font-bold">Нууц үг</Label><Link to="/auth/forgot-password" className="text-xs font-bold text-orange-600 hover:text-orange-700">Нууц үгээ мартсан уу?</Link></div><div className="relative"><LockKeyhole className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" /><Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" className="h-14 rounded-xl border-slate-200 bg-[#fffdf9] pl-12 pr-12 focus:border-orange-400 dark:border-white/10 dark:bg-white/5" {...register('password')} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600" aria-label={showPassword ? 'Нууц үг нуух' : 'Нууц үг харах'}>{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button></div>{errors.password && <p className="text-xs font-medium text-rose-600">{errors.password.message}</p>}</div>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600 dark:text-slate-300"><input type="checkbox" className="size-4 rounded border-slate-300 accent-orange-500" {...register('remember')} /> Намайг санадаг байх</label>
              <Button type="submit" size="lg" loading={isSubmitting} className="h-14 w-full rounded-xl bg-[#f58a07] text-base font-bold shadow-lg shadow-orange-500/20 hover:bg-[#e67d00]">Нэвтрэх <ArrowRight className="size-5" /></Button>
            </form>
            {authError && <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{authError}</div>}
            <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-white/10" /></div><div className="relative flex justify-center"><span className="bg-white px-4 text-xs font-semibold text-slate-400 dark:bg-[#211a12]">эсвэл</span></div></div>
            <OAuthButtons />
            <p className="mt-7 text-center text-sm text-slate-500">Шинэ хэрэглэгч үү? <Link to="/auth/register" className="font-bold text-orange-600 hover:text-orange-700">Бүртгэл үүсгэх</Link></p>
          </div>
        </main>
      </div>
    </div>
  )
}
