"use client"

import { useState, useEffect } from 'react'
import { CrudDialog } from '@/components/shared/crud-dialog'
import { FormField } from '@/components/shared/form-field'
import type { UsdTransaction } from '@/lib/types'
import { USD_SOURCES, USD_STATUSES } from '@/lib/constants'

interface UsdFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Omit<UsdTransaction, 'id'>) => void
  initial?: UsdTransaction | null
}

const EMPTY = {
  date: '',
  amount_usd: '',
  exchange_rate_at_receipt: '',
  source: 'Upwork',
  status: 'holding',
}

export function UsdForm({ open, onOpenChange, onSave, initial }: UsdFormProps) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (initial) {
      setForm({
        date: initial.date,
        amount_usd: String(initial.amount_usd),
        exchange_rate_at_receipt: String(initial.exchange_rate_at_receipt),
        source: initial.source ?? 'Upwork',
        status: initial.status ?? 'holding',
      })
    } else {
      setForm(EMPTY)
    }
  }, [initial, open])

  const set = (key: keyof typeof EMPTY) => (val: string) => setForm((f) => ({ ...f, [key]: val }))

  const amountUsd = Number(form.amount_usd) || 0
  const rate = Number(form.exchange_rate_at_receipt) || 0
  const amountVnd = amountUsd * rate

  function handleSubmit() {
    onSave({
      date: form.date,
      amount_usd: amountUsd,
      exchange_rate_at_receipt: rate,
      amount_vnd_at_receipt: amountVnd,
      source: form.source,
      status: form.status,
    })
  }

  return (
    <CrudDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? 'Chỉnh sửa giao dịch USD' : 'Thêm giao dịch USD'}
      onSubmit={handleSubmit}
      submitLabel={initial ? 'Cập nhật' : 'Thêm'}
    >
      <FormField label="Ngày" type="date" value={form.date} onChange={set('date')} required />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Số tiền USD" type="number" value={form.amount_usd} onChange={set('amount_usd')} placeholder="500" required />
        <FormField label="Tỉ giá lúc nhận" type="number" value={form.exchange_rate_at_receipt} onChange={set('exchange_rate_at_receipt')} placeholder="26300" required />
      </div>
      {amountVnd > 0 && (
        <p className="text-sm text-[#64748B]">
          Giá trị VND:{' '}
          <span className="font-semibold text-[#1B2A4A]">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amountVnd)}
          </span>
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="Nguồn thu"
          type="select"
          value={form.source}
          onChange={set('source')}
          options={USD_SOURCES.map(s => ({ value: s, label: s }))}
        />
        <FormField
          label="Trạng thái"
          type="select"
          value={form.status}
          onChange={set('status')}
          options={USD_STATUSES.map(s => ({ value: s.value, label: s.label }))}
        />
      </div>
    </CrudDialog>
  )
}
