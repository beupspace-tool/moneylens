"use client"

import { MarketPricesSection } from './market-prices-section'
import { DataManagementSection } from './data-management-section'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          Cài đặt
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Cập nhật giá thị trường và quản lý dữ liệu ứng dụng
        </p>
      </div>

      <MarketPricesSection />
      <DataManagementSection />
    </div>
  )
}
