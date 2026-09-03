/**
 * useAuth
 *
 * Thin, stable entry point for consuming authentication state.
 * The real implementation lives in AuthContext; this file exists so the
 * rest of the codebase can do `import { useAuth } from '../hooks/useAuth'`
 * without needing to know where the provider is implemented.
 */
export { useAuth, useAuth as default } from '../contexts/AuthContext';