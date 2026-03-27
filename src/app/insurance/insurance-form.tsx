"use client"

import { useState, useEffect } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { CrudDialog } from '@/components/shared/crud-dialog'
import { FormField } from '@/components/shared/form-field'
import type { InsurancePolicy, InsuredPerson, InsuranceBenefit, InsuranceRider } from '@/lib/types'
import {
  INSURANCE_PRODUCTS, INSURANCE_STATUSES, INSURANCE_PROVIDERS,
  INSURANCE_PRODUCT_TYPES, INSURANCE_RELATIONSHIPS, INSURANCE_BENEFIT_TYPES,
} from '@/lib/constants'

interface InsuranceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Omit<InsurancePolicy, 'id'>) => void
  initial?: InsurancePolicy | null
}

const EMPTY_BASIC = {
  product_name: '', annual_premium: '', start_date: '', payment_years: '',
  coverage_amount: '', status: 'active', policy_number: '', provider: '',
  product_type: '', maturity_date: '', base_premium: '', rider_premium: '',
}

export function InsuranceForm({ open, onOpenChange, onSave, initial }: InsuranceFormProps) {
  const [form, setForm] = useState(EMPTY_BASIC)
  const [persons, setPersons] = useState<InsuredPerson[]>([])
  const [benefits, setBenefits] = useState<InsuranceBenefit[]>([])
  const [riders, setRiders] = useState<InsuranceRider[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({
        product_name: initial.product_name,
        annual_premium: String(initial.annual_premium),
        start_date: initial.start_date,
        payment_years: String(initial.payment_years),
        coverage_amount: String(initial.coverage_amount ?? ''),
        status: initial.status ?? 'active',
        policy_number: initial.policy_number ?? '',
        provider: initial.provider ?? '',
        product_type: initial.product_type ?? '',
        maturity_date: initial.maturity_date ?? '',
        base_premium: String(initial.base_premium ?? ''),
        rider_premium: String(initial.rider_premium ?? ''),
      })
      setPersons(initial.insured_persons ?? [])
      setBenefits(initial.benefits ?? [])
      setRiders(initial.riders ?? [])
      setShowAdvanced(!!(initial.insured_persons?.length || initial.benefits?.length || initial.riders?.length))
    } else {
      setForm(EMPTY_BASIC)
      setPersons([])
      setBenefits([])
      setRiders([])
      setShowAdvanced(false)
    }
  }, [initial, open])

  const set = (key: keyof typeof EMPTY_BASIC) => (val: string) => setForm(f => ({ ...f, [key]: val }))
  const annualPremium = Number(form.annual_premium) || 0
  const paymentYears = Number(form.payment_years) || 0
  const totalPaid = annualPremium * paymentYears

  function handleSubmit() {
    onSave({
      product_name: form.product_name,
      annual_premium: annualPremium,
      start_date: form.start_date,
      payment_years: paymentYears,
      total_paid: totalPaid,
      coverage_amount: form.coverage_amount ? Number(form.coverage_amount) : undefined,
      status: form.status || 'active',
      policy_number: form.policy_number || undefined,
      provider: form.provider || undefined,
      product_type: form.product_type || undefined,
      maturity_date: form.maturity_date || undefined,
      base_premium: form.base_premium ? Number(form.base_premium) : undefined,
      rider_premium: form.rider_premium ? Number(form.rider_premium) : undefined,
      insured_persons: persons.length > 0 ? persons : undefined,
      benefits: benefits.length > 0 ? benefits : undefined,
      riders: riders.length > 0 ? riders : undefined,
    })
  }

  return (
    <CrudDialog open={open} onOpenChange={onOpenChange}
      title={initial ? 'Chỉnh sửa hợp đồng' : 'Thêm hợp đồng bảo hiểm'}
      onSubmit={handleSubmit} submitLabel={initial ? 'Cập nhật' : 'Thêm'}>

      {/* Basic info */}
      <FormField label="Tên sản phẩm" type="select" value={form.product_name}
        onChange={set('product_name')} options={INSURANCE_PRODUCTS.map(p => ({ value: p, label: p }))} required />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Phí hàng năm" type="number" value={form.annual_premium} onChange={set('annual_premium')} required />
        <FormField label="Số tiền bảo hiểm" type="number" value={form.coverage_amount} onChange={set('coverage_amount')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Ngày bắt đầu" type="date" value={form.start_date} onChange={set('start_date')} required />
        <FormField label="Số năm đóng phí" type="number" value={form.payment_years} onChange={set('payment_years')} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Trạng thái" type="select" value={form.status} onChange={set('status')}
          options={INSURANCE_STATUSES.map(s => ({ value: s.value, label: s.label }))} />
        <FormField label="Nhà bảo hiểm" type="select" value={form.provider} onChange={set('provider')}
          options={INSURANCE_PROVIDERS.map(p => ({ value: p, label: p }))} />
      </div>

      {totalPaid > 0 && (
        <p className="text-sm text-[#64748B]">Tổng đã đóng: <span className="font-semibold text-[#1B2A4A]">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(totalPaid)}
        </span></p>
      )}

      {/* Advanced toggle */}
      <button type="button" onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-1 text-sm font-semibold text-[#008080] hover:text-[#006666] mt-1">
        {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showAdvanced ? 'Ẩn chi tiết' : 'Thêm chi tiết (người được BH, quyền lợi, riders)'}
      </button>

      {showAdvanced && (
        <div className="space-y-4 border-t border-[#E2E8F0] pt-3">
          {/* Extra fields */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Số hợp đồng" type="text" value={form.policy_number} onChange={set('policy_number')} />
            <FormField label="Loại sản phẩm" type="select" value={form.product_type} onChange={set('product_type')}
              options={INSURANCE_PRODUCT_TYPES.map(t => ({ value: t.value, label: t.label }))} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Ngày đáo hạn" type="date" value={form.maturity_date} onChange={set('maturity_date')} />
            <FormField label="Phí cơ bản" type="number" value={form.base_premium} onChange={set('base_premium')} />
            <FormField label="Phí bổ trợ" type="number" value={form.rider_premium} onChange={set('rider_premium')} />
          </div>

          {/* Insured Persons */}
          <ArraySection title="Người được bảo hiểm" onAdd={() => setPersons([...persons, { name: '', relationship: 'self' }])}>
            {persons.map((p, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="flex-1">
                  <FormField label="Tên" type="text" value={p.name}
                    onChange={(v) => { const arr = [...persons]; arr[i] = { ...arr[i], name: v }; setPersons(arr) }} />
                </div>
                <div className="w-28">
                  <FormField label="Quan hệ" type="select" value={p.relationship}
                    onChange={(v) => { const arr = [...persons]; arr[i] = { ...arr[i], relationship: v }; setPersons(arr) }}
                    options={INSURANCE_RELATIONSHIPS.map(r => ({ value: r.value, label: r.label }))} />
                </div>
                <button type="button" onClick={() => setPersons(persons.filter((_, j) => j !== i))}
                  className="p-1.5 text-red-400 hover:text-red-600 mb-1"><Trash2 size={14} /></button>
              </div>
            ))}
          </ArraySection>

          {/* Benefits */}
          <ArraySection title="Quyền lợi bảo hiểm" onAdd={() => setBenefits([...benefits, { type: 'death', description: '', amount: 0 }])}>
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="w-28">
                  <FormField label="Loại" type="select" value={b.type}
                    onChange={(v) => { const arr = [...benefits]; arr[i] = { ...arr[i], type: v }; setBenefits(arr) }}
                    options={INSURANCE_BENEFIT_TYPES.map(t => ({ value: t.value, label: t.label }))} />
                </div>
                <div className="flex-1">
                  <FormField label="Mô tả" type="text" value={b.description}
                    onChange={(v) => { const arr = [...benefits]; arr[i] = { ...arr[i], description: v }; setBenefits(arr) }} />
                </div>
                <div className="w-32">
                  <FormField label="Số tiền" type="number" value={String(b.amount ?? '')}
                    onChange={(v) => { const arr = [...benefits]; arr[i] = { ...arr[i], amount: Number(v) || 0 }; setBenefits(arr) }} />
                </div>
                <button type="button" onClick={() => setBenefits(benefits.filter((_, j) => j !== i))}
                  className="p-1.5 text-red-400 hover:text-red-600 mb-1"><Trash2 size={14} /></button>
              </div>
            ))}
          </ArraySection>

          {/* Riders */}
          <ArraySection title="Sản phẩm bổ trợ" onAdd={() => setRiders([...riders, { name: '', insured: '', premium: 0 }])}>
            {riders.map((r, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="flex-1">
                  <FormField label="Tên" type="text" value={r.name}
                    onChange={(v) => { const arr = [...riders]; arr[i] = { ...arr[i], name: v }; setRiders(arr) }} />
                </div>
                <div className="w-32">
                  <FormField label="Người BH" type="text" value={r.insured}
                    onChange={(v) => { const arr = [...riders]; arr[i] = { ...arr[i], insured: v }; setRiders(arr) }} />
                </div>
                <div className="w-28">
                  <FormField label="Phí/năm" type="number" value={String(r.premium)}
                    onChange={(v) => { const arr = [...riders]; arr[i] = { ...arr[i], premium: Number(v) || 0 }; setRiders(arr) }} />
                </div>
                <button type="button" onClick={() => setRiders(riders.filter((_, j) => j !== i))}
                  className="p-1.5 text-red-400 hover:text-red-600 mb-1"><Trash2 size={14} /></button>
              </div>
            ))}
          </ArraySection>
        </div>
      )}
    </CrudDialog>
  )
}

function ArraySection({ title, onAdd, children }: { title: string; onAdd: () => void; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">{title}</p>
        <button type="button" onClick={onAdd}
          className="flex items-center gap-1 text-xs font-semibold text-[#008080] hover:text-[#006666]">
          <Plus size={12} /> Thêm
        </button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}
