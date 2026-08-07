import { useEffect } from 'react'
export function usePageTitle(title: string, description = 'TradeFlow худалдаа, захиалга, хүргэлтийн нэгдсэн систем') {
  useEffect(() => {
    document.title = `${title} · TradeFlow`
    const setMeta = (selector: string, key: string, keyValue: string, content: string) => { let node = document.head.querySelector<HTMLMetaElement>(selector); if (!node) { node = document.createElement('meta'); node.setAttribute(key, keyValue); document.head.appendChild(node) } node.content = content }
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', document.title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', window.location.href)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]'); if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) } canonical.href = window.location.href.split('?')[0]
  }, [title, description])
}
