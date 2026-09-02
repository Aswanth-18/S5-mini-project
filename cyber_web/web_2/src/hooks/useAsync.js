import { useEffect, useState } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingState } from '@/components/ui/LoadingState'

export function useAsync(loader, deps = []) {
  const [state, setState] = useState({ loading: true, data: null, error: null })

  useEffect(() => {
    let active = true
    setState((current) => ({ ...current, loading: true, error: null }))
    Promise.resolve()
      .then(loader)
      .then((data) => {
        if (active) setState({ loading: false, data, error: null })
      })
      .catch((error) => {
        if (active) setState({ loading: false, data: null, error })
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return {
    ...state,
    reload: () =>
      Promise.resolve()
        .then(loader)
        .then((data) => setState({ loading: false, data, error: null })),
  }
}

export function AsyncGate({ loading, error, empty, onRetry, children, label }) {
  if (loading) return <LoadingState label={label ?? 'Loading'} />
  if (error) {
    return (
      <EmptyState
        title="Could not load this view"
        description={error.message ?? 'The mock service failed. Retry, then continue.'}
        action={
          onRetry ? (
            <button type="button" className="type-small text-accent" onClick={onRetry}>
              Retry
            </button>
          ) : null
        }
      />
    )
  }
  if (empty) return empty
  return children
}
