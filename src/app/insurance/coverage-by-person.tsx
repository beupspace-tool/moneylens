"use client"

import { Shield, Heart, User } from 'lucide-react'
import { formatShortVND } from '@/lib/format'
import type { InsurancePolicy } from '@/lib/types'
import { INSURANCE_RELATIONSHIPS } from '@/lib/constants'

interface PersonCoverage {
  name: string
  relationship: string
  totalDeathCover: number
  totalAccidentCover: number
  hospitalDaily: number
  policyCount: number
  policies: string[]
}

function aggregateByPerson(policies: InsurancePolicy[]): PersonCoverage[] {
  const map = new Map<string, PersonCoverage>()

  for (const p of policies) {
    if ((p.status ?? 'active') !== 'active') continue
    const persons = p.insured_persons ?? [{ name: 'Chưa xác định', relationship: 'self' }]

    for (const person of persons) {
      const key = person.name
      if (!map.has(key)) {
        map.set(key, {
          name: person.name,
          relationship: person.relationship,
          totalDeathCover: 0,
          totalAccidentCover: 0,
          hospitalDaily: 0,
          policyCount: 0,
          policies: [],
        })
      }
      const entry = map.get(key)!
      entry.policyCount++
      entry.policies.push(p.product_name)

      for (const b of p.benefits ?? []) {
        if (b.type === 'death' && b.amount) entry.totalDeathCover += b.amount
        if (b.type === 'accident' && b.amount) entry.totalAccidentCover += b.amount
        if (b.type === 'hospital' && b.amount) entry.hospitalDaily += b.amount
      }

      for (const r of p.riders ?? []) {
        if (r.insured === person.name && r.coverage) {
          if (r.name.toLowerCase().includes('tử vong') || r.name.toLowerCase().includes('thương tật')) {
            entry.totalAccidentCover += r.coverage
          }
        }
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalDeathCover - a.totalDeathCover)
}

const RELATIONSHIP_ICONS: Record<string, typeof Shield> = {
  self: Shield,
  mother: Heart,
  father: User,
  spouse: Heart,
  child: User,
}

const RELATIONSHIP_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
  self: { bg: '#EBF0F7', border: '#1B2A4A', icon: '#1B2A4A' },
  mother: { bg: '#E0F2EE', border: '#008080', icon: '#008080' },
  father: { bg: '#FDF4E0', border: '#D4A843', icon: '#D4A843' },
  spouse: { bg: '#E0F2EE', border: '#008080', icon: '#008080' },
  child: { bg: '#EBF0F7', border: '#1B2A4A', icon: '#1B2A4A' },
}

function getRelLabel(rel: string) {
  return INSURANCE_RELATIONSHIPS.find(r => r.value === rel)?.label ?? rel
}

interface Props {
  policies: InsurancePolicy[]
}

export function CoverageByPerson({ policies }: Props) {
  const persons = aggregateByPerson(policies)
  if (persons.length === 0) return null

  return (
    <div>
      <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)] mb-3">
        Bảo vệ theo người
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {persons.map((person) => {
          const colors = RELATIONSHIP_COLORS[person.relationship] ?? RELATIONSHIP_COLORS.self
          const Icon = RELATIONSHIP_ICONS[person.relationship] ?? Shield
          return (
            <div key={person.name} className="rounded-xl p-4 shadow-sm"
              style={{ backgroundColor: colors.bg, borderLeft: `4px solid ${colors.border}` }}>
              <div className="flex items-center gap-2 mb-3">
                <Icon size={18} style={{ color: colors.icon }} />
                <div>
                  <p className="font-bold text-[#1B2A4A] text-sm leading-tight">{person.name}</p>
                  <p className="text-xs text-[#64748B]">{getRelLabel(person.relationship)} · {person.policyCount} HĐ</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {person.totalDeathCover > 0 && (
                  <Row label="Tử vong" value={formatShortVND(person.totalDeathCover)} />
                )}
                {person.totalAccidentCover > 0 && (
                  <Row label="Tai nạn" value={formatShortVND(person.totalAccidentCover)} />
                )}
                {person.hospitalDaily > 0 && (
                  <Row label="Nằm viện" value={`${formatShortVND(person.hospitalDaily)}/ngày`} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#64748B]">{label}</span>
      <span className="font-bold text-[#1B2A4A]">{value}</span>
    </div>
  )
}
