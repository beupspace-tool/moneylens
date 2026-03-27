import {
  LayoutDashboard,
  Coins,
  TrendingUp,
  PiggyBank,
  DollarSign,
  Shield,
  Repeat,
  Wallet,
  CreditCard,
  Upload,
  BookOpen,
  Settings,
} from 'lucide-react'
import type { AppSettings } from '@/lib/types'

export const NAV_ITEMS = [
  {
    href: '/',
    label: 'Tổng quan',
    icon: LayoutDashboard,
  },
  {
    href: '/gold',
    label: 'Vàng',
    icon: Coins,
  },
  {
    href: '/funds',
    label: 'Chứng chỉ quỹ',
    icon: TrendingUp,
  },
  {
    href: '/savings',
    label: 'Tiết kiệm',
    icon: PiggyBank,
  },
  {
    href: '/usd',
    label: 'USD',
    icon: DollarSign,
  },
  {
    href: '/insurance',
    label: 'Bảo hiểm',
    icon: Shield,
  },
  {
    href: '/subscriptions',
    label: 'Subscriptions',
    icon: Repeat,
  },
  {
    href: '/cash',
    label: 'Tiền mặt',
    icon: Wallet,
  },
  {
    href: '/loan',
    label: 'Khoản vay',
    icon: CreditCard,
  },
] as const

export const NAV_BOTTOM_ITEMS = [
  {
    href: '/import',
    label: 'Import',
    icon: Upload,
  },
  {
    href: '/guide',
    label: 'Hướng dẫn',
    icon: BookOpen,
  },
  {
    href: '/settings',
    label: 'Cài đặt',
    icon: Settings,
  },
] as const

// Default settings for market prices and NAVs
export const DEFAULT_SETTINGS: AppSettings = {
  gold_price_per_chi: 15_600_000,
  usd_vnd_rate: 26_312,
  fund_navs: {
    DCDS: 107_000,
    'VCBF-TBF': 38_000,
    'VCBF-BCF': 43_000,
    TCFIN: 15_800,
    VEOF: 36_000,
    DCDE: 33_000,
    DCBF: 28_500,
    'VCBF-FIF': 15_000,
  },
  last_updated: new Date().toISOString().slice(0, 10),
}

// Chart colors for each asset type — BEUP brand palette
export const ASSET_COLORS: Record<string, string> = {
  gold: '#D4A843',       // BEUP Gold
  funds: '#008080',      // BEUP Teal
  savings: '#1B2A4A',    // BEUP Navy
  cash: '#5BA4A4',       // BEUP Teal Light
  usd: '#22C55E',        // Profit Green
  insurance: '#EBF0F7',  // Card Blue (with navy text)
  loan: '#EF4444',       // Loss Red (liability)
  subscription: '#D4A843', // BEUP Gold (secondary)
}

// Fund codes and their full names
export const FUND_CODES: Record<string, string> = {
  DCDS: 'Dragon Capital - Cổ phiếu tăng trưởng',
  'VCBF-TBF': 'Vietcombank Fund - Trái phiếu',
  'VCBF-BCF': 'Vietcombank Fund - Cân bằng',
  TCFIN: 'Techcombank Securities - Tài chính',
  VEOF: 'Vinacapital - Cổ phiếu',
  DCDE: 'Dragon Capital - Cổ tức',
  DCBF: 'Dragon Capital - Trái phiếu',
  'VCBF-FIF': 'Vietcombank Fund - Thu nhập cố định',
}

// Fund managers
export const FUND_MANAGERS = [
  'Dragon Capital',
  'Vietcombank Fund',
  'Techcombank Securities',
  'Vinacapital',
] as const

// Fund distributors
export const FUND_DISTRIBUTORS = [
  'Fmarket',
  'Dragon Capital',
  'Techcombank Securities',
] as const

// Vietnamese bank names
export const BANK_NAMES = [
  'Vietcombank',
  'Techcombank',
  'BIDV',
  'Agribank',
  'VPBank',
  'MB Bank',
  'ACB',
  'SHB',
  'HDBank',
  'TPBank',
  'OCB',
  'VIB',
  'Sacombank',
  'MSB',
  'SeABank',
] as const

// Subscription categories
export const SUBSCRIPTION_CATEGORIES = [
  'AI',
  'Career',
  'Education',
  'Design',
  'Entertainment',
  'Office',
  'Utility',
] as const

// Gold purchase locations
export const GOLD_LOCATIONS = [
  'Rồng Vàng',
  'Kim Ngọc - Duy Mong',
  'Bảo Tín Minh Châu',
  'DOJI',
  'PNJ',
  'SJC',
  'Phú Quý',
] as const

// USD income sources
export const USD_SOURCES = ['Upwork', 'Freelance', 'Chuyển khoản', 'Khác'] as const

// USD transaction statuses
export const USD_STATUSES = [
  { value: 'holding', label: 'Đang giữ' },
  { value: 'converted', label: 'Đã đổi sang VND' },
] as const

// Insurance policy statuses
export const INSURANCE_STATUSES = [
  { value: 'active', label: 'Đang đóng' },
  { value: 'paid_up', label: 'Đã đóng đủ' },
  { value: 'cancelled', label: 'Đã hủy' },
] as const

// Insurance product names (from user's actual policies)
export const INSURANCE_PRODUCTS = [
  'Hành trình hạnh phúc',
  'Gia đình tôi yêu',
  'Cuộc sống tươi đẹp',
  'Cuộc sống tươi đẹp -4Trang',
  'Món quà tương lai',
] as const

// Common subscription providers
export const SUBSCRIPTION_PROVIDERS = [
  'OpenAI',
  'Google',
  'Microsoft',
  'Upwork',
  'Gamma',
  'Coursera',
  'Udemy',
  'Datacamp',
  'Gitiho',
  'TrueCaller',
  'LinkedIn',
] as const

// Vietinbank account labels (for cash)
export const CASH_ACCOUNTS = [
  'TCB Business',
  'Vietinbank',
  'Techcombank',
  'VPBank',
  'MB Bank',
  'Sacombank',
] as const
