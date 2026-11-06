import { useState } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAppData } from '../../context/useAppData'
import { Button } from '../common/Button'
import { Modal } from '../common/Modal'

export function DeleteGuidelineModal({ open, onClose, guideline, onDeleted }) {
  const { deleteGuideline, reviews } = useAppData()
  const [deleting, setDeleting] = useState(false)

  if (!guideline) return null
  const usage = reviews.filter((review) => review.guidelines.includes(guideline.id)).length

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteGuideline(guideline.id)
      toast.success('Guideline deleted', {
        description: `${guideline.code} has been removed from the local demo library.`,
      })
      onDeleted?.()
      onClose()
    } catch (error) {
      toast.error(error.message || 'Unable to delete the guideline.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete guideline rule"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting} icon={Trash2}>
            Delete rule
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--danger-soft)] text-[var(--danger)]">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{guideline.title}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            This removes <span className="font-mono text-[10px]">{guideline.code}</span> from the
            demo library. Existing findings keep their recorded reference.
          </p>
          {usage > 0 && (
            <p className="mt-3 rounded-lg border border-[var(--warning-line)] bg-[var(--warning-soft)] px-3 py-2 text-[10px] leading-relaxed text-[var(--warning)]">
              This rule is referenced by {usage} review{usage === 1 ? '' : 's'}. The deletion only
              affects this browser demo.
            </p>
          )}
        </div>
      </div>
    </Modal>
  )
}
