"use client"

import { INITIAL_INSURANCE_DATA } from './initial-data'
import type { InsurancePolicy } from '@/lib/types'

const STORAGE_KEY = 'moneylens_insurance'
const MIGRATION_KEY = 'moneylens_insurance_v2'

/**
 * Auto-migrate old insurance data by merging enriched fields from seed data.
 * Matches by product_name. Only runs once (tracked by MIGRATION_KEY).
 * Safe to call on every page load — no-op if already migrated or no old data.
 */
export function migrateInsuranceData(): void {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(MIGRATION_KEY)) return

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(MIGRATION_KEY, 'done')
    return
  }

  try {
    const existing: InsurancePolicy[] = JSON.parse(raw)
    const needsMigration = existing.some(p => !p.insured_persons?.length && !p.benefits?.length)

    if (!needsMigration) {
      localStorage.setItem(MIGRATION_KEY, 'done')
      return
    }

    const seedMap = new Map(INITIAL_INSURANCE_DATA.map(p => [normalizeKey(p.product_name), p]))

    const migrated = existing.map(old => {
      const seed = seedMap.get(normalizeKey(old.product_name))
      if (!seed || old.insured_persons?.length) return old

      return {
        ...old,
        policy_number: old.policy_number ?? seed.policy_number,
        provider: old.provider ?? seed.provider,
        product_type: old.product_type ?? seed.product_type,
        maturity_date: old.maturity_date ?? seed.maturity_date,
        start_date: seed.start_date,
        base_premium: old.base_premium ?? seed.base_premium,
        rider_premium: old.rider_premium ?? seed.rider_premium,
        coverage_amount: old.coverage_amount ?? seed.coverage_amount,
        insured_persons: seed.insured_persons,
        benefits: seed.benefits,
        riders: seed.riders,
      }
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
    localStorage.setItem(MIGRATION_KEY, 'done')
  } catch {
    localStorage.setItem(MIGRATION_KEY, 'done')
  }
}

function normalizeKey(name: string): string {
  return name.toLowerCase().replace(/[^a-zàáạảãăắằặẳẵâấầậẩẫđèéẹẻẽêếềệểễìíịỉĩòóọỏõôốồộổỗơớờợởỡùúụủũưứừựửữỳýỵỷỹ0-9]/g, '')
}

/** Hard-reset insurance to seed data (used by Settings page) */
export function resetInsuranceToSeed(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INSURANCE_DATA))
  localStorage.removeItem(MIGRATION_KEY)
}
