'use client'

import { useCallback, useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelected: (file: File) => void
  disabled?: boolean
}

const ACCEPTED = ['.xlsx', '.csv']
const MAX_SIZE_MB = 20

export function FileUpload({ onFileSelected, disabled }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function validateFile(file: File): string | null {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ACCEPTED.includes(ext)) {
      return `Định dạng không hỗ trợ. Vui lòng chọn file .xlsx hoặc .csv`
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File quá lớn. Tối đa ${MAX_SIZE_MB}MB`
    }
    return null
  }

  function handleFile(file: File) {
    const err = validateFile(file)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    onFileSelected(file)
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled) return
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        aria-label="Tải file lên"
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-colors cursor-pointer',
          isDragging
            ? 'border-[#008080] bg-[#E0F2EE]/40'
            : 'border-[#008080]/40 hover:border-[#008080] hover:bg-[#E0F2EE]/20',
          disabled && 'pointer-events-none opacity-50'
        )}
      >
        <UploadCloud className={cn('size-10', isDragging ? 'text-[#008080]' : 'text-[#008080]/60')} />
        <div className="text-center">
          <p className="text-sm font-semibold text-[#1B2A4A]">
            Kéo thả file vào đây hoặc nhấn để chọn
          </p>
          <p className="mt-1 text-xs text-[#64748B]">
            Hỗ trợ .xlsx, .csv — tối đa {MAX_SIZE_MB}MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>
      {error && <p className="text-xs text-[#EF4444]">{error}</p>}
    </div>
  )
}
