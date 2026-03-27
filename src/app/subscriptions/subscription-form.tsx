"use client"

import { useState, useEffect } from 'react'
import { CrudDialog } from '@/components/shared/crud-dialog'
import { FormField } from '@/components/shared/form-field'
import type { Subscription } from '@/lib/types'
import { SUBSCRIPTION_PROVIDERS } from '@/lib/constants'

interface SubscriptionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Omit<Subscription, 'id'>) => void
  initial?: Subscription | null
}

const CATEGORIES = ['AI', 'Career', 'Education', 'Design', 'Entertainment', 'Office', 'Utility'].map((c) => ({ value: c, label: c }))
const FREQUENCIES = [{ value: 'Monthly', label: 'Hàng tháng' }, { value: 'Yearly', label: 'Hàng năm' }]
const STATUSES = [{ value: 'Ongoing', label: 'Đang dùng' }, { value: 'Cancelled', label: 'Đã hủy' }]

const EMPTY = {
  name: '', category: 'AI', provider: '', distributor: '',
  frequency: 'Monthly', amount_usd: '', start_date: '', end_date: '', status: 'Ongoing',
}

export function SubscriptionForm({ open, onOpenChange, onSave, initial }: SubscriptionFormProps) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        category: initial.category,
        provider: initial.provider,
        distributor: initial.distributor,
        frequency: initial.frequency,
        amount_usd: String(initial.amount_usd),
        start_date: initial.start_date,
        end_date: initial.end_date,
        status: initial.status,
      })
    } else {
      setForm(EMPTY)
    }
  }, [initial, open])

  const set = (key: keyof typeof EMPTY) => (val: string) => setForm((f) => ({ ...f, [key]: val }))

  const amountUsd = Number(form.amount_usd) || 0
  const amountPerMonth = form.frequency === 'Monthly' ? amountUsd : amountUsd / 12

  function handleSubmit() {
    onSave({
      name: form.name,
      category: form.category,
      provider: form.provider,
      distributor: form.distributor,
      frequency: form.frequency as 'Monthly' | 'Yearly',
      amount_usd: amountUsd,
      amount_per_month: amountPerMonth,
      start_date: form.start_date,
      end_date: form.end_date,
      status: form.status as 'Ongoing' | 'Cancelled' | 'Expired',
    })
  }

  return (
    <CrudDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? 'Chỉnh sửa subscription' : 'Thêm subscription mới'}
      onSubmit={handleSubmit}
      submitLabel={initial ? 'Cập nhật' : 'Thêm'}
    >
      <FormField label="Tên" value={form.name} onChange={set('name')} placeholder="ChatGPT" required />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Danh mục" type="select" value={form.category} onChange={set('category')} options={CATEGORIES} required />
        <FormField label="Nhà cung cấp" type="select" value={form.provider} onChange={set('provider')} options={SUBSCRIPTION_PROVIDERS.map(p => ({ value: p, label: p }))} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Tần suất" type="select" value={form.frequency} onChange={set('frequency')} options={FREQUENCIES} required />
        <FormField label="Giá USD" type="number" value={form.amount_usd} onChange={set('amount_usd')} placeholder="20" required />
      </div>
      {amountPerMonth > 0 && (
        <p className="text-sm text-[#64748B]">
          Chi phí/tháng:{' '}
          <span className="font-semibold text-[#D4A843]">
            ${amountPerMonth.toFixed(2)}/tháng
          </span>
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Ngày bắt đầu" type="date" value={form.start_date} onChange={set('start_date')} />
        <FormField label="Ngày kết thúc" type="date" value={form.end_date} onChange={set('end_date')} />
      </div>
      <FormField label="Trạng thái" type="select" value={form.status} onChange={set('status')} options={STATUSES} required />
    </CrudDialog>
  )
}
