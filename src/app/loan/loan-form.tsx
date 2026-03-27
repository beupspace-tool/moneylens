"use client"

import { useState, useEffect } from 'react'
import { CrudDialog } from '@/components/shared/crud-dialog'
import { FormField } from '@/components/shared/form-field'
import type { LoanPayment, Loan } from '@/lib/types'

// ---- Create Loan Form ----
interface LoanCreateFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Omit<Loan, 'id'>) => void
}

const EMPTY_LOAN = { name: '', original_principal: '', interest_rate: '', term_years: '', start_date: '' }

export function LoanCreateForm({ open, onOpenChange, onSave }: LoanCreateFormProps) {
  const [form, setForm] = useState(EMPTY_LOAN)

  useEffect(() => {
    if (!open) setForm(EMPTY_LOAN)
  }, [open])

  const set = (key: keyof typeof EMPTY_LOAN) => (val: string) => setForm((f) => ({ ...f, [key]: val }))

  function handleSubmit() {
    const principal = Number(form.original_principal)
    onSave({
      name: form.name,
      original_principal: principal,
      interest_rate: Number(form.interest_rate),
      term_years: Number(form.term_years),
      start_date: form.start_date,
      // New loan starts with zero paid
      remaining_balance: principal,
      total_principal_paid: 0,
      total_interest_paid: 0,
    })
  }

  return (
    <CrudDialog open={open} onOpenChange={onOpenChange} title="Thêm khoản vay mới" onSubmit={handleSubmit} submitLabel="Thêm">
      <FormField label="Tên khoản vay" value={form.name} onChange={set('name')} placeholder="Vay mua nhà" required />
      <FormField label="Vốn ban đầu (VND)" type="number" value={form.original_principal} onChange={set('original_principal')} placeholder="1440000000" required />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Lãi suất (%/năm)" type="number" value={form.interest_rate} onChange={set('interest_rate')} placeholder="8.4" required />
        <FormField label="Thời hạn (năm)" type="number" value={form.term_years} onChange={set('term_years')} placeholder="20" required />
      </div>
      <FormField label="Ngày bắt đầu" type="date" value={form.start_date} onChange={set('start_date')} required />
    </CrudDialog>
  )
}

// ---- Payment Form ----
interface PaymentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Omit<LoanPayment, 'id'>) => void
  loan: Loan
  initial?: LoanPayment | null
}

const EMPTY_PAYMENT = { date: '', principal_paid: '', interest_paid: '', balance_after: '' }

export function LoanPaymentForm({ open, onOpenChange, onSave, loan, initial }: PaymentFormProps) {
  const [form, setForm] = useState(EMPTY_PAYMENT)

  // Auto-calc estimated interest = remaining_balance × (rate / 12 / 100)
  const estimatedInterest = Math.round(loan.remaining_balance * (loan.interest_rate / 100 / 12))
  const principalPaid = Number(form.principal_paid) || 0
  const interestPaid = Number(form.interest_paid) || estimatedInterest
  const balanceAfter = loan.remaining_balance - principalPaid

  useEffect(() => {
    if (initial) {
      setForm({
        date: initial.date,
        principal_paid: String(initial.principal_paid),
        interest_paid: String(initial.interest_paid),
        balance_after: String(initial.balance_after),
      })
    } else {
      const today = new Date().toISOString().slice(0, 10)
      setForm({ date: today, principal_paid: '', interest_paid: String(estimatedInterest), balance_after: '' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, open])

  const set = (key: keyof typeof EMPTY_PAYMENT) => (val: string) => setForm((f) => ({ ...f, [key]: val }))

  function handleSubmit() {
    onSave({
      loan_id: loan.id,
      date: form.date,
      principal_paid: principalPaid,
      interest_paid: Number(form.interest_paid) || estimatedInterest,
      balance_after: Number(form.balance_after) || balanceAfter,
    })
  }

  return (
    <CrudDialog
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? 'Chỉnh sửa thanh toán' : `Thêm thanh toán — ${loan.name}`}
      onSubmit={handleSubmit}
      submitLabel={initial ? 'Cập nhật' : 'Thêm'}
    >
      <FormField label="Ngày" type="date" value={form.date} onChange={set('date')} required />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Gốc trả (VND)" type="number" value={form.principal_paid} onChange={set('principal_paid')} placeholder="3200000" required />
        <div>
          <FormField label="Lãi trả (VND)" type="number" value={form.interest_paid} onChange={set('interest_paid')} placeholder={String(estimatedInterest)} />
          {!initial && (
            <p className="text-xs text-[#64748B] mt-1">Ước tính: {estimatedInterest.toLocaleString('vi-VN')} đ</p>
          )}
        </div>
      </div>
      <div>
        <FormField label="Dư nợ sau (VND)" type="number" value={form.balance_after} onChange={set('balance_after')} placeholder={String(balanceAfter > 0 ? balanceAfter : '')} />
        {!initial && principalPaid > 0 && (
          <p className="text-xs text-[#64748B] mt-1">Tự động tính: {balanceAfter.toLocaleString('vi-VN')} đ</p>
        )}
      </div>
    </CrudDialog>
  )
}

// ---- Loan Edit Form ----
interface LoanEditFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Partial<Loan>) => void
  loan: Loan
}

export function LoanEditForm({ open, onOpenChange, onSave, loan }: LoanEditFormProps) {
  const [form, setForm] = useState({
    name: loan.name,
    interest_rate: String(loan.interest_rate),
    remaining_balance: String(loan.remaining_balance),
    total_principal_paid: String(loan.total_principal_paid),
    total_interest_paid: String(loan.total_interest_paid),
  })

  useEffect(() => {
    setForm({
      name: loan.name,
      interest_rate: String(loan.interest_rate),
      remaining_balance: String(loan.remaining_balance),
      total_principal_paid: String(loan.total_principal_paid),
      total_interest_paid: String(loan.total_interest_paid),
    })
  }, [loan, open])

  const set = (key: keyof typeof form) => (val: string) => setForm((f) => ({ ...f, [key]: val }))

  function handleSubmit() {
    onSave({
      name: form.name,
      interest_rate: Number(form.interest_rate),
      remaining_balance: Number(form.remaining_balance),
      total_principal_paid: Number(form.total_principal_paid),
      total_interest_paid: Number(form.total_interest_paid),
    })
  }

  return (
    <CrudDialog open={open} onOpenChange={onOpenChange} title="Cập nhật khoản vay" onSubmit={handleSubmit} submitLabel="Cập nhật">
      <FormField label="Tên khoản vay" value={form.name} onChange={set('name')} required />
      <FormField label="Lãi suất (%/năm)" type="number" value={form.interest_rate} onChange={set('interest_rate')} placeholder="8.4" required />
      <FormField label="Dư nợ còn lại (VND)" type="number" value={form.remaining_balance} onChange={set('remaining_balance')} placeholder="1070000000" required />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Vốn đã trả (VND)" type="number" value={form.total_principal_paid} onChange={set('total_principal_paid')} placeholder="370000000" required />
        <FormField label="Lãi đã trả (VND)" type="number" value={form.total_interest_paid} onChange={set('total_interest_paid')} placeholder="327500000" required />
      </div>
    </CrudDialog>
  )
}
