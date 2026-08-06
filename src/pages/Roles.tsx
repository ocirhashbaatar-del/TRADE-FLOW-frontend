import { ArrowLeft, ArrowRight, Home } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePageTitle } from '@/hooks/use-page-title'

type RoleOption = {
  slug: string
  title: string
  level: string
  description: string
  modules: string[]
  destination: string
}

const roles: RoleOption[] = [
  {
    slug: 'super-admin',
    title: 'Super Admin',
    level: 'Platform',
    description: 'Tenant үүсгэх, багц удирдах, системийн тохиргоо, аюулгүй байдлыг удирдах.',
    modules: ['Tenant үүсгэх', 'Багц, лиценз', 'Системийн тохиргоо', 'Аюулгүй байдал'],
    destination: '/admin/dashboard',
  },
  {
    slug: 'tenant-owner',
    title: 'Tenant эзэн / захирал',
    level: 'Tenant',
    description: 'Бүх модуль, тайлан, хэрэглэгчийн үйл ажиллагааг удирдах.',
    modules: ['Бүх модуль', 'Тайлан', 'Тохиргоо', 'Гүйцэтгэл'],
    destination: '/admin/dashboard',
  },
  {
    slug: 'tenant-manager',
    title: 'Tenant менежер',
    level: 'Tenant',
    description: 'Худалдан авалт, каталог, үнэ, захиалгын урсгалыг удирдах.',
    modules: ['Худалдан авалт', 'Каталог', 'Үнэ', 'Захиалга'],
    destination: '/admin/products',
  },
  {
    slug: 'warehouse-staff',
    title: 'Нярав / агуулахын ажилтан',
    level: 'Tenant',
    description: 'Хүлээн авалт, бэлтгэл, тооллого, шилжүүлэг хийх.',
    modules: ['Хүлээн авалт', 'Бэлтгэл', 'Тооллого', 'Шилжүүлэг'],
    destination: '/admin/orders',
  },
  {
    slug: 'sales-staff',
    title: 'Борлуулалтын ажилтан',
    level: 'Tenant',
    description: 'Харилцагчид, гар захиалга, авлага хөөх ажил явуулах.',
    modules: ['Харилцагчид', 'Гар захиалга', 'Авлага хөөх', 'Хариу арга хэмжээ'],
    destination: '/products',
  },
  {
    slug: 'accountant',
    title: 'Нягтлан',
    level: 'Tenant',
    description: 'Нэхэмжлэл, төлбөр, авлага, тайланг хариуцна.',
    modules: ['Нэхэмжлэл', 'Төлбөр', 'Авлага', 'Тайлан'],
    destination: '/orders',
  },
  {
    slug: 'b2b-customer',
    title: 'B2B харилцагч',
    level: 'Gadaad',
    description: 'Дэлгүүрийн портал: гэрээт үнэ, захиалга, түүх, үлдэгдэл төлбөр.',
    modules: ['Гэрээт үнэ', 'Захиалга', 'Түүх', 'Үлдэгдэл төлбөр'],
    destination: '/products',
  },
  {
    slug: 'b2c-shopper',
    title: 'B2C худалдан авагч',
    level: 'Gadaad',
    description: 'Онлайн дэлгүүр: сагс, захиалга, хянах боломжтой.',
    modules: ['Сагс', 'Захиалга', 'Хянах', 'Төлбөр'],
    destination: '/products',
  },
]

export default function RolesPage() {
  const { slug } = useParams()
  const selectedRole = roles.find((role) => role.slug === slug)
  const isDetail = selectedRole !== undefined

  usePageTitle(isDetail ? `${selectedRole?.title ?? 'Role'} - Interface` : 'Interface сонгох')

  if (slug && !selectedRole) {
    return <Navigate to="/roles" replace />
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <Badge variant="blue" className="border-brand-100 bg-brand-50 text-brand-700 dark:border-brand-900 dark:bg-brand-950/30 dark:text-brand-300">
            Role-driven UI
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
            {isDetail ? selectedRole.title : 'Ажлын интерфэйсээ сонгоно уу'}
          </h1>
          <p className="mt-3 text-base leading-7 text-stone-500">
            {isDetail
              ? 'Энэ интерфэйс нь таны үүрэгт тохирсон үндсэн модуль, алхам, нэвтрэх цэгийг нэг дор харуулна.'
              : 'Дотоод болон гадаад хэрэглэгчийн 8 төрлийн рөл тус бүрт зориулсан UI-ийг сонгоод шууд нэвтрэнэ.'}
          </p>
        </div>

        {isDetail ? (
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/roles">
              <ArrowLeft className="mr-2 size-4" />
              Буцах
            </Link>
          </Button>
        ) : null}
      </div>

      {isDetail ? (
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-soft dark:border-stone-800 dark:bg-stone-950/60">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
              {selectedRole.level}
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-stone-900 dark:text-white">{selectedRole.title}</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-stone-500">{selectedRole.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {selectedRole.modules.map((module) => (
                <span key={module} className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm text-stone-700 dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-200">
                  {module}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={selectedRole.destination}>
                  Интерфэйс рүү орох
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to="/">
                  <Home className="mr-2 size-4" />
                  Нүүр рүү буцах
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-brand-100 bg-brand-50 p-8 dark:border-brand-900/40 dark:bg-brand-950/20">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-brand-300">
              Үндсэн чиглэл
            </div>
            <div className="mt-4 space-y-3">
              {selectedRole.modules.slice(0, 4).map((module) => (
                <div key={module} className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-medium text-stone-700 shadow-sm dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-200">
                  {module}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {roles.map((role) => (
            <div key={role.slug} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg dark:border-stone-800 dark:bg-stone-950/60">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">{role.level}</div>
              <h2 className="mt-3 text-xl font-semibold text-stone-900 dark:text-white">{role.title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-500">{role.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {role.modules.slice(0, 2).map((module) => (
                  <span key={module} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-600 dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-300">
                    {module}
                  </span>
                ))}
              </div>
              <Button asChild className="mt-6 w-full">
                <Link to={`/roles/${role.slug}`}>
                  Интерфэйс нээх
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
