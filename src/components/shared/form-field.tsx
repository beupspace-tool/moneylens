"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FormFieldProps {
  label: string
  type?: 'text' | 'number' | 'date' | 'select'
  value: string | number
  onChange: (value: string) => void
  options?: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
}

export function FormField({
  label,
  type = 'text',
  value,
  onChange,
  options = [],
  placeholder,
  required,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-[#1B2A4A]">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {type === 'select' ? (
        <Select value={String(value)} onValueChange={(val) => onChange(val ?? '')}>
          <SelectTrigger className="border-[#E2E8F0] focus:ring-teal-500">
            <SelectValue placeholder={placeholder ?? `Chọn ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="border-[#E2E8F0] focus-visible:ring-teal-500"
        />
      )}
    </div>
  )
}
