import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// Vietnamese Dong formatter
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

// USD formatter
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Date formatter — Vietnamese locale (e.g. "27 tháng 3, 2026")
export function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'dd/MM/yyyy')
  } catch {
    return dateStr
  }
}

// Long date with Vietnamese locale
export function formatDateLong(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'd MMMM, yyyy', { locale: vi })
  } catch {
    return dateStr
  }
}

// Percentage formatter (e.g. 12.5 → "12.5%")
export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`
}

// Short number formatter (e.g. 1_200_000_000 → "1.2 tỷ", 500_000_000 → "500 triệu")
export function formatShortVND(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} tỷ`
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(0)} triệu`
  }
  if (Math.abs(amount) >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K`
  }
  return amount.toString()
}

// Generic short number (1.2B, 500M, etc.) for international display
export function formatShort(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}B`
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`
  }
  if (Math.abs(amount) >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`
  }
  return amount.toString()
}

// Number with thousand separators (no currency)
export function formatNumber(amount: number, decimals = 0): string {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}
