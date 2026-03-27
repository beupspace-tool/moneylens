export type AssetType =
  | 'gold'
  | 'fund'
  | 'savings'
  | 'usd'
  | 'insurance'
  | 'subscription'
  | 'cash'
  | 'loan'

export interface GoldHolding {
  id: string
  purchase_date: string
  qty_chi: number
  amount_vnd: number
  unit_price: number
  location: string
  current_value?: number
  created_at: string
}

export interface FundTransaction {
  id: string
  fund_code: string // DCDS, VCBF-TBF, VCBF-BCF, TCFIN, VEOF, DCDE, DCBF, VCBF-FIF
  fund_type: 'Cổ phiếu' | 'Cân bằng' | 'Trái phiếu'
  transaction_type?: 'buy' | 'sell' // optional for backward compat — default 'buy'
  amount_vnd: number
  qty_units: number
  nav: number
  real_amount: number
  order_date: string
  match_date: string
  manager: string // Dragon Capital, Vietcombank Fund, Techcombank Securities, Vinacapital
  distributor: string // Fmarket, Dragon Capital, Techcombank Securities
  note?: string
}

export interface SavingsDeposit {
  id: string
  bank: string
  amount: number
  period_months: number
  interest_rate: number
  start_date: string
  end_date: string
  expected_interest: number
  status: 'active' | 'matured'
}

export interface UsdTransaction {
  id: string
  date: string
  amount_usd: number
  exchange_rate_at_receipt: number
  amount_vnd_at_receipt: number
  current_rate?: number
  gain_loss?: number
  source?: string     // 'Upwork' | 'Freelance' | 'Chuyển khoản' | 'Khác'
  status?: string     // 'holding' | 'converted'
}

export interface InsurancePolicy {
  id: string
  product_name: string
  annual_premium: number
  start_date: string
  payment_years: number
  total_paid: number
  coverage_amount?: number
  status?: string     // 'active' | 'paid_up' | 'cancelled'
}

export interface InsurancePayment {
  id: string
  policy_id: string
  payment_date: string
  amount: number
}

export interface Subscription {
  id: string
  name: string
  category: string // AI, Career, Education, Design, Entertainment, Office, Utility
  provider: string
  distributor: string
  frequency: 'Monthly' | 'Yearly'
  amount_usd: number
  amount_per_month: number
  status: 'Ongoing' | 'Cancelled' | 'Expired'
  start_date: string
  end_date: string
  remarks?: string
}

export interface CashSnapshot {
  id: string
  bank: string
  amount: number
  snapshot_date: string
}

export interface Loan {
  id: string
  name: string
  original_principal: number  // renamed from 'principal' for clarity
  interest_rate: number
  term_years: number
  start_date: string
  remaining_balance: number
  total_principal_paid: number
  total_interest_paid: number
}

export interface LoanPayment {
  id: string
  loan_id: string
  date: string
  principal_paid: number
  interest_paid: number
  balance_after: number
}

export interface MarketPrice {
  id: string
  type: 'gold' | 'fund_nav' | 'exchange_rate'
  code: string
  price: number
  currency: string
  fetched_at: string
}

export interface PortfolioSummary {
  gold: number
  funds: number
  savings: number
  cash: number
  usd: number
  insurance: number
  total: number
  total_usd: number
  exchange_rate: number
}

export interface Alert {
  id: string
  type: 'maturity' | 'insurance_due' | 'subscription_renewal' | 'dca_schedule'
  entity_id: string
  trigger_date: string
  message: string
  is_read: boolean
}

export interface AppSettings {
  gold_price_per_chi: number
  usd_vnd_rate: number
  fund_navs: Record<string, number>
  last_updated: string
}
