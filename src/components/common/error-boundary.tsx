import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State { return { error } }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('TradeFlow render error:', error, errorInfo.componentStack)
  }

  render() {
    if (this.state.error) {
      return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950"><section className="w-full max-w-2xl rounded-2xl border border-red-200 bg-white p-6 shadow-xl dark:border-red-900 dark:bg-slate-900"><p className="text-sm font-bold uppercase tracking-wide text-red-600">Програмын алдаа</p><h1 className="mt-2 text-2xl font-bold">TradeFlow энэ дэлгэцийг ачаалж чадсангүй.</h1><p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{this.state.error.message}</p><button className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => window.location.reload()}>Дахин ачаалах</button></section></main>
    }
    return this.props.children
  }
}
