"use client"

import { useState, useEffect } from 'react'
import { CrudDialog } from '@/components/shared/crud-dialog'
import { FormField } from '@/components/shared/form-field'
import type { SavingsDeposit } from '@/lib/types'
import { BANK_NAMES } from '@/lib/constants'

interface SavingsFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Omit<SavingsDeposit, 'id'>) => void
  initial?: SavingsDeposit | null
}

const EMPTY = {
  bank: '',
  amount: '',
  period_months: '',
  interest_rate: '',
  start_date: '',
  end_date: '',
}

export function SavingsForm({ open, onOpenChange, onSave, initial }: SavingsFormProps) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (initial) {
      setForm({
        bank: initial.bank,
        amount: String(initial.amount),
        period_months: String(initial.period_months),
        interest_rate: String(initial.interest_rate),
        start_date: initial.start_date,
        end_date: initial.end_date,
      })
    } else {
      setForm(EMPTY)
    }
  }, [initial, open])

  function handleChange(key: keyof typeof EMPTY, val: string) {
    setForm((f) => {
      const next = { ...f, [key]: val }
      // Auto-calc end_date when start_date or period_months changes
      const startSrc = key === 'start_date' ? val : next.start_date
      const monthsSrc = key === 'period_months' ? val : next.period_months
      if (startSrc && monthsSrc && Number(monthsSrc) > 0) {
        const start = new Date(startSrc)
        start.setMonth(start.getMonth() + Number(monthsSrc))
        next.end_date = start.toISOString().slice(0, 10)
      }
      return next
    })
  }

  function handleSubmit() {
    const amount = Number(form.amount)
    const rate = Number(form.interest_rate)
    const months = Number(form.period_months)
    // Expected interest = principal * rate/100 * (months/12)
    const expected_interest = Math.round(amount * (rate / 100) * (months / 12))
    const today = new Date().toISOString().slice(0, 10)
    const status: SavingsDeposit['status'] = form.end_date > today ? 'active' : 'matured'

    onSave({
      bank: form.bank,
      amount,
      period_months: months,
      interest_rate: rate,
      start_date: form.start_date,
      end_date: form.end_date,
      expected_interest,
      status,
    })
  }

  return (
    <CrudDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? 'Chỉnh sửa tiết kiệm' : 'Thêm tiết kiệm mới'}
      onSubmit={handleSubmit}
      submitLabel={initial ? 'Cập nhật' : 'Thêm'}
    >
      <FormField label="Ngân hàng" type="select" value={form.bank} onChange={(v) => handleChange('bank', v)} options={BANK_NAMES.map(b => ({ value: b, label: b }))} required />
      <FormField label="Số tiền (VND)" type="number" value={form.amount} onChange={(v) => handleChange('amount', v)} placeholder="200000000" required />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Kỳ hạn (tháng)" type="number" value={form.period_months} onChange={(v) => handleChange('period_months', v)} placeholder="12" required />
        <FormField label="Lãi suất/năm (%)" type="number" value={form.interest_rate} onChange={(v) => handleChange('interest_rate', v)} placeholder="5.45" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Ngày gửi" type="date" value={form.start_date} onChange={(v) => handleChange('start_date', v)} required />
        <FormField label="Ngày đáo hạn" type="date" value={form.end_date} onChange={(v) => handleChange('end_date', v)} required />
      </div>
      <p className="text-xs text-[#64748B]">Ngày đáo hạn tự động tính khi nhập ngày gửi và kỳ hạn, có thể chỉnh sửa lại.</p>
    </CrudDialog>
  )
}
