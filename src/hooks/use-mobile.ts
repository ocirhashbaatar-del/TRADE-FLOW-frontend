import { useEffect, useState } from 'react'
export function useMobile(breakpoint = 1024) { const [mobile, setMobile] = useState(() => window.innerWidth < breakpoint); useEffect(() => { const handler = () => setMobile(window.innerWidth < breakpoint); window.addEventListener('resize', handler); return () => window.removeEventListener('resize', handler) }, [breakpoint]); return mobile }
