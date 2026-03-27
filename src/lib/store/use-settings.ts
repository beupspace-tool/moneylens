"use client"

import { useLocalStorage } from './use-local-storage'
import { DEFAULT_SETTINGS } from '@/lib/constants'
import type { AppSettings } from '@/lib/types'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('moneylens_settings', DEFAULT_SETTINGS)

  const updateGoldPrice = (price: number) => {
    setSettings({ ...settings, gold_price_per_chi: price, last_updated: today() })
  }

  const updateExchangeRate = (rate: number) => {
    setSettings({ ...settings, usd_vnd_rate: rate, last_updated: today() })
  }

  const updateFundNav = (code: string, nav: number) => {
    setSettings({
      ...settings,
      fund_navs: { ...settings.fund_navs, [code]: nav },
      last_updated: today(),
    })
  }

  const updateAllFundNavs = (navs: Record<string, number>) => {
    setSettings({ ...settings, fund_navs: navs, last_updated: today() })
  }

  return { settings, setSettings, updateGoldPrice, updateExchangeRate, updateFundNav, updateAllFundNavs }
}
