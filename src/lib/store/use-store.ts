"use client"

import { useLocalStorage } from './use-local-storage'
import {
  INITIAL_GOLD_DATA,
  INITIAL_FUND_DATA,
  INITIAL_SAVINGS_DATA,
  INITIAL_USD_DATA,
  INITIAL_INSURANCE_DATA,
  INITIAL_SUB_DATA,
  INITIAL_CASH_DATA,
  INITIAL_LOANS,
  INITIAL_LOAN_PAYMENTS,
} from './initial-data'
import type {
  GoldHolding,
  FundTransaction,
  SavingsDeposit,
  UsdTransaction,
  InsurancePolicy,
  Subscription,
  CashSnapshot,
  Loan,
  LoanPayment,
} from '@/lib/types'

// ---------------------------------------------------------------------------
// Generic CRUD hook for any entity with an id field
// ---------------------------------------------------------------------------
export function useCrudStore<T extends { id: string }>(storageKey: string, initialData: T[]) {
  const [items, setItems] = useLocalStorage<T[]>(storageKey, initialData)

  const add = (item: Omit<T, 'id'>): T => {
    const newItem = { ...item, id: crypto.randomUUID() } as T
    setItems([...items, newItem])
    return newItem
  }

  const update = (id: string, updates: Partial<T>): void => {
    setItems(items.map((item) => (item.id === id ? { ...item, ...updates } : item)))
  }

  const remove = (id: string): void => {
    setItems(items.filter((item) => item.id !== id))
  }

  const bulkAdd = (newItems: Omit<T, 'id'>[]): T[] => {
    const withIds = newItems.map((item) => ({ ...item, id: crypto.randomUUID() }) as T)
    setItems([...items, ...withIds])
    return withIds
  }

  const replaceAll = (newItems: T[]): void => {
    setItems(newItems)
  }

  return { items, add, update, remove, bulkAdd, replaceAll, setItems }
}

// ---------------------------------------------------------------------------
// Typed store hooks
// ---------------------------------------------------------------------------

export function useGoldStore() {
  return useCrudStore<GoldHolding>('moneylens_gold', INITIAL_GOLD_DATA)
}

export function useFundStore() {
  return useCrudStore<FundTransaction>('moneylens_funds', INITIAL_FUND_DATA)
}

export function useSavingsStore() {
  return useCrudStore<SavingsDeposit>('moneylens_savings', INITIAL_SAVINGS_DATA)
}

export function useUsdStore() {
  return useCrudStore<UsdTransaction>('moneylens_usd', INITIAL_USD_DATA)
}

export function useInsuranceStore() {
  return useCrudStore<InsurancePolicy>('moneylens_insurance', INITIAL_INSURANCE_DATA)
}

export function useSubscriptionStore() {
  return useCrudStore<Subscription>('moneylens_subscriptions', INITIAL_SUB_DATA)
}

export function useCashStore() {
  return useCrudStore<CashSnapshot>('moneylens_cash', INITIAL_CASH_DATA)
}

// ---------------------------------------------------------------------------
// Loan store — multi-loan CRUD + payments CRUD
// ---------------------------------------------------------------------------
export function useLoanStore() {
  return useCrudStore<Loan>('moneylens_loans', INITIAL_LOANS)
}

export function useLoanPaymentStore() {
  return useCrudStore<LoanPayment>('moneylens_loan_payments', INITIAL_LOAN_PAYMENTS)
}
