// All initial mock data for the app — pure data, no hooks
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
// Gold
// ---------------------------------------------------------------------------
export const INITIAL_GOLD_DATA: GoldHolding[] = [
  { id: 'gold-1', purchase_date: '2025-06-24', qty_chi: 2, amount_vnd: 22_200_000, unit_price: 11_100_000, location: 'Rồng Vàng', created_at: '2025-06-24' },
  { id: 'gold-2', purchase_date: '2025-07-01', qty_chi: 2, amount_vnd: 21_800_000, unit_price: 10_900_000, location: 'Kim Ngọc - Duy Mong', created_at: '2025-07-01' },
  { id: 'gold-3', purchase_date: '2025-07-09', qty_chi: 10, amount_vnd: 108_800_000, unit_price: 10_880_000, location: 'Kim Ngọc - Duy Mong', created_at: '2025-07-09' },
  { id: 'gold-4', purchase_date: '2025-07-26', qty_chi: 1, amount_vnd: 10_920_000, unit_price: 10_920_000, location: 'Kim Ngọc - Duy Mong', created_at: '2025-07-26' },
  { id: 'gold-5', purchase_date: '2025-08-04', qty_chi: 20, amount_vnd: 219_000_000, unit_price: 10_950_000, location: 'Rồng Vàng', created_at: '2025-08-04' },
]

// ---------------------------------------------------------------------------
// Funds
// ---------------------------------------------------------------------------
export const INITIAL_FUND_DATA: FundTransaction[] = [
  { id: 'fund-1', fund_code: 'TCFIN', fund_type: 'Cổ phiếu', transaction_type: 'buy', amount_vnd: 2_000_000, qty_units: 129.23, nav: 15_475, real_amount: 2_000_000, order_date: '2025-08-11', match_date: '2025-08-11', manager: 'Techcombank Securities', distributor: 'Techcombank Securities' },
  { id: 'fund-2', fund_code: 'VCBF-TBF', fund_type: 'Cân bằng', transaction_type: 'buy', amount_vnd: 2_000_000, qty_units: 53.92, nav: 37_088, real_amount: 2_000_000, order_date: '2025-08-12', match_date: '2025-08-12', manager: 'Vietcombank Fund', distributor: 'Fmarket' },
  { id: 'fund-3', fund_code: 'DCDS', fund_type: 'Cổ phiếu', transaction_type: 'buy', amount_vnd: 2_000_000, qty_units: 19.28, nav: 103_689, real_amount: 2_000_000, order_date: '2025-08-11', match_date: '2025-08-11', manager: 'Dragon Capital', distributor: 'Dragon Capital' },
  { id: 'fund-4', fund_code: 'DCDE', fund_type: 'Cổ phiếu', transaction_type: 'buy', amount_vnd: 2_000_000, qty_units: 61.58, nav: 32_477, real_amount: 2_000_000, order_date: '2025-08-11', match_date: '2025-08-11', manager: 'Dragon Capital', distributor: 'Dragon Capital' },
  { id: 'fund-5', fund_code: 'VEOF', fund_type: 'Cổ phiếu', transaction_type: 'buy', amount_vnd: 1_000_000, qty_units: 27.36, nav: 36_544, real_amount: 1_000_000, order_date: '2025-08-19', match_date: '2025-08-19', manager: 'Vinacapital', distributor: 'Fmarket' },
]

// ---------------------------------------------------------------------------
// Savings
// ---------------------------------------------------------------------------
export const INITIAL_SAVINGS_DATA: SavingsDeposit[] = [
  { id: 'sav-1', bank: 'Techcombank', amount: 200_000_000, period_months: 6, interest_rate: 5.45, start_date: '2025-08-04', end_date: '2026-02-04', expected_interest: 5_450_000, status: 'active' },
  { id: 'sav-2', bank: 'Vietinbank', amount: 250_000_000, period_months: 12, interest_rate: 4.7, start_date: '2025-08-13', end_date: '2026-08-13', expected_interest: 11_750_000, status: 'active' },
  { id: 'sav-3', bank: 'Vietinbank', amount: 250_000_000, period_months: 12, interest_rate: 4.7, start_date: '2025-08-13', end_date: '2026-08-13', expected_interest: 11_750_000, status: 'active' },
  { id: 'sav-4', bank: 'Sacombank', amount: 240_000_000, period_months: 12, interest_rate: 5.5, start_date: '2025-08-04', end_date: '2026-08-04', expected_interest: 13_200_000, status: 'active' },
]

// ---------------------------------------------------------------------------
// USD
// ---------------------------------------------------------------------------
export const INITIAL_USD_DATA: UsdTransaction[] = [
  { id: 'usd-1', date: '2025-09-18', amount_usd: 157, exchange_rate_at_receipt: 26_375, amount_vnd_at_receipt: 4_140_875, source: 'Upwork', status: 'holding' },
  { id: 'usd-2', date: '2025-10-09', amount_usd: 513.7, exchange_rate_at_receipt: 26_362, amount_vnd_at_receipt: 13_542_057, source: 'Upwork', status: 'holding' },
  { id: 'usd-3', date: '2025-10-21', amount_usd: 492.74, exchange_rate_at_receipt: 26_343, amount_vnd_at_receipt: 12_980_250, source: 'Upwork', status: 'holding' },
  { id: 'usd-4', date: '2025-11-20', amount_usd: 1_179.57, exchange_rate_at_receipt: 26_309, amount_vnd_at_receipt: 31_033_307, source: 'Upwork', status: 'holding' },
  { id: 'usd-5', date: '2025-12-15', amount_usd: 691.4, exchange_rate_at_receipt: 26_305, amount_vnd_at_receipt: 18_187_277, source: 'Upwork', status: 'holding' },
]

// ---------------------------------------------------------------------------
// Insurance (policies with nested payments)
// ---------------------------------------------------------------------------
export const INITIAL_INSURANCE_DATA: InsurancePolicy[] = [
  {
    id: 'ins-1', product_name: 'Hành trình hạnh phúc', annual_premium: 21_056_000,
    start_date: '2020-09-23', payment_years: 6, total_paid: 126_336_000,
    coverage_amount: 750_000_000, status: 'active',
    policy_number: '2910951457', provider: 'Manulife',
    product_type: 'universal_life', maturity_date: '2090-09-23',
    base_premium: 15_750_000, rider_premium: 5_306_000,
    insured_persons: [
      { name: 'Nguyễn Thị Tuyết Trang', relationship: 'self' },
      { name: 'Nguyễn Thị Hằng', relationship: 'mother' },
    ],
    benefits: [
      { type: 'death', description: 'Tử vong', amount: 750_000_000 },
      { type: 'accident', description: 'Tử vong do tai nạn máy bay', amount: 2_250_000_000, note: '+300% STBH' },
      { type: 'hospital', description: 'Trợ cấp nằm viện', amount: 1_500_000, note: '/ngày' },
      { type: 'hospital', description: 'Nằm viện ICU', amount: 3_000_000, note: '/ngày' },
      { type: 'maturity', description: 'Đáo hạn', note: 'Toàn bộ giá trị tài khoản' },
    ],
    riders: [
      { name: 'Trợ cấp y tế nằm viện', insured: 'Nguyễn Thị Hằng', coverage: 200_000, premium: 1_236_000, note: '/ngày' },
      { name: 'Điều trị nội trú Bạc', insured: 'Nguyễn Thị Hằng', premium: 4_070_000 },
    ],
  },
  {
    id: 'ins-2', product_name: 'Gia đình tôi yêu', annual_premium: 16_000_000,
    start_date: '2019-06-18', payment_years: 7, total_paid: 112_000_000,
    coverage_amount: 150_000_000, status: 'active',
    policy_number: '2910814192', provider: 'Manulife',
    product_type: 'universal_life', maturity_date: '2067-06-18',
    base_premium: 15_125_000, rider_premium: 875_000,
    insured_persons: [
      { name: 'Nguyễn Tăng Mận', relationship: 'father' },
    ],
    benefits: [
      { type: 'death', description: 'Tử vong', amount: 150_000_000 },
      { type: 'accident', description: 'Tử vong tai nạn máy bay', amount: 450_000_000, note: '+300% STBH' },
      { type: 'accident', description: 'Tử vong tai nạn GTCC', amount: 300_000_000, note: '+200% STBH' },
      { type: 'maturity', description: 'Đáo hạn', note: 'Toàn bộ giá trị tài khoản' },
    ],
    riders: [
      { name: 'Tử vong & thương tật do tai nạn', insured: 'Nguyễn Tăng Mận', coverage: 350_000_000, premium: 875_000 },
    ],
  },
  {
    id: 'ins-3', product_name: 'Cuộc sống tươi đẹp', annual_premium: 13_145_000,
    start_date: '2018-09-30', payment_years: 8, total_paid: 105_160_000,
    coverage_amount: 100_000_000, status: 'active',
    policy_number: '2910789279', provider: 'Manulife',
    product_type: 'traditional', maturity_date: '2068-09-30',
    base_premium: 10_373_000, rider_premium: 2_772_000,
    insured_persons: [
      { name: 'Nguyễn Thị Hằng', relationship: 'mother' },
    ],
    benefits: [
      { type: 'death', description: 'Tử vong', amount: 100_000_000 },
      { type: 'critical_illness', description: 'Bệnh hiểm nghèo giai đoạn sớm', amount: 25_000_000, note: 'tối đa 4 lần' },
      { type: 'critical_illness', description: 'Bệnh hiểm nghèo giai đoạn giữa', amount: 50_000_000, note: 'tối đa 2 lần' },
      { type: 'critical_illness', description: 'Bệnh hiểm nghèo giai đoạn cuối', amount: 100_000_000 },
      { type: 'other', description: 'Tiền mặt đặc biệt', amount: 100_000_000 },
      { type: 'maturity', description: 'Hoàn lại khi đáo hạn', amount: 100_000_000, note: '100% STBH' },
    ],
    riders: [
      { name: 'Thương tật toàn bộ & vĩnh viễn', insured: 'Nguyễn Thị Hằng', coverage: 150_000_000, premium: 581_000 },
      { name: 'Trợ cấp y tế nằm viện', insured: 'Nguyễn Thị Hằng', coverage: 300_000, premium: 1_521_000 },
      { name: 'Tử vong & thương tật do tai nạn', insured: 'Nguyễn Thị Hằng', coverage: 150_000_000, premium: 308_000 },
      { name: 'Miễn nộp phí cho Bên Mua BH', insured: 'Nguyễn Thị Tuyết Trang', premium: 362_000 },
    ],
  },
  {
    id: 'ins-4', product_name: 'Cuộc sống tươi đẹp (4Trang)', annual_premium: 14_706_000,
    start_date: '2018-09-30', payment_years: 8, total_paid: 117_648_000,
    coverage_amount: 100_000_000, status: 'active',
    policy_number: '2910789279', provider: 'Manulife',
    product_type: 'traditional', maturity_date: '2068-09-30',
    insured_persons: [
      { name: 'Nguyễn Thị Tuyết Trang', relationship: 'self' },
    ],
    benefits: [
      { type: 'death', description: 'Tử vong', amount: 100_000_000 },
      { type: 'critical_illness', description: 'Bệnh hiểm nghèo (3 giai đoạn)', amount: 100_000_000 },
      { type: 'other', description: 'Tiền mặt đặc biệt', amount: 100_000_000 },
      { type: 'maturity', description: 'Hoàn lại khi đáo hạn', amount: 100_000_000 },
    ],
  },
  {
    id: 'ins-5', product_name: 'Món quà tương lai', annual_premium: 16_180_000,
    start_date: '2022-12-19', payment_years: 3, total_paid: 48_540_000,
    coverage_amount: 1_050_000_000, status: 'active',
    policy_number: '2911101573', provider: 'Manulife',
    product_type: 'unit_linked', maturity_date: '2090-12-19',
    base_premium: 10_000_000, rider_premium: 6_180_000,
    insured_persons: [
      { name: 'Nguyễn Thị Tuyết Trang', relationship: 'self' },
    ],
    benefits: [
      { type: 'death', description: 'Tử vong', amount: 1_050_000_000 },
      { type: 'accident', description: 'Tử vong do tai nạn', amount: 2_100_000_000, note: '+100% STBH' },
      { type: 'disability', description: 'Thương tật toàn bộ do tai nạn', amount: 1_050_000_000 },
      { type: 'disability', description: 'Tổn thương nội tạng', amount: 350_000_000, note: 'tối đa 15% STBH' },
      { type: 'maturity', description: 'Đáo hạn', note: 'Giá trị tài khoản quỹ' },
    ],
    riders: [
      { name: 'Bệnh lý nghiêm trọng mở rộng', insured: 'Nguyễn Thị Tuyết Trang', coverage: 100_000_000, premium: 1_200_000, term_years: 54 },
      { name: 'Điều trị nội trú Titan', insured: 'Nguyễn Thị Tuyết Trang', premium: 4_980_000, term_years: 20 },
    ],
  },
]

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------
export const INITIAL_SUB_DATA: Subscription[] = [
  { id: 'sub-1', name: 'Upwork', category: 'Career', provider: 'Upwork', distributor: 'Upwork', frequency: 'Monthly', amount_usd: 20, amount_per_month: 20, status: 'Ongoing', start_date: '2024-01-01', end_date: '' },
  { id: 'sub-2', name: 'ChatGPT', category: 'AI', provider: 'OpenAI', distributor: 'OpenAI', frequency: 'Monthly', amount_usd: 20, amount_per_month: 20, status: 'Ongoing', start_date: '2024-01-01', end_date: '' },
  { id: 'sub-3', name: 'Gamma', category: 'Design', provider: 'Gamma', distributor: 'Gamma', frequency: 'Monthly', amount_usd: 9, amount_per_month: 9, status: 'Ongoing', start_date: '2024-01-01', end_date: '' },
  { id: 'sub-4', name: 'YouTube Premium', category: 'Entertainment', provider: 'Google', distributor: 'Google', frequency: 'Monthly', amount_usd: 5, amount_per_month: 5, status: 'Ongoing', start_date: '2024-01-01', end_date: '' },
  { id: 'sub-5', name: 'Coursera', category: 'Education', provider: 'Coursera', distributor: 'Coursera', frequency: 'Yearly', amount_usd: 34.2, amount_per_month: 2.85, status: 'Ongoing', start_date: '2024-01-01', end_date: '' },
  { id: 'sub-6', name: 'Udemy', category: 'Education', provider: 'Udemy', distributor: 'Udemy', frequency: 'Yearly', amount_usd: 26.6, amount_per_month: 4.43, status: 'Ongoing', start_date: '2024-01-01', end_date: '' },
  { id: 'sub-7', name: 'Datacamp', category: 'Education', provider: 'Datacamp', distributor: 'Datacamp', frequency: 'Yearly', amount_usd: 26.2, amount_per_month: 2.18, status: 'Ongoing', start_date: '2024-01-01', end_date: '' },
  { id: 'sub-8', name: 'Claude Pro', category: 'AI', provider: 'Anthropic', distributor: 'Anthropic', frequency: 'Monthly', amount_usd: 20, amount_per_month: 20, status: 'Ongoing', start_date: '2024-01-01', end_date: '' },
]

// ---------------------------------------------------------------------------
// Cash snapshots
// ---------------------------------------------------------------------------
export const INITIAL_CASH_DATA: CashSnapshot[] = [
  { id: 'cash-1', bank: 'TCB Business', amount: 25_600_000, snapshot_date: '2026-03-27' },
  { id: 'cash-2', bank: 'Vietinbank', amount: 4_000_000, snapshot_date: '2026-03-27' },
  { id: 'cash-3', bank: 'Techcombank', amount: 2_562_480, snapshot_date: '2026-03-27' },
  { id: 'cash-4', bank: 'TCB Business', amount: 18_200_000, snapshot_date: '2026-02-28' },
  { id: 'cash-5', bank: 'Vietinbank', amount: 4_000_000, snapshot_date: '2026-02-28' },
  { id: 'cash-6', bank: 'Techcombank', amount: 3_100_000, snapshot_date: '2026-02-28' },
  { id: 'cash-7', bank: 'TCB Business', amount: 22_000_000, snapshot_date: '2026-01-31' },
  { id: 'cash-8', bank: 'Vietinbank', amount: 4_000_000, snapshot_date: '2026-01-31' },
  { id: 'cash-9', bank: 'Techcombank', amount: 5_000_000, snapshot_date: '2026-01-31' },
]

// ---------------------------------------------------------------------------
// Loans (supports multiple loans)
// ---------------------------------------------------------------------------
export const INITIAL_LOANS: Loan[] = [
  {
    id: 'loan-1',
    name: 'Vay mua nhà (Nera)',
    original_principal: 1_440_000_000,
    interest_rate: 8.4,
    term_years: 20,
    start_date: '2021-01-01',
    remaining_balance: 1_070_000_000,
    total_principal_paid: 370_000_000,
    total_interest_paid: 327_500_000,
  },
]

// Backward-compat alias — kept for any import references during migration
export const INITIAL_LOAN_DATA = INITIAL_LOANS[0]

export const INITIAL_LOAN_PAYMENTS: LoanPayment[] = [
  { id: 'pay-1', loan_id: 'loan-1', date: '2026-03-01', principal_paid: 3_200_000, interest_paid: 7_490_000, balance_after: 1_070_000_000 },
  { id: 'pay-2', loan_id: 'loan-1', date: '2026-02-01', principal_paid: 3_180_000, interest_paid: 7_510_000, balance_after: 1_073_200_000 },
  { id: 'pay-3', loan_id: 'loan-1', date: '2026-01-01', principal_paid: 3_160_000, interest_paid: 7_530_000, balance_after: 1_076_380_000 },
  { id: 'pay-4', loan_id: 'loan-1', date: '2025-12-01', principal_paid: 3_140_000, interest_paid: 7_550_000, balance_after: 1_079_540_000 },
  { id: 'pay-5', loan_id: 'loan-1', date: '2025-11-01', principal_paid: 3_120_000, interest_paid: 7_570_000, balance_after: 1_082_680_000 },
]
