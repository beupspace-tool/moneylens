"use client"

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Download, Upload, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

// ---- Export helpers --------------------------------------------------------

function exportAllData() {
  const data: Record<string, unknown> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('moneylens_')) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key) || 'null')
      } catch {
        data[key] = localStorage.getItem(key)
      }
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `moneylens-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importAllData(file: File, onDone: () => void) {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string)
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value))
      })
      onDone()
      window.location.reload()
    } catch {
      toast.error('File không hợp lệ, vui lòng kiểm tra lại')
    }
  }
  reader.readAsText(file)
}

function clearAllData() {
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('moneylens_')) keysToRemove.push(key)
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k))
  window.location.reload()
}

// ---- Component -------------------------------------------------------------

export function DataManagementSection() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [resetDialog, setResetDialog] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  function handleExport() {
    exportAllData()
    toast.success('Đã xuất dữ liệu thành công')
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    toast.loading('Đang nhập dữ liệu...')
    importAllData(file, () => toast.success('Đã nhập dữ liệu thành công'))
    e.target.value = ''
  }

  function handleReset() {
    if (confirmText !== 'XÓA') return
    clearAllData()
  }

  return (
    <section className="rounded-xl bg-white shadow-sm overflow-hidden">
      {/* Section header with navy left border accent */}
      <div className="border-l-4 border-[#1B2A4A] px-5 py-4 bg-[#EBF0F7]">
        <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          Quản lý dữ liệu
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Xuất, nhập hoặc xóa toàn bộ dữ liệu MoneyLens
        </p>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Export */}
        <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[#1B2A4A]">Xuất dữ liệu (JSON)</p>
            <p className="text-xs text-[#64748B]">Tải về toàn bộ dữ liệu dưới dạng file JSON</p>
          </div>
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-[#008080] text-[#008080] hover:bg-[#F0FAF9] gap-2 shrink-0"
          >
            <Download size={15} /> Xuất dữ liệu
          </Button>
        </div>

        {/* Import */}
        <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[#1B2A4A]">Nhập dữ liệu (JSON)</p>
            <p className="text-xs text-[#64748B]">Khôi phục từ file backup — sẽ ghi đè dữ liệu hiện tại</p>
          </div>
          <Button
            variant="outline"
            onClick={handleImportClick}
            className="border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#EBF0F7] gap-2 shrink-0"
          >
            <Upload size={15} /> Nhập dữ liệu
          </Button>
        </div>

        {/* Reset */}
        <div className="flex items-center justify-between rounded-lg border border-[#FDECEC] px-4 py-3 bg-[#FFF8F8]">
          <div>
            <p className="text-sm font-semibold text-[#EF4444]">Xóa tất cả dữ liệu</p>
            <p className="text-xs text-[#64748B]">Xóa vĩnh viễn toàn bộ dữ liệu — không thể hoàn tác</p>
          </div>
          <Button
            variant="outline"
            onClick={() => { setConfirmText(''); setResetDialog(true) }}
            className="border-[#EF4444] text-[#EF4444] hover:bg-[#FDECEC] gap-2 shrink-0"
          >
            <Trash2 size={15} /> Xóa tất cả
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Destructive confirm dialog */}
      <Dialog open={resetDialog} onOpenChange={setResetDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#EF4444]">Xóa tất cả dữ liệu?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1 text-sm text-[#1B2A4A]">
            <p>
              Hành động này sẽ <strong>xóa vĩnh viễn</strong> toàn bộ dữ liệu MoneyLens trong trình duyệt. Không thể hoàn tác.
            </p>
            <p className="text-xs text-[#64748B]">
              Gõ <strong className="font-mono text-[#EF4444]">XÓA</strong> để xác nhận:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="XÓA"
              className="w-full rounded-md border border-[#E2E8F0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialog(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleReset}
              disabled={confirmText !== 'XÓA'}
              className="bg-[#EF4444] text-white hover:bg-[#DC2626] disabled:opacity-40"
            >
              Xóa tất cả
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
