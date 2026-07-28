import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { usePageTitle } from '@/hooks/use-page-title'

const schema = z.object({ email: z.email('Enter a valid email'), password: z.string().min(6, 'Password must contain at least 6 characters'), remember: z.boolean().optional() })
type FormValues = z.infer<typeof schema>
export default function LoginPage() {
  usePageTitle('Sign in')
  const [show, setShow] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: 'alex@tradeflow.dev', password: 'password', remember: true } })
  const submit = async (values: FormValues) => { await login(values); navigate('/dashboard') }
  return <div><div className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">Welcome back</div><h1 className="mt-5 text-3xl font-bold tracking-[-.035em] text-slate-950 dark:text-white">Sign in to TradeFlow</h1><p className="mt-2 text-sm leading-6 text-slate-500">Use the prefilled demo credentials to access the mock enterprise workspace.</p><form onSubmit={handleSubmit(submit)} className="mt-8 space-y-5"><div className="space-y-2"><Label htmlFor="email">Work email</Label><div className="relative"><Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><Input id="email" type="email" className="pl-10" {...register('email')}/></div>{errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}</div><div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="password">Password</Label><Link className="text-xs font-semibold text-brand-600 hover:text-brand-700" to="/auth/forgot-password">Forgot password?</Link></div><div className="relative"><LockKeyhole className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><Input id="password" type={show ? 'text' : 'password'} className="pl-10 pr-10" {...register('password')}/><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"><Eye className="size-4"/></button></div>{errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}</div><label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><input type="checkbox" className="size-4 rounded border-slate-300 text-brand-600" {...register('remember')}/>Keep me signed in</label><Button type="submit" size="lg" className="w-full" loading={isSubmitting}>Sign in<ArrowRight className="size-4"/></Button></form><div className="relative my-7"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"/></div><div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-400 dark:bg-slate-950">or continue with SSO</span></div></div><Button variant="secondary" size="lg" className="w-full">Enterprise single sign-on</Button><p className="mt-7 text-center text-sm text-slate-500">New to TradeFlow? <Link to="/auth/register" className="font-semibold text-brand-600">Create an account</Link></p></div>
}
