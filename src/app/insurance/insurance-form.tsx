"use client"

import { useState, useEffect } from 'react'
import { CrudDialog } from '@/components/shared/crud-dialog'
import { FormField } from '@/components/shared/form-field'
import type { InsurancePolicy } from '@/lib/types'
import { INSURANCE_PRODUCTS, INSURANCE_STATUSES } from '@/lib/constants'

interface InsuranceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Omit<InsurancePolicy, 'id'>) => void
  initial?: InsurancePolicy | null
}

const EMPTY = {
  product_name: '',
  annual_premium: '',
  start_date: '',
  payment_years: '',
  coverage_amount: '',
  status: 'active',
}

export function InsuranceForm({ open, onOpenChange, onSave, initial }: InsuranceFormProps) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (initial) {
      setForm({
        product_name: initial.product_name,
        annual_premium: String(initial.annual_premium),
        start_date: initial.start_date,
        payment_years: String(initial.payment_years),
        coverage_amount: String(initial.coverage_amount ?? ''),
        status: initial.status ?? 'active',
      })
    } else {
      setForm(EMPTY)
    }
  }, [initial, open])

  const set = (key: keyof typeof EMPTY) => (val: string) => setForm((f) => ({ ...f, [key]: val }))

  const annualPremium = Number(form.annual_premium) || 0
  const paymentYears = Number(form.payment_years) || 0
  const totalPaid = annualPremium * paymentYears
  const coverageAmount = form.coverage_amount ? Number(form.coverage_amount) : undefined

  function handleSubmit() {
    onSave({
      product_name: form.product_name,
      annual_premium: annualPremium,
      start_date: form.start_date,
      payment_years: paymentYears,
      total_paid: totalPaid,
      coverage_amount: coverageAmount,
      status: form.status || 'active',
    })
  }

  return (
    <CrudDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? 'Chỉnh sửa hợp đồng' : 'Thêm hợp đồng bảo hiểm'}
      onSubmit={handleSubmit}
      submitLabel={initial ? 'Cập nhật' : 'Thêm'}
    >
      <FormField label="Tên sản phẩm" type="select" value={form.product_name} onChange={set('product_name')} options={INSURANCE_PRODUCTS.map(p => ({ value: p, label: p }))} required />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Phí hàng năm (VND)" type="number" value={form.annual_premium} onChange={set('annual_premium')} placeholder="21056000" required />
        <FormField label="Số tiền bảo hiểm (VND)" type="number" value={form.coverage_amount} onChange={set('coverage_amount')} placeholder="750000000" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Năm bắt đầu" type="date" value={form.start_date} onChange={set('start_date')} required />
        <FormField label="Số năm đóng phí" type="number" value={form.payment_years} onChange={set('payment_years')} placeholder="6" required />
      </div>
      <FormField
        label="Trạng thái"
        type="select"
        value={form.status}
        onChange={set('status')}
        options={INSURANCE_STATUSES.map(s => ({ value: s.value, label: s.label }))}
      />
      {totalPaid > 0 && (
        <p className="text-sm text-[#64748B]">
          Tổng đã đóng:{' '}
          <span className="font-semibold text-[#1B2A4A]">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(totalPaid)}
          </span>
        </p>
      )}
    </CrudDialog>
  )
}
