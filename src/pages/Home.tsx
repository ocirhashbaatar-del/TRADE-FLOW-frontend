import { useRef, useState } from 'react'
import { ArrowRight, CreditCard, Headphones, PackageCheck, RefreshCcw, Search, ShieldCheck, Sparkles, Star, Store, Truck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePageTitle } from '@/hooks/use-page-title'
import { useAuth } from '@/contexts/auth-context'
import { assetUrl } from '@/utils/assets'

const categories = [
  ['', 'Жимс', '/images/category-fruit.jpg'],
  ['', 'Хүнсний ногоо', '/images/category-vegetables.jpg'],
  ['', 'Сүү, сүүн бүтээгдэхүүн', '/images/category-dairy.jpg'],
  ['', 'Ус, ундаа', '/images/category-drinks.jpg'],
  ['', 'Талх, нарийн боов', '/images/category-bakery.jpg'],
  ['', 'Сав баглаа боодол', '/images/category-packaging.jpg'],
] as const

const reviews = [
  ['Б. Энхжин', 'Urban Market', 'Шинэ бараа олох, үнэ харьцуулах, захиалах бүх үйлдэл нэг дор байдаг нь үнэхээр цаг хэмнэдэг.', '/images/review-1.jpg'],
  ['Д. Тэмүүлэн', 'Northline Foods', 'Нийлүүлэгчид нь баталгаатай, хүргэлтийн мэдээлэл нь ойлгомжтой учраас тогтмол ашигладаг болсон.', '/images/review-2.jpg'],
  ['С. Номин', 'Green Table', 'Жимс, ногооны сонголт сайн. Сагс болон захиалгын процесс маш энгийн санагдсан.', '/images/review-3.jpg'],
] as const

export default function Home() {
  usePageTitle('TradeFlow — Шинэхэн хүнс, ус ундаа')
  const navigate = useNavigate()
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const heroRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroContentY = useTransform(heroProgress, [0, 1], ['0%', '9%'])
  const heroOpacity = useTransform(heroProgress, [0, .82], [1, .25])

  const authenticatedLink = (destination: string) => user
    ? { to: destination }
    : { to: '/auth/login', state: { from: '/' } }

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault()
    navigate(query.trim() ? `/products?q=${encodeURIComponent(query.trim())}` : '/products')
  }

  return (
    <div className="marketplace-home bg-white text-slate-950 dark:bg-[#07110e] dark:text-white">
      <section ref={heroRef} className="relative min-h-[76svh] overflow-hidden rounded-b-[36px] bg-[#06140f] text-white shadow-2xl shadow-emerald-950/15">
        <motion.img initial={{ scale: 1.08, opacity: 0, y: -30 }} animate={{ scale: 1, opacity: .86, y: 0 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} src={assetUrl('/images/supermarket-hero-v2.png')} alt="Ус, ундаа, хөнгөн зууш, хүнс болон шинэхэн бүтээгдэхүүнтэй орчин үеийн супермаркет" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04110c] via-[#04110c]/85 to-[#04110c]/15" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#06140f] to-transparent" />

        <motion.div style={{ y: reduceMotion ? 0 : heroContentY, opacity: reduceMotion ? 1 : heroOpacity }} className="relative mx-auto grid min-h-[76svh] max-w-[1380px] items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: .12, delayChildren: .2 } } }} className="max-w-3xl">
            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-200 backdrop-blur-xl"><Sparkles className="size-4" />Өдөр бүр шинэ, чанартай сонголт</motion.div>
            <motion.h1 variants={{ hidden: { opacity: 0, y: 38 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }} className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-.05em] sm:text-6xl lg:text-7xl">Шинэхэн хүнс, ус ундааг <span className="text-emerald-300">нэг дороос.</span></motion.h1>
            <motion.p variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }} className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">Баталгаатай нийлүүлэгчдээс жимс, ногоо, хүнс болон бүх төрлийн ус ундааг бизнесийн хэрэгцээндээ хурдан захиалаарай.</motion.p>
            <motion.form variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }} onSubmit={submitSearch} className="relative mt-8 flex max-w-2xl items-center gap-2 rounded-full border border-white/15 bg-black/20 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <Search className="pointer-events-none absolute left-6 size-5 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Жимс, ногоо, ус ундаа хайх..." className="h-14 flex-1 rounded-full border-0 bg-white/95 pl-12 text-slate-900 shadow-none" /><Button className="h-14 rounded-full bg-emerald-500 px-8 shadow-none hover:bg-emerald-600">Хайх</Button>
            </motion.form>
            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="mt-5 flex flex-wrap gap-3"><Button asChild size="lg" className="rounded-full bg-emerald-400 px-6 text-emerald-950 hover:bg-emerald-300"><Link {...authenticatedLink('/products')}>Shopping <ArrowRight className="size-4" /></Link></Button>{!user && <Button asChild size="lg" variant="secondary" className="rounded-full border-white/20 bg-white/10 px-6 text-white backdrop-blur hover:bg-white/20"><Link to="/auth/login" state={{ from: '/' }}>Нэвтрэх</Link></Button>}</motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .65, duration: .8 }} className="hidden space-y-4 lg:block">
            <motion.div animate={{ y: [0, -9, 0] }} transition={{ duration: 4, repeat: Infinity }} className="ml-14 rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl"><div className="text-3xl">🥬</div><div className="mt-3 text-lg font-semibold">Fresh every day</div><div className="mt-1 text-sm text-white/55">Фермээс шууд хүргэнэ</div></motion.div>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4.6, repeat: Infinity }} className="mr-10 rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl"><div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-full bg-emerald-400 text-emerald-950"><ShieldCheck className="size-5" /></div><div><div className="font-semibold">Verified suppliers</div><div className="text-sm text-white/55">Чанарын баталгаатай</div></div></div></motion.div>
          </motion.div>
        </motion.div>
      </section>

      <main className="flex flex-col pb-40 pt-24" style={{ gap: '120px' }}>
        <section className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8"><div className="relative min-h-[360px] overflow-hidden rounded-[30px] bg-emerald-950 shadow-2xl shadow-emerald-950/10"><img src={assetUrl('/images/organic-banner.jpg')} alt="Fresh organic collection" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/80 to-transparent" /><div className="relative flex min-h-[360px] max-w-xl flex-col justify-center p-8 text-white sm:p-12"><div className="text-xs font-bold uppercase tracking-[.24em] text-emerald-300">Fresh Organic Collection</div><h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.04em] sm:text-5xl">Healthy living starts with fresh choices.</h2><p className="mt-4 max-w-md leading-7 text-white/65">Шинэхэн жимс, хүнсний ногоог найдвартай фермүүдээс шууд сонгоорой.</p><Button asChild size="lg" className="mt-7 w-fit rounded-full bg-white px-6 text-emerald-950 hover:bg-emerald-100"><Link {...authenticatedLink('/products')}>Shop Now <ArrowRight className="size-4" /></Link></Button></div></div></section>

        <section className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8"><SectionHeading label="Санал болгох" title="Онцлох ангиллууд" /><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{categories.map(([emoji, name, image], index) => <Link key={name} to={`/products?q=${encodeURIComponent(name)}`} className="group relative min-h-44 overflow-hidden rounded-[30px] border-2 border-emerald-950 bg-emerald-950 shadow-[0_10px_28px_rgba(6,78,59,.18)] transition duration-300 hover:-translate-y-1 hover:border-emerald-600 hover:shadow-2xl"><img src={assetUrl(image)} alt="" className="absolute inset-0 size-full object-cover opacity-70 transition duration-700 group-hover:scale-110 group-hover:opacity-85" /><div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent" /><div className="relative flex min-h-44 flex-col justify-end p-5 text-white"><div className="flex items-center justify-between"><div><div className="text-2xl">{emoji}</div><div className="mt-2 text-lg font-semibold">{name}</div></div><div className="grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-emerald-400 group-hover:text-emerald-950"><ArrowRight className="size-4" /></div></div><div className="mt-2 text-xs text-white/55">0{index + 1} · Ангилал үзэх</div></div></Link>)}</div></section>

        <section className="relative overflow-hidden bg-[#031b13] py-24 text-white">
          <div className="pointer-events-none absolute -left-28 top-12 size-80 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 bottom-0 size-96 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[.22em] text-emerald-300"><Sparkles className="size-4" />Бидний давуу тал</div>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Why Shop With Us</h2>
              <p className="mt-4 leading-7 text-white/55">Найдвартай худалдаа, хурдан хүргэлт, тасралтгүй үйлчилгээг нэг дороос.</p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[[ShieldCheck, 'Verified Suppliers', 'Баталгаажсан, найдвартай нийлүүлэгчид.'], [CreditCard, 'Secure Payment', 'Төлбөрийн аюулгүй, хамгаалалттай систем.'], [Truck, 'Fast Delivery', 'Шуурхай, хянах боломжтой хүргэлт.'], [PackageCheck, 'Quality Guaranteed', 'Стандарт хангасан чанартай бүтээгдэхүүн.'], [Headphones, '24/7 Support', 'Танд үргэлж туслах үйлчилгээний баг.'], [RefreshCcw, 'Easy Returns', 'Хялбар буцаалт болон солилтын нөхцөл.']].map(([Icon, title, text], index) => {
                const FeatureIcon = Icon as typeof ShieldCheck
                return <motion.article key={String(title)} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ delay: index * .06 }} className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[.065] p-7 shadow-2xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-emerald-300/35 hover:bg-white/[.1]">
                  <div className="absolute right-5 top-4 text-6xl font-bold text-white/[.035]">0{index + 1}</div>
                  <div className="grid size-14 place-items-center rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-300 to-cyan-400 text-emerald-950 shadow-lg shadow-emerald-950/30 transition duration-300 group-hover:rotate-3 group-hover:scale-110"><FeatureIcon className="size-6" /></div>
                  <h3 className="mt-6 text-xl font-semibold tracking-[-.02em]">{String(title)}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/55">{String(text)}</p>
                  <div className="mt-6 h-px w-full bg-gradient-to-r from-emerald-300/35 to-transparent" />
                </motion.article>
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><SectionHeading label="Харилцагчдын сэтгэгдэл" title="Customer Reviews" /><div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300"><Star className="size-4 fill-current" />4.9 average rating</div></div><div className="mt-8 grid gap-5 md:grid-cols-3">{reviews.map(([name, company, comment, avatar]) => <article key={name} className="group relative overflow-hidden rounded-[30px] border-2 border-emerald-950 bg-emerald-950 p-7 text-white shadow-[0_10px_28px_rgba(6,78,59,.18)] transition duration-300 hover:-translate-y-1 hover:border-emerald-600 hover:shadow-2xl"><div className="absolute -right-2 -top-10 text-[140px] font-serif leading-none text-emerald-400/10">“</div><div className="relative flex gap-1 text-amber-400">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="size-4 fill-current" />)}</div><p className="relative mt-5 min-h-28 leading-7 text-white/75">“{comment}”</p><div className="relative mt-6 flex items-center gap-3 border-t border-white/10 pt-5"><img src={assetUrl(avatar)} alt="" className="size-12 rounded-full object-cover ring-4 ring-emerald-400/15" /><div><div className="text-sm font-semibold">{name}</div><div className="text-xs text-white/50">{company}</div></div><div className="ml-auto grid size-8 place-items-center rounded-full bg-emerald-400/15 text-emerald-400"><ShieldCheck className="size-4" /></div></div></article>)}</div></section>

        <section id="seller" className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-[38px] bg-[#05281d] text-white shadow-[0_35px_90px_-35px_rgba(5,150,105,.55)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(52,211,153,.35),transparent_34%),radial-gradient(circle_at_10%_100%,rgba(34,211,238,.18),transparent_38%)]" />
            <div className="absolute -right-16 -top-20 size-80 rounded-full border-[50px] border-white/[.04]" />
            <Store className="absolute -bottom-16 right-4 size-72 rotate-[-8deg] text-white/[.035] sm:right-16" />
            <div className="relative grid items-center gap-12 p-8 sm:p-12 lg:grid-cols-[1.2fr_.8fr] lg:p-16">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.22em] text-emerald-200"><Store className="size-4" />Become a Seller</div>
                <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-.05em] sm:text-5xl lg:text-6xl">Grow your business with <span className="text-emerald-300">TradeFlow</span></h2>
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">Шинэ харилцагчидтай холбогдож, хүнс болон ундааны бүтээгдэхүүнээ илүү өргөн зах зээлд борлуулаарай.</p>
                <Button asChild size="lg" className="mt-8 h-14 rounded-full bg-emerald-300 px-7 text-emerald-950 shadow-xl shadow-black/20 hover:bg-white"><Link to={user ? '/products' : '/auth/login'}>{user ? 'Shopping' : 'Нэвтрэх'} <ArrowRight className="size-5" /></Link></Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[26px] border border-white/10 bg-white/[.08] p-6 backdrop-blur-xl"><div className="text-3xl font-semibold text-emerald-300">100%</div><div className="mt-2 text-sm font-semibold">Баталгаатай орчин</div><p className="mt-2 text-sm leading-6 text-white/50">Бизнесээ найдвартай, аюулгүй орчинд өргөжүүлээрэй.</p></div>
                <div className="rounded-[26px] border border-white/10 bg-white/[.08] p-6 backdrop-blur-xl"><div className="text-3xl font-semibold text-cyan-300">24/7</div><div className="mt-2 text-sm font-semibold">Тогтмол дэмжлэг</div><p className="mt-2 text-sm leading-6 text-white/50">Манай баг таны борлуулалтын алхам бүрд тусална.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6"><div className="text-xs font-bold uppercase tracking-[.22em] text-emerald-600">Newsletter</div><h2 className="mt-3 text-4xl font-semibold tracking-[-.04em]">Шинэ мэдээллийг түрүүлж аваарай</h2><p className="mt-4 text-slate-500">Шинэ бараа, онцгой хямдрал болон хэрэгтэй зөвлөгөөг таны имэйлд хүргэнэ.</p><form onSubmit={(event) => event.preventDefault()} className="mx-auto mt-7 flex max-w-xl items-center gap-3 rounded-[20px] border border-slate-300 bg-white p-2 dark:border-white/10 dark:bg-[#07110e]"><Input required type="email" placeholder="Email address" className="h-12 border-0 bg-transparent shadow-none" /><Button className="h-12 rounded-xl bg-emerald-500 px-6 hover:bg-emerald-600">Subscribe</Button></form></section>
      </main>
    </div>
  )
}

function SectionHeading({ label, title }: { label: string; title: string }) {
  return <div><div className="text-xs font-bold uppercase tracking-[.22em] text-emerald-600">{label}</div><h2 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{title}</h2></div>
}
