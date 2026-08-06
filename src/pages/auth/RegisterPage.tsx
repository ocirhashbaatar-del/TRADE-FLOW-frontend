import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShoppingBag, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OAuthButtons } from '@/components/auth/OAuthButtons'
import { useAuth } from '@/contexts/auth-context'
import { usePageTitle } from '@/hooks/use-page-title'

const schema = z.object({
  name: z.string().min(2, 'Нэрээ оруулна уу'),
  email: z.email('Имэйл хаягаа зөв оруулна уу'),
  password: z.string().min(8, 'Нууц үг хамгийн багадаа 8 тэмдэгт байна').regex(/[A-Z]/, 'Нэг том үсэг оруулна уу').regex(/[0-9]/, 'Нэг тоо оруулна уу'),
  confirmPassword: z.string().min(1, 'Нууц үгээ давтан оруулна уу'),
}).refine((value) => value.password === value.confirmPassword, { path: ['confirmPassword'], message: 'Нууц үг таарахгүй байна' })
type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  usePageTitle('Бүртгүүлэх — FreshFlow')
  const { register: createAccount } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const submit = async (values: FormValues) => {
    setAuthError('')
    try { await createAccount({ name: values.name, email: values.email, password: values.password }); navigate('/products', { replace: true }) }
    catch { setAuthError('Бүртгэл үүсгэхэд алдаа гарлаа. Энэ имэйл бүртгэлтэй байж магадгүй.') }
  }

  return <div className="min-h-[calc(100vh-72px)] bg-[#fffaf2] px-4 py-8 dark:bg-[#17120c]">
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[32px] border border-orange-100 bg-white shadow-[0_24px_80px_-30px_rgba(120,72,16,.28)] lg:grid-cols-[.9fr_1.1fr] dark:border-white/10 dark:bg-[#211a12]">
      <aside className="relative hidden min-h-[680px] overflow-hidden lg:block"><img src="/images/organic-banner.jpg" alt="Шинэхэн хүнсний бүтээгдэхүүн" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#173c2b]/90 via-transparent to-black/10" /><Link to="/" className="absolute left-7 top-7 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-slate-800"><ArrowLeft className="size-4" /> Нүүр хуудас</Link><div className="absolute inset-x-0 bottom-0 p-9 text-white"><h1 className="text-4xl font-black leading-tight">FreshFlow хэрэглэгч болоорой.</h1><p className="mt-3 leading-7 text-white/80">Бараагаа хадгалж, захиалгаа хурдан хийж, хүргэлтээ хянаарай.</p></div></aside>
      <main className="flex items-center p-6 sm:p-10 lg:p-12"><div className="mx-auto w-full max-w-md">
        <Link to="/" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-500 lg:hidden"><ArrowLeft className="size-4" /> Нүүр хуудас</Link>
        <div className="grid size-14 place-items-center rounded-2xl bg-orange-100 text-orange-600"><ShoppingBag className="size-7" /></div><h2 className="mt-5 text-4xl font-black tracking-tight">Бүртгэл үүсгэх</h2><p className="mt-2 text-slate-500">Энгийн хэрэглэгчийн бүртгэл үүсгэнэ.</p>
        <form onSubmit={handleSubmit(submit)} className="mt-7 space-y-4">
          <FormField label="Таны нэр" error={errors.name?.message}><User className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" /><Input autoComplete="name" placeholder="Овог, нэр" className="h-13 rounded-xl bg-[#fffdf9] pl-12" {...register('name')} /></FormField>
          <FormField label="Имэйл хаяг" error={errors.email?.message}><Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" /><Input type="email" autoComplete="email" placeholder="name@example.com" className="h-13 rounded-xl bg-[#fffdf9] pl-12" {...register('email')} /></FormField>
          <FormField label="Нууц үг" error={errors.password?.message}><LockKeyhole className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" /><Input type={showPassword ? 'text' : 'password'} autoComplete="new-password" className="h-13 rounded-xl bg-[#fffdf9] pl-12 pr-12" {...register('password')} /><button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button></FormField>
          <FormField label="Нууц үг давтах" error={errors.confirmPassword?.message}><LockKeyhole className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" /><Input type={showPassword ? 'text' : 'password'} autoComplete="new-password" className="h-13 rounded-xl bg-[#fffdf9] pl-12" {...register('confirmPassword')} /></FormField>
          <Button type="submit" loading={isSubmitting} className="h-14 w-full rounded-xl bg-[#f58a07] text-base font-bold hover:bg-[#e67d00]">Хэрэглэгчээр бүртгүүлэх <ArrowRight className="size-5" /></Button>
        </form>
        {authError && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">{authError}</div>}
        <div className="relative my-5 border-t border-slate-200"><span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-slate-400 dark:bg-[#211a12]">эсвэл</span></div><OAuthButtons />
        <p className="mt-5 text-center text-sm text-slate-500">Бүртгэлтэй юу? <Link to="/auth/login" className="font-bold text-orange-600">Нэвтрэх</Link></p>
        <p className="mt-3 text-center text-xs leading-5 text-slate-400">Нийлүүлэгч болон байгууллагын эрхийг зөвхөн админ олгоно.</p>
      </div></main>
    </div>
  </div>
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label className="font-bold">{label}</Label><div className="relative">{children}</div>{error && <p className="text-xs font-medium text-rose-600">{error}</p>}</div>
}
