import type {
  GoldHolding,
  FundTransaction,
  SavingsDeposit,
  UsdTransaction,
  InsurancePolicy,
  CashSnapshot,
} from '@/lib/types'
import { GoldCard, FundCard, SavingsCard } from './asset-detail-cards-gold-fund-savings'
import { UsdCard, InsuranceCard, CashCard } from './asset-detail-cards-usd-insurance-cash'

interface AssetDetailCardsProps {
  goldItems: GoldHolding[]
  fundItems: FundTransaction[]
  savingsItems: SavingsDeposit[]
  usdItems: UsdTransaction[]
  insuranceItems: InsurancePolicy[]
  cashItems: CashSnapshot[]
  goldPricePerChi: number
  usdRate: number
  fundNavs: Record<string, number>
}

export function AssetDetailCards({
  goldItems,
  fundItems,
  savingsItems,
  usdItems,
  insuranceItems,
  cashItems,
  goldPricePerChi,
  usdRate,
  fundNavs,
}: AssetDetailCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <GoldCard items={goldItems} goldPricePerChi={goldPricePerChi} />
      <FundCard items={fundItems} fundNavs={fundNavs} />
      <SavingsCard items={savingsItems} />
      <UsdCard items={usdItems} usdRate={usdRate} />
      <InsuranceCard items={insuranceItems} />
      <CashCard items={cashItems} />
    </div>
  )
}
