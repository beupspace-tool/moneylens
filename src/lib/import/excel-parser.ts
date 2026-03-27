import * as XLSX from 'xlsx'
import type {
  GoldHolding,
  FundTransaction,
  SavingsDeposit,
  UsdTransaction,
  Subscription,
  CashSnapshot,
  LoanPayment,
} from '@/lib/types'

export interface InsuranceRecord {
  product_name: string
  payment_date: string
  amount: number
}

// Parsed loan data: a synthetic Loan record + raw payment schedule
export interface ParsedLoanData {
  loan_id: string
  loan_name: string
  payments: LoanPayment[]
}

export interface ParsedData {
  gold: GoldHolding[]
  funds: FundTransaction[]
  savings: SavingsDeposit[]
  usd: UsdTransaction[]
  insurance: InsuranceRecord[]
  subscriptions: Subscription[]
  cash: CashSnapshot[]
  loan_payments: LoanPayment[]
}

// Convert Excel serial date number to ISO date string
function excelDateToISO(serial: unknown): string {
  if (!serial) return ''
  if (typeof serial === 'string') {
    // Already a string date — try to parse
    const d = new Date(serial)
    return isNaN(d.getTime()) ? serial : d.toISOString().slice(0, 10)
  }
  if (typeof serial === 'number') {
    // Excel epoch: Dec 30 1899
    const utc = new Date(Date.UTC(1899, 11, 30) + serial * 86400000)
    return utc.toISOString().slice(0, 10)
  }
  return ''
}

function toNum(val: unknown): number {
  if (typeof val === 'number') return val
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^0-9.\-]/g, '')
    const n = parseFloat(cleaned)
    return isNaN(n) ? 0 : n
  }
  return 0
}

function toStr(val: unknown): string {
  if (val == null) return ''
  return String(val).trim()
}

function getSheet(workbook: XLSX.WorkBook, name: string): XLSX.WorkSheet | null {
  const sheet = workbook.Sheets[name]
  return sheet ?? null
}

// GOLD sheet: Name, Date, Qty, Amount, Unit price, Location
function parseGoldSheet(workbook: XLSX.WorkBook): GoldHolding[] {
  const sheet = getSheet(workbook, 'GOLD')
  if (!sheet) return []
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  return rows
    .filter((r) => r['Date'] && r['Amount'])
    .map((r) => ({
      id: crypto.randomUUID(),
      name: toStr(r['Name']),
      purchase_date: excelDateToISO(r['Date']),
      qty_chi: toNum(r['Qty']),
      amount_vnd: toNum(r['Amount']),
      unit_price: toNum(r['Unit price']),
      location: toStr(r['Location']),
      created_at: new Date().toISOString(),
    }))
}

// CCQ sheet: Name, Loại quỹ, Amount, Số lượng CCQ, NAV, Real AMT, Khớp lệnh, Đặt lệnh, Quản lí bởi, Phân phối bởi
function parseFundsSheet(workbook: XLSX.WorkBook): FundTransaction[] {
  const sheet = getSheet(workbook, 'CCQ')
  if (!sheet) return []
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  return rows
    .filter((r) => r['Name'] && r['Amount'])
    .map((r) => ({
      id: crypto.randomUUID(),
      fund_code: toStr(r['Name']),
      fund_type: (toStr(r['Loại quỹ']) || 'Cổ phiếu') as FundTransaction['fund_type'],
      amount_vnd: toNum(r['Amount']),
      qty_units: toNum(r['Số lượng CCQ']),
      nav: toNum(r['NAV']),
      real_amount: toNum(r['Real AMT']),
      order_date: excelDateToISO(r['Đặt lệnh']),
      match_date: excelDateToISO(r['Khớp lệnh']),
      manager: toStr(r['Quản lí bởi']),
      distributor: toStr(r['Phân phối bởi']),
    }))
}

// TIẾT KIỆM sheet: Name, Amount, Period, IR/year, From, To, Lãi dự kiến
function parseSavingsSheet(workbook: XLSX.WorkBook): SavingsDeposit[] {
  const sheet = getSheet(workbook, 'TIẾT KIỆM')
  if (!sheet) return []
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  const now = new Date().toISOString().slice(0, 10)
  return rows
    .filter((r) => r['Name'] && r['Amount'])
    .map((r) => {
      const endDate = excelDateToISO(r['To'])
      const status: SavingsDeposit['status'] =
        endDate && endDate < now ? 'matured' : 'active'
      return {
        id: crypto.randomUUID(),
        bank: toStr(r['Name']),
        amount: toNum(r['Amount']),
        period_months: toNum(r['Period']),
        interest_rate: toNum(r['IR/year']),
        start_date: excelDateToISO(r['From']),
        end_date: endDate,
        expected_interest: toNum(r['Lãi dự kiến']),
        status,
      }
    })
}

// USD sheet: DATE, AMOUNT (USD), Exchange Rate, AMOUNT (VND at Receipt Date)
function parseUsdSheet(workbook: XLSX.WorkBook): UsdTransaction[] {
  const sheet = getSheet(workbook, 'USD')
  if (!sheet) return []
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  return rows
    .filter((r) => r['DATE'] && r['AMOUNT (USD)'])
    .map((r) => ({
      id: crypto.randomUUID(),
      date: excelDateToISO(r['DATE']),
      amount_usd: toNum(r['AMOUNT (USD)']),
      exchange_rate_at_receipt: toNum(r['Exchange Rate']),
      amount_vnd_at_receipt: toNum(r['AMOUNT (VND at Receipt Date)']),
    }))
}

// BẢO HIỂM NHÂN THỌ sheet: SẢN PHẨM, Ngày đóng, Giá trị đóng
function parseInsuranceSheet(workbook: XLSX.WorkBook): InsuranceRecord[] {
  const sheet = getSheet(workbook, 'BẢO HIỂM NHÂN THỌ')
  if (!sheet) return []
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  return rows
    .filter((r) => r['SẢN PHẨM'] && r['Giá trị đóng'])
    .map((r) => ({
      product_name: toStr(r['SẢN PHẨM']),
      payment_date: excelDateToISO(r['Ngày đóng']),
      amount: toNum(r['Giá trị đóng']),
    }))
}

// Digital Subscription sheet: SUBSCRIPTION, CATEGORY, Provider, FREQUENCY, AMOUNT, Status, START, END
function parseSubscriptionsSheet(workbook: XLSX.WorkBook): Subscription[] {
  const sheet = getSheet(workbook, 'Digital Subscription')
  if (!sheet) return []
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  return rows
    .filter((r) => r['SUBSCRIPTION'] && r['AMOUNT'])
    .map((r) => {
      const freq = toStr(r['FREQUENCY']) as Subscription['frequency']
      const amtUsd = toNum(r['AMOUNT'])
      const perMonth = freq === 'Yearly' ? amtUsd / 12 : amtUsd
      return {
        id: crypto.randomUUID(),
        name: toStr(r['SUBSCRIPTION']),
        category: toStr(r['CATEGORY']),
        provider: toStr(r['Provider']),
        distributor: '',
        frequency: freq || 'Monthly',
        amount_usd: amtUsd,
        amount_per_month: perMonth,
        status: (toStr(r['Status']) || 'Ongoing') as Subscription['status'],
        start_date: excelDateToISO(r['START']),
        end_date: excelDateToISO(r['END']),
      }
    })
}

// CASH sheet: has date columns with bank names as rows
function parseCashSheet(workbook: XLSX.WorkBook): CashSnapshot[] {
  const sheet = getSheet(workbook, 'CASH')
  if (!sheet) return []
  // sheet_to_json with header:1 gives raw rows as arrays
  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null })
  if (rawRows.length < 2) return []

  const headerRow = rawRows[0] as unknown[]
  const snapshots: CashSnapshot[] = []

  // Header: first col is bank name, rest are date columns
  for (let rowIdx = 1; rowIdx < rawRows.length; rowIdx++) {
    const row = rawRows[rowIdx] as unknown[]
    const bankName = toStr(row[0])
    if (!bankName) continue

    for (let colIdx = 1; colIdx < headerRow.length; colIdx++) {
      const dateVal = headerRow[colIdx]
      const amount = row[colIdx]
      if (!dateVal || amount == null || amount === '') continue
      const numAmount = toNum(amount)
      if (numAmount === 0) continue
      snapshots.push({
        id: crypto.randomUUID(),
        bank: bankName,
        amount: numAmount,
        snapshot_date: excelDateToISO(dateVal),
      })
    }
  }
  return snapshots
}

// LOAN / Payment Schedule sheet: Date, Principal Payment, Interest Payment, Remaining Balance
// Sheet name variants: 'LOAN', 'Loan', 'VAY', 'Payment Schedule'
const LOAN_SHEET_NAMES = ['LOAN', 'Loan', 'VAY', 'Payment Schedule', 'PAYMENT SCHEDULE']

function parseLoanPaymentsSheet(workbook: XLSX.WorkBook): LoanPayment[] {
  const sheetName = LOAN_SHEET_NAMES.find((n) => workbook.Sheets[n])
  if (!sheetName) return []
  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
  const loanId = `imported-loan-${Date.now()}`
  return rows
    .filter((r) => {
      // Must have a date and at least one payment amount
      const hasDate = r['Date'] || r['DATE'] || r['Ngày']
      const hasPrincipal = r['Principal Payment'] || r['Principal'] || r['Gốc'] || r['PRINCIPAL']
      return hasDate && hasPrincipal
    })
    .map((r, i) => {
      const dateRaw = r['Date'] ?? r['DATE'] ?? r['Ngày'] ?? ''
      const principal = toNum(r['Principal Payment'] ?? r['Principal'] ?? r['Gốc'] ?? r['PRINCIPAL'] ?? 0)
      const interest = toNum(r['Interest Payment'] ?? r['Interest'] ?? r['Lãi'] ?? r['INTEREST'] ?? 0)
      const balance = toNum(r['Remaining Balance'] ?? r['Balance'] ?? r['Dư nợ'] ?? r['BALANCE'] ?? 0)
      return {
        id: `imported-lp-${Date.now()}-${i}`,
        loan_id: loanId,
        date: excelDateToISO(dateRaw),
        principal_paid: principal,
        interest_paid: interest,
        balance_after: balance,
      } satisfies LoanPayment
    })
}

export function parseExcelFile(file: ArrayBuffer): ParsedData {
  const workbook = XLSX.read(file, { type: 'array' })
  return {
    gold: parseGoldSheet(workbook),
    funds: parseFundsSheet(workbook),
    savings: parseSavingsSheet(workbook),
    usd: parseUsdSheet(workbook),
    insurance: parseInsuranceSheet(workbook),
    subscriptions: parseSubscriptionsSheet(workbook),
    cash: parseCashSheet(workbook),
    loan_payments: parseLoanPaymentsSheet(workbook),
  }
}

// Return detected sheet names from the workbook
export function detectSheets(file: ArrayBuffer): string[] {
  const workbook = XLSX.read(file, { type: 'array' })
  return workbook.SheetNames
}
