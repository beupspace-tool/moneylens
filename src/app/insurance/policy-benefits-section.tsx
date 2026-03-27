"use client"

import { formatVND, formatShortVND } from '@/lib/format'
import { INSURANCE_BENEFIT_TYPES, INSURANCE_PRODUCT_TYPES } from '@/lib/constants'
import type { InsuranceBenefit, InsuranceRider, InsuredPerson } from '@/lib/types'

function getBenefitLabel(type: string) {
  return INSURANCE_BENEFIT_TYPES.find(t => t.value === type)?.label ?? type
}

function getProductTypeLabel(type: string) {
  return INSURANCE_PRODUCT_TYPES.find(t => t.value === type)?.label ?? type
}

const BENEFIT_COLORS: Record<string, string> = {
  death: '#EF4444',
  accident: '#F59E0B',
  critical_illness: '#8B5CF6',
  hospital: '#008080',
  disability: '#EC4899',
  maturity: '#22C55E',
  other: '#64748B',
}

interface Props {
  benefits?: InsuranceBenefit[]
  riders?: InsuranceRider[]
  insuredPersons?: InsuredPerson[]
  productType?: string
  policyNumber?: string
  maturityDate?: string
  basePremium?: number
  riderPremium?: number
}

export function PolicyBenefitsSection({
  benefits, riders, insuredPersons, productType,
  policyNumber, maturityDate, basePremium, riderPremium,
}: Props) {
  const hasDetails = benefits?.length || riders?.length || insuredPersons?.length || productType

  if (!hasDetails) {
    return (
      <p className="text-sm text-[#94A3B8] italic py-2">
        Chưa có thông tin chi tiết. Nhấn chỉnh sửa để bổ sung.
      </p>
    )
  }

  return (
    <div className="space-y-4 pt-1">
      {/* Policy meta */}
      {(policyNumber || productType || maturityDate) && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {policyNumber && <Meta label="Số HĐ" value={policyNumber} />}
          {productType && <Meta label="Loại" value={getProductTypeLabel(productType)} />}
          {maturityDate && <Meta label="Đáo hạn" value={new Date(maturityDate).toLocaleDateString('vi-VN')} />}
          {basePremium != null && riderPremium != null && (
            <Meta label="Phí" value={`${formatShortVND(basePremium)} cơ bản + ${formatShortVND(riderPremium)} bổ trợ`} />
          )}
        </div>
      )}

      {/* Benefits */}
      {benefits && benefits.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">Quyền lợi bảo hiểm</p>
          <div className="space-y-1.5">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1 w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: BENEFIT_COLORS[b.type] ?? '#64748B' }} />
                <div className="flex-1 flex justify-between gap-2">
                  <span className="text-[#1B2A4A]">
                    {b.description}
                    {b.note && <span className="text-[#94A3B8] ml-1">({b.note})</span>}
                  </span>
                  {b.amount && (
                    <span className="font-bold text-[#1B2A4A] shrink-0">{formatShortVND(b.amount)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Riders */}
      {riders && riders.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-2">Sản phẩm bổ trợ</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#64748B] text-xs">
                  <th className="text-left font-medium pb-1">Tên</th>
                  <th className="text-left font-medium pb-1">Người được BH</th>
                  <th className="text-right font-medium pb-1">Mức BH</th>
                  <th className="text-right font-medium pb-1">Phí/năm</th>
                </tr>
              </thead>
              <tbody>
                {riders.map((r, i) => (
                  <tr key={i} className="border-t border-[#F1F5F9]">
                    <td className="py-1.5 text-[#1B2A4A]">{r.name}</td>
                    <td className="py-1.5 text-[#64748B]">{r.insured}</td>
                    <td className="py-1.5 text-right font-semibold text-[#1B2A4A]">
                      {r.coverage ? formatShortVND(r.coverage) : '—'}
                    </td>
                    <td className="py-1.5 text-right text-[#1B2A4A]">{formatVND(r.premium)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <span className="text-[#94A3B8]">{label}: </span>
      <span className="text-[#1B2A4A] font-medium">{value}</span>
    </span>
  )
}
