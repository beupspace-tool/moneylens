'use client'

export type ImportMode = 'replace' | 'append'

interface ImportModeToggleProps {
  mode: ImportMode
  onChange: (mode: ImportMode) => void
  disabled?: boolean
}

// Toggle: two side-by-side buttons, teal active state
export function ImportModeToggle({ mode, onChange, disabled }: ImportModeToggleProps) {
  return (
    <div className="flex items-center gap-0 rounded-lg border border-[#E2E8F0] overflow-hidden w-fit">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('replace')}
        className={`px-4 py-2 text-xs font-semibold transition-colors
          ${mode === 'replace'
            ? 'bg-[#008080] text-white'
            : 'bg-white text-[#64748B] hover:bg-[#F5F7FA]'
          }
          disabled:opacity-50 disabled:pointer-events-none`}
      >
        Thay thế
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('append')}
        className={`px-4 py-2 text-xs font-semibold transition-colors border-l border-[#E2E8F0]
          ${mode === 'append'
            ? 'bg-[#008080] text-white'
            : 'bg-white text-[#64748B] hover:bg-[#F5F7FA]'
          }
          disabled:opacity-50 disabled:pointer-events-none`}
      >
        Thêm vào
      </button>
    </div>
  )
}

interface ImportModeBannerProps {
  mode: ImportMode
}

// Warning/info banner describing the current import mode
export function ImportModeBanner({ mode }: ImportModeBannerProps) {
  if (mode === 'replace') {
    return (
      <div
        className="flex items-start gap-2 rounded-lg border px-4 py-3 text-xs"
        style={{ backgroundColor: '#FDF4E0', borderColor: '#D4A017' }}
      >
        <span className="font-bold text-[#B45309] shrink-0">Lưu ý:</span>
        <span className="text-[#92400E]">
          Dữ liệu hiện tại sẽ bị thay thế. Bản sao lưu tự động sẽ được tạo trước khi import.
        </span>
      </div>
    )
  }
  return (
    <div
      className="flex items-start gap-2 rounded-lg border px-4 py-3 text-xs"
      style={{ backgroundColor: '#E0F2EE', borderColor: '#008080' }}
    >
      <span className="font-bold text-[#008080] shrink-0">Thêm vào:</span>
      <span className="text-[#065F46]">
        Dữ liệu mới sẽ được thêm vào dữ liệu hiện tại. Bản sao lưu tự động sẽ được tạo trước khi import.
      </span>
    </div>
  )
}
