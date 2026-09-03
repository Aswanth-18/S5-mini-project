/**
 * useData
 *
 * Thin, stable entry point for consuming the app's shared data layer
 * (users, courses, labs, assessments, results, etc). The real
 * implementation lives in DataContext, which wraps the localStorage-backed
 * storageService and exposes CRUD helpers plus loading/error state.
 */
export { useData, useData as default } from '../contexts/DataContext';