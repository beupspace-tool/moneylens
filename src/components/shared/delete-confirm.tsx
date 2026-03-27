"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteConfirmProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  label?: string
}

export function DeleteConfirm({
  open,
  onOpenChange,
  onConfirm,
  label = 'bản ghi này',
}: DeleteConfirmProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl max-w-sm bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#1B2A4A] font-extrabold font-[family-name:var(--font-nunito)]">
            Xác nhận xóa
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[#64748B]">
          Bạn có chắc muốn xóa <span className="font-semibold text-[#1B2A4A]">{label}</span>? Hành động này không thể hoàn tác.
        </p>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#E2E8F0] text-[#64748B]"
          >
            Hủy
          </Button>
          <Button
            onClick={() => { onConfirm(); onOpenChange(false) }}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
