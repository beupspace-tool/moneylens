"use client"

import { useState, useEffect, useCallback } from 'react'

// Reads from localStorage safely (SSR guard)
function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw !== null ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Silently fail (quota exceeded, private browsing, etc.)
  }
}

// Generic localStorage hook that syncs state with localStorage
// Returns [value, setValue, removeValue]
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    readFromStorage<T>(key, initialValue)
  )

  // Re-read on mount to handle SSR hydration
  useEffect(() => {
    const val = readFromStorage<T>(key, initialValue)
    setStoredValue(val)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value
        writeToStorage(key, next)
        return next
      })
    },
    [key]
  )

  const removeValue = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key)
    }
    setStoredValue(initialValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return [storedValue, setValue, removeValue]
}
