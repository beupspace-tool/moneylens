"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface CrudDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  onSubmit: () => void
  submitLabel?: string
}

export function CrudDialog({
  open,
  onOpenChange,
  title,
  children,
  onSubmit,
  submitLabel = 'Lưu',
}: CrudDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#1B2A4A] font-extrabold font-[family-name:var(--font-nunito)]">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">{children}</div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#E2E8F0] text-[#64748B]"
          >
            Hủy
          </Button>
          <Button
            onClick={onSubmit}
            className="bg-[#1B2A4A] text-white hover:bg-[#1B2A4A]/90"
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
