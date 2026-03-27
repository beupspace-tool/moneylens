"use client"

import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DeleteConfirm } from '@/components/shared/delete-confirm'
import { LoanPaymentForm, LoanEditForm } from './loan-form'
import { formatVND, formatPercent, formatShortVND, formatDate } from '@/lib/format'
import type { Loan, LoanPayment } from '@/lib/types'

interface LoanCardProps {
  loan: Loan
  payments: LoanPayment[]
  onUpdateLoan: (id: string, updates: Partial<Loan>) => void
  onAddPayment: (data: Omit<LoanPayment, 'id'>) => void
  onUpdatePayment: (id: string, data: Partial<LoanPayment>) => void
  onDeletePayment: (id: string) => void
  onDeleteLoan: (id: string) => void
}

export function LoanCard({
  loan, payments, onUpdateLoan, onAddPayment, onUpdatePayment, onDeletePayment, onDeleteLoan,
}: LoanCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [paymentFormOpen, setPaymentFormOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<LoanPayment | null>(null)
  const [deletePaymentId, setDeletePaymentId] = useState<string | null>(null)
  const [deleteLoanOpen, setDeleteLoanOpen] = useState(false)

  const payoffProgress = loan.original_principal > 0
    ? Math.round((loan.total_principal_paid / loan.original_principal) * 100)
    : 0

  const sortedPayments = [...payments]
    .filter((p) => p.loan_id === loan.id)
    .sort((a, b) => b.date.localeCompare(a.date))

  const latestPayment = sortedPayments[0]
  const monthlyPayment = latestPayment
    ? latestPayment.principal_paid + latestPayment.interest_paid
    : 0

  function handlePaymentSave(data: Omit<LoanPayment, 'id'>) {
    if (editingPayment) {
      onUpdatePayment(editingPayment.id, data)
      toast.success('Đã cập nhật thanh toán')
    } else {
      onAddPayment(data)
      toast.success('Đã thêm thanh toán mới')
    }
    setPaymentFormOpen(false)
    setEditingPayment(null)
  }

  function handleDeletePayment() {
    if (!deletePaymentId) return
    onDeletePayment(deletePaymentId)
    toast.success('Đã xóa thanh toán')
    setDeletePaymentId(null)
  }

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #1B2A4A' }}>
      {/* Loan header — always visible */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)] truncate">{loan.name}</p>
            <p className="text-sm text-[#EF4444] font-semibold mt-0.5">
              Dư nợ: {formatShortVND(loan.remaining_balance)}
              <span className="text-[#64748B] font-normal ml-2">· {formatPercent(loan.interest_rate)}/năm</span>
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => setEditOpen(true)} title="Chỉnh sửa"
              className="p-1.5 rounded hover:bg-[#E0F2EE] text-teal-600 transition-colors">
              <Pencil size={14} />
            </button>
            <button onClick={() => setDeleteLoanOpen(true)} title="Xóa khoản vay"
              className="p-1.5 rounded hover:bg-[#FDECEC] text-red-500 transition-colors">
              <Trash2 size={14} />
            </button>
            <button onClick={() => setExpanded((e) => !e)}
              className="p-1.5 rounded hover:bg-[#EBF0F7] text-[#1B2A4A] transition-colors ml-1">
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs text-[#64748B]">
            <span>Đã trả {payoffProgress}%</span>
            <span>{formatShortVND(loan.total_principal_paid)} / {formatShortVND(loan.original_principal)}</span>
          </div>
          <div className="h-2 rounded-full bg-[#E2E8F0]">
            <div className="h-2 rounded-full transition-all" style={{ width: `${payoffProgress}%`, backgroundColor: '#008080' }} />
          </div>
        </div>

        <div className="mt-2 flex gap-4 text-xs text-[#64748B]">
          <span>Lãi đã trả: <strong className="text-[#EF4444]">{formatShortVND(loan.total_interest_paid)}</strong></span>
          <span>Trả/tháng: <strong className="text-[#1B2A4A]">{formatShortVND(monthlyPayment)}</strong></span>
        </div>
      </div>

      {/* Expandable section */}
      {expanded && (
        <div className="border-t border-[#E2E8F0]">
          <div className="px-5 py-3 flex items-center justify-between bg-[#F5F7FA]">
            <span className="text-sm font-semibold text-[#1B2A4A]">Lịch sử thanh toán ({sortedPayments.length})</span>
            <Button size="sm" onClick={() => { setEditingPayment(null); setPaymentFormOpen(true) }}
              className="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90 gap-1 h-7 text-xs">
              <Plus size={12} /> Thêm thanh toán
            </Button>
          </div>
          {sortedPayments.length === 0 ? (
            <p className="px-5 py-4 text-sm text-[#64748B]">Chưa có thanh toán nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F5F7FA] hover:bg-[#F5F7FA]">
                    {['Ngày', 'Gốc trả', 'Lãi trả', 'Tổng trả', 'Dư nợ sau', ''].map((h) => (
                      <TableHead key={h} className="text-[#1B2A4A] font-bold text-xs">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPayments.map((p, idx) => (
                    <TableRow key={p.id} className={`hover:bg-[#F5F7FA] ${idx % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}>
                      <TableCell className="text-[#64748B] text-xs">{formatDate(p.date)}</TableCell>
                      <TableCell className="text-right font-semibold text-[#008080] text-xs">{formatVND(p.principal_paid)}</TableCell>
                      <TableCell className="text-right font-semibold text-[#EF4444] text-xs">{formatVND(p.interest_paid)}</TableCell>
                      <TableCell className="text-right font-bold text-[#1B2A4A] text-xs">{formatVND(p.principal_paid + p.interest_paid)}</TableCell>
                      <TableCell className="text-right text-[#64748B] text-xs">{formatShortVND(p.balance_after)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEditingPayment(p); setPaymentFormOpen(true) }} title="Chỉnh sửa"
                            className="p-1 rounded hover:bg-[#E0F2EE] text-teal-600 transition-colors">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => setDeletePaymentId(p.id)} title="Xóa"
                            className="p-1 rounded hover:bg-[#FDECEC] text-red-500 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      <LoanPaymentForm
        open={paymentFormOpen}
        onOpenChange={setPaymentFormOpen}
        onSave={handlePaymentSave}
        loan={loan}
        initial={editingPayment}
      />
      <LoanEditForm
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={(data) => { onUpdateLoan(loan.id, data); toast.success('Đã cập nhật khoản vay') }}
        loan={loan}
      />
      <DeleteConfirm
        open={!!deletePaymentId}
        onOpenChange={(o) => !o && setDeletePaymentId(null)}
        onConfirm={handleDeletePayment}
        label={deletePaymentId ? `thanh toán ngày ${formatDate(sortedPayments.find(p => p.id === deletePaymentId)?.date ?? '')}` : 'bản ghi này'}
      />
      <DeleteConfirm
        open={deleteLoanOpen}
        onOpenChange={setDeleteLoanOpen}
        onConfirm={() => { onDeleteLoan(loan.id); toast.success('Đã xóa khoản vay'); setDeleteLoanOpen(false) }}
        label={`khoản vay "${loan.name}"`}
      />
    </div>
  )
}
