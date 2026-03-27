'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, NAV_BOTTOM_ITEMS } from '@/lib/constants'

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col h-full transition-all duration-200 ease-in-out shrink-0',
        'shadow-[4px_0_24px_rgba(0,0,0,0.15)]',
        collapsed ? 'w-16' : 'w-60'
      )}
      style={{ backgroundColor: '#1B2A4A' }}
    >
      {/* Logo area */}
      <div
        className={cn(
          'flex items-center border-b px-3 py-4',
          collapsed ? 'justify-center' : 'justify-between'
        )}
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* BEUP white logo */}
            <img
              src="https://beup.space/wp-content/uploads/2023/06/logo-white.png"
              alt="BEUP Logo"
              className="h-7 w-auto shrink-0 object-contain"
            />
            <div className="flex flex-col leading-tight overflow-hidden">
              <span
                className="font-extrabold text-sm truncate"
                style={{ fontFamily: 'Nunito, sans-serif', color: '#D4A843' }}
              >
                MoneyLens
              </span>
              <span
                className="text-[10px] font-medium truncate"
                style={{ color: '#5BA4A4' }}
              >
                by BEUP
              </span>
            </div>
          </div>
        )}

        {/* Collapsed: show logo icon only */}
        {collapsed && (
          <img
            src="https://beup.space/wp-content/uploads/2023/06/logo-white.png"
            alt="BEUP Logo"
            className="h-6 w-auto object-contain"
          />
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={cn(
            'rounded-md p-1 transition-colors duration-200 shrink-0',
            collapsed && 'mx-auto mt-0'
          )}
          style={{ color: '#5BA4A4' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#D4A843')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#5BA4A4')}
          aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={Icon}
              isActive={isActive}
              collapsed={collapsed}
            />
          )
        })}
      </nav>

      {/* Bottom navigation — import & settings */}
      <div
        className="border-t py-3 px-2 space-y-0.5"
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
      >
        {NAV_BOTTOM_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={Icon}
              isActive={isActive}
              collapsed={collapsed}
            />
          )
        })}
      </div>
    </aside>
  )
}

// ---------------------------------------------------------------------------
// NavItem sub-component keeps the sidebar file focused and under 200 lines
// ---------------------------------------------------------------------------

interface NavItemProps {
  href: string
  label: string
  icon: React.ElementType
  isActive: boolean
  collapsed: boolean
}

function NavItem({ href, label, icon: Icon, isActive, collapsed }: NavItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        'group relative flex items-center gap-3 rounded-r-md px-2 py-2 text-sm transition-all duration-200',
        // Active: gold left border + slightly lighter navy bg
        isActive
          ? 'border-l-2 pl-[6px] font-semibold'
          : 'border-l-2 border-transparent pl-[6px]',
        collapsed && 'justify-center px-2'
      )}
      style={{
        borderLeftColor: isActive ? '#D4A843' : 'transparent',
        backgroundColor: isActive ? 'rgba(212,168,67,0.12)' : 'transparent',
        color: isActive ? '#D4A843' : '#FFFFFF',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'
          e.currentTarget.style.color = '#5BA4A4'
          const svg = e.currentTarget.querySelector('svg')
          if (svg) svg.style.color = '#5BA4A4'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = '#FFFFFF'
          const svg = e.currentTarget.querySelector('svg')
          if (svg) svg.style.color = '#5BA4A4'
        }
      }}
    >
      <Icon
        className="size-4 shrink-0 transition-colors duration-200"
        style={{ color: isActive ? '#D4A843' : '#5BA4A4' }}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  )
}
