"use client"

import { useState, useEffect } from 'react'
import { CrudDialog } from '@/components/shared/crud-dialog'
import { FormField } from '@/components/shared/form-field'
import type { CashSnapshot } from '@/lib/types'
import { CASH_ACCOUNTS } from '@/lib/constants'

interface CashFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Omit<CashSnapshot, 'id'>) => void
  initial?: CashSnapshot | null
  // Quick-update pre-fill: bank + today's date, user just enters amount
  prefill?: { bank: string; snapshot_date: string } | null
}

const EMPTY = { bank: '', amount: '', snapshot_date: '' }

export function CashForm({ open, onOpenChange, onSave, initial, prefill }: CashFormProps) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (initial) {
      setForm({
        bank: initial.bank,
        amount: String(initial.amount),
        snapshot_date: initial.snapshot_date,
      })
    } else if (prefill) {
      // Quick-update: pre-fill bank + date, clear amount so user focuses on it
      setForm({ bank: prefill.bank, amount: '', snapshot_date: prefill.snapshot_date })
    } else {
      setForm(EMPTY)
    }
  }, [initial, prefill, open])

  const set = (key: keyof typeof EMPTY) => (val: string) => setForm((f) => ({ ...f, [key]: val }))

  const isQuickUpdate = !initial && !!prefill

  function handleSubmit() {
    onSave({
      bank: form.bank,
      amount: Number(form.amount),
      snapshot_date: form.snapshot_date,
    })
  }

  return (
    <CrudDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? 'Chỉnh sửa snapshot' : isQuickUpdate ? `Cập nhật nhanh — ${prefill?.bank}` : 'Thêm snapshot số dư'}
      onSubmit={handleSubmit}
      submitLabel={initial ? 'Cập nhật' : 'Thêm'}
    >
      <FormField
        label="Ngân hàng"
        type="select"
        value={form.bank}
        onChange={set('bank')}
        options={CASH_ACCOUNTS.map((a) => ({ value: a, label: a }))}
        required
      />
      <FormField
        label="Số dư (VND)"
        type="number"
        value={form.amount}
        onChange={set('amount')}
        placeholder="25600000"
        required
      />
      <FormField
        label="Ngày"
        type="date"
        value={form.snapshot_date}
        onChange={set('snapshot_date')}
        required
      />
    </CrudDialog>
  )
}
