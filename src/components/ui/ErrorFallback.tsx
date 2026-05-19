import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onReset?: () => void
  page?: string
}

interface State {
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, errorInfo: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ error: null, errorInfo: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-8" role="alert">
          <div className="bg-surface-light border border-border rounded-2xl p-8 max-w-md w-full text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto">
              <AlertTriangle size={32} className="text-danger" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-text-primary">
                {this.props.page
                  ? `Error en ${this.props.page}`
                  : 'Algo salió mal'}
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Se produjo un error inesperado al cargar esta sección.
                {import.meta.env.DEV && this.state.error.message && (
                  <span className="block mt-2 font-mono text-xs bg-surface-lighter p-2 rounded-lg text-danger">
                    {this.state.error.message}
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-brand-500/20"
              >
                <RefreshCw size={15} />
                Reintentar
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-border hover:bg-surface-lighter text-text-secondary text-sm font-medium rounded-xl transition-colors"
              >
                <Home size={15} />
                Ir al inicio
              </button>
            </div>

            <p className="text-xs text-text-muted">
              Si el problema persiste, prueba a recargar la página o exportar tus datos desde Ajustes.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function withErrorBoundary(Component: React.ComponentType, pageName?: string) {
  return function Wrapped(props: Record<string, unknown>) {
    return (
      <ErrorBoundary page={pageName}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}
