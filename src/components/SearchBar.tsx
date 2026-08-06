import { Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="relative w-full max-w-xs">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-9 rounded-xl bg-stone-100 pl-9 text-sm placeholder:text-stone-400 dark:bg-stone-800"
        placeholder="Бүтээгдэхүүн хайх..."
        aria-label="Бүтээгдэхүүн хайх"
      />
    </form>
  )
}

