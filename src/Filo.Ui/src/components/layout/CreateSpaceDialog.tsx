import { useState, useRef, useEffect, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { useSpacesStore } from '@/store/spacesStore'

interface CreateSpaceDialogProps {
  open: boolean
  onClose: () => void
}

export function CreateSpaceDialog({ open, onClose }: CreateSpaceDialogProps) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const addSpace = useSpacesStore((s) => s.addSpace)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  if (!open) return null

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    addSpace(trimmed)
    setName('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-sm bg-canvas p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-feature-heading text-ink">Create Space</h2>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-xs text-muted transition-colors hover:bg-soft-stone hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Space name"
            className="flex h-9 w-full rounded-xs border border-hairline bg-canvas px-3 py-1 text-body text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-form-focus"
          />

          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-1 py-1 text-caption text-muted transition-colors hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="rounded-pill bg-primary px-5 py-[7px] text-button text-on-primary transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
