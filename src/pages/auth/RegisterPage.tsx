import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { usePageTitle } from '@/hooks/use-page-title'
const schema = z.object({ name: z.string().min(2), company: z.string().min(2), email: z.email(), password: z.string().min(8) })
type FormValues = z.infer<typeof schema>
export default function RegisterPage() { usePageTitle('Create account'); const { register: registerUser } = useAuth(); const navigate = useNavigate(); const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) }); const submit = async (values: FormValues) => { await registerUser(values); navigate('/auth/role-selection') }; return <div><div className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">Start your workspace</div><h1 className="mt-5 text-3xl font-bold tracking-[-.035em]">Create your account</h1><p className="mt-2 text-sm leading-6 text-slate-500">Set up a mock enterprise tenant and explore the complete frontend.</p><form onSubmit={handleSubmit(submit)} className="mt-8 space-y-4">{[
  { id:'name', label:'Full name', icon:User, type:'text' }, { id:'company', label:'Company', icon:Building2, type:'text' }, { id:'email', label:'Work email', icon:Mail, type:'email' }
].map((field) => <div key={field.id} className="space-y-2"><Label htmlFor={field.id}>{field.label}</Label><div className="relative"><field.icon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"/><Input id={field.id} type={field.type} className="pl-10" {...register(field.id as keyof FormValues)}/></div>{errors[field.id as keyof FormValues] && <p className="text-xs text-red-600">This field is required.</p>}</div>)}<div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" placeholder="At least 8 characters" {...register('password')}/>{errors.password && <p className="text-xs text-red-600">Use at least 8 characters.</p>}</div><label className="flex items-start gap-2 text-xs leading-5 text-slate-500"><input type="checkbox" required className="mt-1 size-4 rounded"/>I agree to the Terms, Privacy Policy, and enterprise data processing terms.</label><Button type="submit" size="lg" className="w-full" loading={isSubmitting}>Create account<ArrowRight className="size-4"/></Button></form><p className="mt-7 text-center text-sm text-slate-500">Already have an account? <Link to="/auth/login" className="font-semibold text-brand-600">Sign in</Link></p></div> }
