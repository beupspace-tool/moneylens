'use client'

import { PortfolioSummaryCards } from '@/components/dashboard/portfolio-summary-cards'
import { AssetAllocationChart } from '@/components/dashboard/asset-allocation-chart'
import { NetWorthChart } from '@/components/dashboard/net-worth-chart'
import { AssetDetailCards } from '@/components/dashboard/asset-detail-cards'
import { QuickInfoCards } from '@/components/dashboard/quick-info-cards'
import {
  useGoldStore,
  useFundStore,
  useSavingsStore,
  useUsdStore,
  useInsuranceStore,
  useSubscriptionStore,
  useCashStore,
  useLoanStore,
  useLoanPaymentStore,
} from '@/lib/store/use-store'
import { useSettings } from '@/lib/store/use-settings'

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
        {title}
      </h2>
      <div className="mt-1 h-0.5 w-10 rounded-full bg-[#008080]" />
    </div>
  )
}

export default function DashboardPage() {
  const { settings } = useSettings()
  const { items: goldItems } = useGoldStore()
  const { items: fundItems } = useFundStore()
  const { items: savingsItems } = useSavingsStore()
  const { items: usdItems } = useUsdStore()
  const { items: insuranceItems } = useInsuranceStore()
  const { items: subItems } = useSubscriptionStore()
  const { items: cashItems } = useCashStore()
  const { items: loans } = useLoanStore()
  useLoanPaymentStore() // ensure loan payment store is initialized

  // --- Asset calculations using settings prices ---
  const goldTotal = goldItems.reduce(
    (s, g) => s + g.qty_chi * (settings.gold_price_per_chi ?? 0),
    0
  )

  // Fund value: sum(buy.qty - sell.qty) * NAV for each code, fallback to sum(amount_vnd)
  const fundTotal = (() => {
    const byCode: Record<string, { netQty: number; invested: number }> = {}
    for (const f of fundItems) {
      if (!byCode[f.fund_code]) byCode[f.fund_code] = { netQty: 0, invested: 0 }
      const isBuy = (f.transaction_type ?? 'buy') === 'buy'
      byCode[f.fund_code].netQty += isBuy ? (f.qty_units ?? 0) : -(f.qty_units ?? 0)
      byCode[f.fund_code].invested += isBuy ? f.amount_vnd : -f.amount_vnd
    }
    let total = 0
    for (const [code, { netQty, invested }] of Object.entries(byCode)) {
      const nav = settings.fund_navs?.[code]
      total += nav != null ? netQty * nav : invested
    }
    return total
  })()

  const savingsTotal = savingsItems
    .filter((d) => d.status === 'active')
    .reduce((s, d) => s + d.amount, 0)

  const cashTotal = cashItems.reduce((s, c) => s + c.amount, 0)

  // USD: only sum items where status !== 'converted'
  const holdingUsdItems = usdItems.filter((u) => (u.status ?? 'holding') !== 'converted')
  const usdVnd = holdingUsdItems.reduce(
    (s, u) => s + u.amount_usd * (settings.usd_vnd_rate ?? 0),
    0
  )

  const insuranceTotal = insuranceItems.reduce((s, p) => s + (p.total_paid ?? 0), 0)

  const totalAssets = goldTotal + fundTotal + savingsTotal + cashTotal + usdVnd + insuranceTotal

  // --- Debt calculation ---
  const totalDebt = loans.reduce((s, l) => s + (l.remaining_balance ?? 0), 0)

  // --- Net worth ---
  const netWorth = totalAssets - totalDebt

  // --- USD summary for sub-components ---
  const totalUsdHolding = holdingUsdItems.reduce((s, u) => s + u.amount_usd, 0)

  const allocationData = [
    { name: 'Vàng', key: 'gold', value: goldTotal },
    { name: 'CCQ', key: 'funds', value: fundTotal },
    { name: 'Tiết kiệm', key: 'savings', value: savingsTotal },
    { name: 'Tiền mặt', key: 'cash', value: cashTotal },
    { name: 'USD', key: 'usd', value: usdVnd },
    { name: 'Bảo hiểm', key: 'insurance', value: insuranceTotal },
  ].filter((d) => d.value > 0)

  // Count distinct asset channels with non-zero values
  const channelCount = [
    goldTotal > 0,
    fundTotal > 0,
    savingsTotal > 0,
    usdVnd > 0,
    insuranceTotal > 0,
    cashTotal > 0,
  ].filter(Boolean).length

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)] tracking-tight">
          Xin chào, Trang
        </h1>
        <p className="text-sm text-[#64748B] mt-0.5">Tổng quan tài chính cá nhân</p>
      </div>

      {/* Row 1: Summary cards */}
      <section>
        <SectionHeader title="Tổng quan danh mục" />
        <PortfolioSummaryCards
          totalAssets={totalAssets}
          netWorth={netWorth}
          totalDebt={totalDebt}
          channels={channelCount}
          usdRate={settings.usd_vnd_rate}
        />
      </section>

      {/* Row 2: Charts */}
      <section>
        <SectionHeader title="Phân tích & Tăng trưởng" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AssetAllocationChart data={allocationData} total={totalAssets} totalDebt={totalDebt} />
          <NetWorthChart liveNetWorth={netWorth} />
        </div>
      </section>

      {/* Row 3: Asset detail cards */}
      <section>
        <SectionHeader title="Chi tiết tài sản" />
        <AssetDetailCards
          goldItems={goldItems}
          fundItems={fundItems}
          savingsItems={savingsItems}
          usdItems={usdItems}
          insuranceItems={insuranceItems}
          cashItems={cashItems}
          goldPricePerChi={settings.gold_price_per_chi}
          usdRate={settings.usd_vnd_rate}
          fundNavs={settings.fund_navs ?? {}}
        />
      </section>

      {/* Row 4: Quick info */}
      <section>
        <SectionHeader title="Thông tin nhanh" />
        <QuickInfoCards
          loans={loans}
          subItems={subItems}
          savingsItems={savingsItems}
          insuranceItems={insuranceItems}
          usdItems={usdItems}
          totalUsdHolding={totalUsdHolding}
          usdRate={settings.usd_vnd_rate}
        />
      </section>
    </div>
  )
}
