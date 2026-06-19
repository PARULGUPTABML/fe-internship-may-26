import { useEffect, useRef, useState } from 'react'
import type { Item } from '../types'
import { searchItems } from '../services/mockApi'

export interface UseSearchReturn {
  query: string
  setQuery: (q: string) => void
  results: Item[]
  isLoading: boolean
  error: string | null
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Tracks the latest request to prevent stale responses
  const requestIdRef = useRef(0)

  useEffect(() => {
    const currentRequestId = ++requestIdRef.current

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data = await searchItems(query.trim())

        // Only update state if this is the latest request
        if (currentRequestId === requestIdRef.current) {
          setResults(data)
        }
      } catch (err) {
        if (currentRequestId === requestIdRef.current) {
          setError('Failed to fetch search results')
          setResults([])
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false)
        }
      }
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [query])

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
  }
}