// Storage helpers for the import pipeline: backup, replace, append
import type { InsuranceRecord } from './excel-parser'
import type { InsurancePolicy } from '@/lib/types'

export type DataKey = 'gold' | 'funds' | 'savings' | 'usd' | 'insurance' | 'subscriptions' | 'cash' | 'loan_payments'

export const ALL_IMPORT_KEYS: readonly DataKey[] = [
  'gold', 'funds', 'savings', 'usd', 'insurance', 'subscriptions', 'cash', 'loan_payments',
] as const

export const STORAGE_KEY_MAP: Record<DataKey, string> = {
  gold: 'moneylens_gold',
  funds: 'moneylens_funds',
  savings: 'moneylens_savings',
  usd: 'moneylens_usd',
  insurance: 'moneylens_insurance',
  subscriptions: 'moneylens_subscriptions',
  cash: 'moneylens_cash',
  loan_payments: 'moneylens_loan_payments',
}

// Aggregate flat InsuranceRecord[] (payments) into InsurancePolicy[] by product name
export function aggregateInsurancePolicies(records: InsuranceRecord[]): InsurancePolicy[] {
  const byProduct: Record<string, { total: number; dates: string[] }> = {}
  for (const r of records) {
    if (!byProduct[r.product_name]) byProduct[r.product_name] = { total: 0, dates: [] }
    byProduct[r.product_name].total += r.amount
    if (r.payment_date) byProduct[r.product_name].dates.push(r.payment_date)
  }
  return Object.entries(byProduct).map(([name, data], i) => {
    const sorted = [...data.dates].sort()
    const paymentYears = Math.round(data.dates.length)
    return {
      id: `imported-ins-${i}`,
      product_name: name,
      annual_premium: paymentYears > 0 ? Math.round(data.total / paymentYears) : data.total,
      start_date: sorted[0] ?? '',
      payment_years: paymentYears,
      total_paid: data.total,
    }
  })
}

// Auto-backup all moneylens_ keys before any import
export function backupBeforeImport() {
  const backup: Record<string, unknown> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('moneylens_')) {
      backup[key] = JSON.parse(localStorage.getItem(key) || 'null')
    }
  }
  localStorage.setItem('moneylens_backup_before_import', JSON.stringify({
    timestamp: new Date().toISOString(),
    data: backup,
  }))
}

// Replace mode: overwrite key entirely
export function writeToLocalStorage(key: string, data: unknown[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

// Append mode: merge with existing, assigning IDs to items that lack one
export function appendToLocalStorage(key: string, newData: unknown[]) {
  const existing = JSON.parse(localStorage.getItem(key) || '[]')
  const withIds = newData.map((item, i) => ({
    ...item as object,
    id: (item as { id?: string }).id || `imported-${Date.now()}-${i}`,
  }))
  localStorage.setItem(key, JSON.stringify([...existing, ...withIds]))
}
