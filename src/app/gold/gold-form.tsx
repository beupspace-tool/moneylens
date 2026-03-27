"use client"

import { useState, useEffect } from 'react'
import { CrudDialog } from '@/components/shared/crud-dialog'
import { FormField } from '@/components/shared/form-field'
import type { GoldHolding } from '@/lib/types'
import { GOLD_LOCATIONS } from '@/lib/constants'

interface GoldFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Omit<GoldHolding, 'id' | 'created_at'>) => void
  initial?: GoldHolding | null
}

const EMPTY = {
  purchase_date: '',
  qty_chi: '',
  amount_vnd: '',
  unit_price: '',
  location: '',
}

export function GoldForm({ open, onOpenChange, onSave, initial }: GoldFormProps) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (initial) {
      setForm({
        purchase_date: initial.purchase_date,
        qty_chi: String(initial.qty_chi),
        amount_vnd: String(initial.amount_vnd),
        unit_price: String(initial.unit_price),
        location: initial.location,
      })
    } else {
      setForm(EMPTY)
    }
  }, [initial, open])

  // Bidirectional auto-calc helpers
  function handleQtyOrUnitPriceChange(key: 'qty_chi' | 'unit_price', val: string) {
    setForm((f) => {
      const next = { ...f, [key]: val }
      const qty = Number(key === 'qty_chi' ? val : f.qty_chi)
      const price = Number(key === 'unit_price' ? val : f.unit_price)
      if (qty > 0 && price > 0) next.amount_vnd = String(qty * price)
      return next
    })
  }

  function handleAmountChange(val: string) {
    setForm((f) => {
      const qty = Number(f.qty_chi)
      const next = { ...f, amount_vnd: val }
      if (qty > 0 && Number(val) > 0) next.unit_price = String(Math.round(Number(val) / qty))
      return next
    })
  }

  const set = (key: keyof typeof EMPTY) => (val: string) => setForm((f) => ({ ...f, [key]: val }))

  function handleSubmit() {
    onSave({
      purchase_date: form.purchase_date,
      qty_chi: Number(form.qty_chi),
      amount_vnd: Number(form.amount_vnd),
      unit_price: Number(form.unit_price),
      location: form.location,
    })
  }

  return (
    <CrudDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? 'Chỉnh sửa vàng' : 'Thêm vàng mới'}
      onSubmit={handleSubmit}
      submitLabel={initial ? 'Cập nhật' : 'Thêm'}
    >
      <FormField label="Ngày mua" type="date" value={form.purchase_date} onChange={set('purchase_date')} required />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="Số lượng chỉ"
          type="number"
          value={form.qty_chi}
          onChange={(v) => handleQtyOrUnitPriceChange('qty_chi', v)}
          placeholder="2"
          required
        />
        <FormField
          label="Đơn giá (VND)"
          type="number"
          value={form.unit_price}
          onChange={(v) => handleQtyOrUnitPriceChange('unit_price', v)}
          placeholder="11100000"
          required
        />
      </div>
      <FormField
        label="Giá trị (VND)"
        type="number"
        value={form.amount_vnd}
        onChange={handleAmountChange}
        placeholder="22200000"
        required
      />
      <FormField label="Nơi mua" type="select" value={form.location} onChange={set('location')} options={GOLD_LOCATIONS.map(l => ({ value: l, label: l }))} required />
    </CrudDialog>
  )
}
