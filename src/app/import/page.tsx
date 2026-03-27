'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FileText, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileUpload } from '@/components/import/file-upload'
import { DataPreview } from '@/components/import/data-preview'
import { ImportModeToggle, ImportModeBanner, type ImportMode } from '@/components/import/import-mode-banner'
import { parseExcelFile, detectSheets } from '@/lib/import/excel-parser'
import type { ParsedData } from '@/lib/import/excel-parser'
import {
  ALL_IMPORT_KEYS,
  STORAGE_KEY_MAP,
  aggregateInsurancePolicies,
  backupBeforeImport,
  writeToLocalStorage,
  appendToLocalStorage,
  type DataKey,
} from '@/lib/import/import-storage-helpers'

type Step = 'idle' | 'file_selected' | 'parsing' | 'preview' | 'importing' | 'done'

export default function ImportPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [detectedSheets, setDetectedSheets] = useState<string[]>([])
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [selected, setSelected] = useState<Set<DataKey>>(new Set(ALL_IMPORT_KEYS))
  const [progress, setProgress] = useState(0)
  const [importCounts, setImportCounts] = useState<Record<string, number>>({})
  const [mode, setMode] = useState<ImportMode>('replace')

  const handleFileSelected = useCallback(async (f: File) => {
    setFile(f)
    setStep('file_selected')
    setParsedData(null)
    try {
      const buffer = await f.arrayBuffer()
      setDetectedSheets(detectSheets(buffer))
    } catch {
      setDetectedSheets([])
    }
  }, [])

  async function handleParse() {
    if (!file) return
    setStep('parsing')
    setProgress(10)
    try {
      const buffer = await file.arrayBuffer()
      setProgress(50)
      await new Promise((r) => setTimeout(r, 300))
      const data = parseExcelFile(buffer)
      setProgress(90)
      await new Promise((r) => setTimeout(r, 200))
      setParsedData(data)
      setSelected(new Set(ALL_IMPORT_KEYS.filter((k) => data[k].length > 0)))
      setProgress(100)
      setStep('preview')
    } catch (err) {
      console.error('Parse error:', err)
      toast.error('Không thể đọc file. Vui lòng kiểm tra định dạng.')
      setStep('file_selected')
      setProgress(0)
    }
  }

  function toggleKey(key: DataKey) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  async function handleImport() {
    if (!parsedData) return
    setStep('importing')
    setProgress(0)

    backupBeforeImport()
    toast.info('Đã sao lưu dữ liệu hiện tại trước khi import')

    const keys = ALL_IMPORT_KEYS.filter((k) => selected.has(k))
    const counts: Record<string, number> = {}
    const persist = mode === 'append' ? appendToLocalStorage : writeToLocalStorage

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      await new Promise((r) => setTimeout(r, 150))
      if (key === 'insurance') {
        const policies = aggregateInsurancePolicies(parsedData.insurance)
        persist(STORAGE_KEY_MAP[key], policies)
        counts[key] = policies.length
      } else {
        const data = parsedData[key]
        persist(STORAGE_KEY_MAP[key], data)
        counts[key] = data.length
      }
      setProgress(Math.round(((i + 1) / keys.length) * 100))
    }

    setImportCounts(counts)
    setStep('done')
    const summary = keys.filter((k) => counts[k] > 0).map((k) => `${counts[k]} ${k}`).join(', ')
    toast.success(`Import thành công: ${summary}`)
  }

  function handleReset() {
    setStep('idle')
    setFile(null)
    setDetectedSheets([])
    setParsedData(null)
    setSelected(new Set(ALL_IMPORT_KEYS))
    setProgress(0)
  }

  const totalRows = () =>
    parsedData ? ALL_IMPORT_KEYS.filter((k) => selected.has(k)).reduce((s, k) => s + parsedData[k].length, 0) : 0

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">
          Import dữ liệu
        </h1>
        <p className="text-sm text-[#64748B] mt-1">Tải lên file Excel hoặc CSV để import dữ liệu tài chính</p>
      </div>

      {/* Step 1: File upload */}
      <div className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">1. Chọn file</h2>
        </div>
        <div className="p-5 space-y-4">
          <FileUpload onFileSelected={handleFileSelected} disabled={step === 'parsing' || step === 'importing'} />
          {file && (
            <div className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-[#F5F7FA] p-3">
              <FileText className="size-5 text-[#008080] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1B2A4A] truncate">{file.name}</p>
                <p className="text-xs text-[#64748B]">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              {detectedSheets.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {detectedSheets.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs bg-[#E0F2EE] text-[#008080] border-0">{s}</Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Step 2: Parse */}
      {(step === 'file_selected' || step === 'parsing') && (
        <div className="rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">2. Đọc dữ liệu</h2>
          </div>
          <div className="p-5 space-y-4">
            {step === 'parsing' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <Loader2 className="size-4 animate-spin text-[#008080]" />
                  <span>Đang phân tích file...</span>
                </div>
                <div className="h-2 rounded-full bg-[#E2E8F0]">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: '#008080' }} />
                </div>
              </div>
            ) : (
              <Button onClick={handleParse} disabled={!file} className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white font-semibold">
                Phân tích file
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Preview & Import */}
      {(step === 'preview' || step === 'importing' || step === 'done') && parsedData && (
        <div className="rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-base font-bold text-[#1B2A4A] font-[family-name:var(--font-nunito)]">3. Xem trước &amp; Import</h2>
          </div>
          <div className="p-5 space-y-4">
            <DataPreview
              data={parsedData}
              selected={selected as Set<keyof ParsedData>}
              onToggle={(k) => toggleKey(k as DataKey)}
            />

            {step !== 'done' && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#1B2A4A]">Chế độ import:</span>
                  <ImportModeToggle mode={mode} onChange={setMode} disabled={step === 'importing'} />
                </div>
                <ImportModeBanner mode={mode} />
              </div>
            )}

            {step === 'importing' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <Loader2 className="size-4 animate-spin text-[#008080]" />
                  <span>Đang import...</span>
                </div>
                <div className="h-2 rounded-full bg-[#E2E8F0]">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: '#008080' }} />
                </div>
              </div>
            )}

            {step === 'done' ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#22C55E]">
                  <CheckCircle2 className="size-4" />
                  Import hoàn tất — đã lưu {Object.values(importCounts).reduce((a, b) => a + b, 0)} bản ghi
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(importCounts).filter(([, n]) => n > 0).map(([k, n]) => (
                    <span key={k} className="inline-flex items-center gap-1 rounded-md bg-[#E0F2EE] px-2 py-1 text-xs font-semibold text-[#008080]">
                      {k}: {n}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={() => router.push('/')} className="bg-[#008080] hover:bg-[#008080]/90 text-white font-semibold">
                    Đi đến Dashboard
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset} className="border-[#008080] text-[#008080] hover:bg-[#E0F2EE]">
                    Import file khác
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleImport}
                  disabled={selected.size === 0 || step === 'importing'}
                  className="bg-[#1B2A4A] hover:bg-[#1B2A4A]/90 text-white font-semibold"
                >
                  Import tất cả ({totalRows()} dòng)
                </Button>
                <Button variant="outline" onClick={handleReset} className="border-[#E2E8F0] text-[#64748B] hover:bg-[#F5F7FA]">
                  Hủy
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
