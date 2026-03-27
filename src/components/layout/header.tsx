'use client'

import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'
import { NAV_ITEMS, NAV_BOTTOM_ITEMS } from '@/lib/constants'

// Resolve page title from current pathname
function getPageTitle(pathname: string): string {
  const allItems = [...NAV_ITEMS, ...NAV_BOTTOM_ITEMS]
  const match = allItems.find((item) => item.href === pathname)
  return match?.label ?? 'MoneyLens'
}

// Format current date in Vietnamese locale
function getVietnameseDate(): string {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date())
}

interface HeaderProps {
  alertCount?: number
}

export function Header({ alertCount = 0 }: HeaderProps) {
  const pathname = usePathname()
  const title = getPageTitle(pathname)
  const currentDate = getVietnameseDate()

  return (
    <header
      className="flex h-14 items-center justify-between px-6 shrink-0"
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      {/* Left: page title + date */}
      <div className="flex flex-col justify-center leading-tight">
        <h1
          className="text-lg leading-tight"
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
            color: '#1B2A4A',
          }}
        >
          {title}
        </h1>
        <p
          className="text-xs capitalize"
          style={{ color: '#64748B' }}
        >
          {currentDate}
        </p>
      </div>

      {/* Right: notification bell + user avatar */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="relative rounded-lg p-2 transition-colors duration-200"
          style={{ color: '#64748B' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F5F7FA'
            e.currentTarget.style.color = '#1B2A4A'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#64748B'
          }}
          aria-label="Thông báo"
        >
          <Bell className="size-5" />
          {alertCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[10px] font-bold leading-none text-white"
              style={{ backgroundColor: '#D4A843' }}
            >
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </button>

        {/* User avatar with initials */}
        <button
          className="flex size-8 items-center justify-center rounded-full text-xs font-bold text-white transition-opacity duration-200 hover:opacity-80"
          style={{ backgroundColor: '#1B2A4A', fontFamily: 'Nunito, sans-serif' }}
          aria-label="Tài khoản"
        >
          TT
        </button>
      </div>
    </header>
  )
}
