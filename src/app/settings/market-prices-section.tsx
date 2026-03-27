"use client"

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSettings } from '@/lib/store/use-settings'
import { FUND_CODES } from '@/lib/constants'
import { formatVND, formatDate } from '@/lib/format'

export function MarketPricesSection() {
  const { settings, updateGoldPrice, updateExchangeRate, updateAllFundNavs } = useSettings()

  const [goldInput, setGoldInput] = useState(String(settings.gold_price_per_chi))
  const [rateInput, setRateInput] = useState(String(settings.usd_vnd_rate))
  const [navInputs, setNavInputs] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(settings.fund_navs).map(([k, v]) => [k, String(v)])
    )
  )

  function handleSave() {
    const goldPrice = Number(goldInput.replace(/[^\d]/g, ''))
    const rate = Number(rateInput.replace(/[^\d]/g, ''))
    if (!goldPrice || !rate) {
      toast.error('Vui lòng nhập giá hợp lệ')
      return
    }
    updateGoldPrice(goldPrice)
    updateExchangeRate(rate)
    const navs: Record<string, number> = {}
    for (const [code, raw] of Object.entries(navInputs)) {
      const val = Number(raw.replace(/[^\d]/g, ''))
      navs[code] = val || settings.fund_navs[code] || 0
    }
    updateAllFundNavs(navs)
    toast.success('Đã lưu giá thị trường')
  }

  return (
    <section className="rounded-xl bg-white shadow-sm overflow-hidden">
      {/* Section header with teal left border accent */}
      <div className="border-l-4 border-[#008080] px-5 py-4 bg-[#F0FAF9]">
        <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          Giá thị trường
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Cập nhật lần cuối:{' '}
          <span className="font-semibold text-[#008080]">{formatDate(settings.last_updated)}</span>
        </p>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Gold price */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[#1B2A4A]">
              Giá vàng / chỉ
            </Label>
            <Input
              type="text"
              value={goldInput}
              onChange={(e) => setGoldInput(e.target.value)}
              placeholder="15600000"
              className="border-[#E2E8F0] focus-visible:ring-teal-500"
            />
            <p className="text-xs text-[#64748B]">
              Hiện tại: <span className="text-[#D4A843] font-semibold">{formatVND(settings.gold_price_per_chi)}</span>
            </p>
          </div>

          {/* USD/VND rate */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[#1B2A4A]">
              Tỷ giá USD/VND
            </Label>
            <Input
              type="text"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              placeholder="26312"
              className="border-[#E2E8F0] focus-visible:ring-teal-500"
            />
            <p className="text-xs text-[#64748B]">
              Hiện tại: <span className="text-[#008080] font-semibold">1 USD = {Number(settings.usd_vnd_rate).toLocaleString('vi-VN')} VND</span>
            </p>
          </div>
        </div>

        {/* Fund NAVs table */}
        <div>
          <h3 className="text-sm font-semibold text-[#1B2A4A] mb-2">NAV hiện tại theo quỹ</h3>
          <div className="rounded-lg border border-[#E2E8F0] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F7FA]">
                  <th className="text-left px-3 py-2 font-semibold text-[#1B2A4A] w-28">Mã quỹ</th>
                  <th className="text-left px-3 py-2 font-semibold text-[#1B2A4A]">Tên quỹ</th>
                  <th className="text-right px-3 py-2 font-semibold text-[#1B2A4A] w-36">NAV (VND)</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(settings.fund_navs).map((code, idx) => (
                  <tr
                    key={code}
                    className={`border-t border-[#E2E8F0] ${idx % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}
                  >
                    <td className="px-3 py-1.5 font-mono font-bold text-[#008080]">{code}</td>
                    <td className="px-3 py-1.5 text-[#64748B] text-xs">{FUND_CODES[code] ?? code}</td>
                    <td className="px-3 py-1.5 text-right">
                      <Input
                        type="text"
                        value={navInputs[code] ?? ''}
                        onChange={(e) => setNavInputs((prev) => ({ ...prev, [code]: e.target.value }))}
                        className="h-7 text-right text-sm border-[#E2E8F0] focus-visible:ring-teal-500 w-32 ml-auto"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-[#008080] text-white hover:bg-[#006666] px-6"
          >
            Lưu
          </Button>
        </div>
      </div>
    </section>
  )
}
