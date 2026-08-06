import { ArrowRight, ShieldCheck, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePageTitle } from '@/hooks/use-page-title'

export default function AuthChoicePage() {
  usePageTitle('Нэвтрэх эсвэл бүртгүүлэх')

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
            Батлагдсан B2B зах зээл
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-[-.035em] text-stone-900 dark:text-white sm:text-4xl">
            Нэвтэрч, бүтээгдэхүүнээ шууд сонгоод захиалаарай
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-stone-500">
            Хялбар нэвтрэлт, шуурхай худалдан авалт, баталгаат нийлүүлэгчидтэй туршлага.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/auth/login">
                Нэвтрэх <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <Card className="p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <div className="font-semibold text-stone-900 dark:text-white">Super admin demo</div>
              <div className="text-sm text-stone-500">Туршилтын хандалт</div>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900/40">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Имэйл</span>
              <span className="font-medium text-stone-900 dark:text-white">ocirhashbaatar@gmail.com</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Нууц үг</span>
              <span className="font-medium text-stone-900 dark:text-white">88016745</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-700 dark:border-brand-900/40 dark:bg-brand-950/20 dark:text-brand-300">
            <UserPlus className="size-4" />
            Шинэ хэрэглэгч бол бүртгэлээ үүсгээд шууд үргэлжлүүлнэ.
          </div>
        </Card>
      </div>
    </div>
  )
}
