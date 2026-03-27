"use client"

import { useState, useEffect } from 'react'
import { CrudDialog } from '@/components/shared/crud-dialog'
import { FormField } from '@/components/shared/form-field'
import type { FundTransaction } from '@/lib/types'
import { FUND_CODES as FUND_CODES_MAP, FUND_MANAGERS, FUND_DISTRIBUTORS } from '@/lib/constants'

const FUND_TYPE_OPTIONS = [
  { value: 'Cổ phiếu', label: 'Cổ phiếu' },
  { value: 'Cân bằng', label: 'Cân bằng' },
  { value: 'Trái phiếu', label: 'Trái phiếu' },
]

const TRANSACTION_TYPE_OPTIONS = [
  { value: 'buy', label: 'Mua' },
  { value: 'sell', label: 'Bán' },
]

interface FundFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Omit<FundTransaction, 'id'>) => void
  initial?: FundTransaction | null
}

const EMPTY = {
  fund_code: '',
  fund_type: '',
  transaction_type: 'buy',
  amount_vnd: '',
  qty_units: '',
  nav: '',
  order_date: '',
  match_date: '',
  manager: '',
  distributor: '',
}

export function FundForm({ open, onOpenChange, onSave, initial }: FundFormProps) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (initial) {
      setForm({
        fund_code: initial.fund_code,
        fund_type: initial.fund_type,
        transaction_type: initial.transaction_type ?? 'buy',
        amount_vnd: String(initial.amount_vnd),
        qty_units: String(initial.qty_units),
        nav: String(initial.nav),
        order_date: initial.order_date,
        match_date: initial.match_date,
        manager: initial.manager,
        distributor: initial.distributor,
      })
    } else {
      setForm(EMPTY)
    }
  }, [initial, open])

  const set = (key: keyof typeof EMPTY) => (val: string) => setForm((f) => ({ ...f, [key]: val }))

  function handleSubmit() {
    onSave({
      fund_code: form.fund_code,
      fund_type: form.fund_type as FundTransaction['fund_type'],
      transaction_type: form.transaction_type as 'buy' | 'sell',
      amount_vnd: Number(form.amount_vnd),
      qty_units: Number(form.qty_units),
      nav: Number(form.nav),
      real_amount: Number(form.amount_vnd),
      order_date: form.order_date,
      match_date: form.match_date,
      manager: form.manager,
      distributor: form.distributor,
    })
  }

  const codeOptions = Object.keys(FUND_CODES_MAP).map((c) => ({ value: c, label: c }))
  const managerOptions = FUND_MANAGERS.map((m) => ({ value: m, label: m }))
  const distributorOptions = FUND_DISTRIBUTORS.map((d) => ({ value: d, label: d }))

  return (
    <CrudDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? 'Chỉnh sửa CCQ' : 'Thêm giao dịch CCQ'}
      onSubmit={handleSubmit}
      submitLabel={initial ? 'Cập nhật' : 'Thêm'}
    >
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Mã quỹ" type="select" value={form.fund_code} onChange={set('fund_code')} options={codeOptions} required />
        <FormField label="Loại giao dịch" type="select" value={form.transaction_type} onChange={set('transaction_type')} options={TRANSACTION_TYPE_OPTIONS} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Loại quỹ" type="select" value={form.fund_type} onChange={set('fund_type')} options={FUND_TYPE_OPTIONS} required />
        <FormField label="NAV" type="number" value={form.nav} onChange={set('nav')} placeholder="15475" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Số tiền (VND)" type="number" value={form.amount_vnd} onChange={set('amount_vnd')} placeholder="2000000" required />
        <FormField label="Số lượng CCQ" type="number" value={form.qty_units} onChange={set('qty_units')} placeholder="129.23" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Ngày đặt lệnh" type="date" value={form.order_date} onChange={set('order_date')} required />
        <FormField label="Ngày khớp lệnh" type="date" value={form.match_date} onChange={set('match_date')} required />
      </div>
      <FormField label="Quản lý" type="select" value={form.manager} onChange={set('manager')} options={managerOptions} required />
      <FormField label="Phân phối" type="select" value={form.distributor} onChange={set('distributor')} options={distributorOptions} required />
    </CrudDialog>
  )
}
