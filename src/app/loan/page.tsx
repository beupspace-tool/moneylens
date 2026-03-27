"use client"

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/shared/stat-card'
import { LoanCard } from './loan-card'
import { LoanCreateForm } from './loan-form'
import { useLoanStore, useLoanPaymentStore } from '@/lib/store/use-store'
import { formatShortVND, formatVND } from '@/lib/format'
import type { Loan, LoanPayment } from '@/lib/types'

export default function LoanPage() {
  const { items: loans, add: addLoan, update: updateLoan, remove: removeLoan } = useLoanStore()
  const { items: payments, add: addPayment, update: updatePayment, remove: removePayment } = useLoanPaymentStore()

  const [createOpen, setCreateOpen] = useState(false)

  // Aggregate totals across all loans
  const totalRemaining = loans.reduce((s, l) => s + l.remaining_balance, 0)
  const totalPrincipalPaid = loans.reduce((s, l) => s + l.total_principal_paid, 0)
  const totalInterestPaid = loans.reduce((s, l) => s + l.total_interest_paid, 0)

  function handleCreateLoan(data: Omit<Loan, 'id'>) {
    addLoan(data)
    toast.success('Đã thêm khoản vay mới')
    setCreateOpen(false)
  }

  function handleAddPayment(data: Omit<LoanPayment, 'id'>) {
    addPayment(data)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">Khoản vay</h1>
          <p className="text-sm text-[#64748B] mt-1">{loans.length} khoản vay đang theo dõi</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 gap-1.5">
          <Plus size={16} /> Thêm khoản vay mới
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard
          label="Tổng dư nợ"
          value={formatShortVND(totalRemaining)}
          sub={formatVND(totalRemaining)}
          bgColor="#FDECEC"
          borderColor="#EF4444"
          valueClassName="text-[#EF4444]"
        />
        <StatCard
          label="Vốn đã trả"
          value={formatShortVND(totalPrincipalPaid)}
          sub={`${loans.length} khoản vay`}
          bgColor="#E0F2EE"
          borderColor="#008080"
          valueClassName="text-[#1B2A4A]"
        />
        <StatCard
          label="Lãi đã trả"
          value={formatShortVND(totalInterestPaid)}
          sub={formatVND(totalInterestPaid)}
          bgColor="#FDECEC"
          borderColor="#EF4444"
          valueClassName="text-[#1B2A4A]"
        />
      </div>

      {/* Loan cards */}
      {loans.length === 0 ? (
        <div className="rounded-xl bg-white shadow-sm p-8 text-center">
          <p className="text-[#64748B]">Chưa có khoản vay nào. Nhấn "Thêm khoản vay mới" để bắt đầu.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              payments={payments}
              onUpdateLoan={updateLoan}
              onAddPayment={handleAddPayment}
              onUpdatePayment={updatePayment}
              onDeletePayment={removePayment}
              onDeleteLoan={removeLoan}
            />
          ))}
        </div>
      )}

      <LoanCreateForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={handleCreateLoan}
      />
    </div>
  )
}
