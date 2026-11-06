import { useId, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  UploadCloud,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { uploadGuidelineDocument } from '../../services/guidelineService'
import { formatNumber } from '../../utils/format'
import { Button } from '../common/Button'
import { Modal } from '../common/Modal'

const ACCEPTED = ['.pdf', '.doc', '.docx', '.md', '.txt']
const MAX_SIZE = 5 * 1024 * 1024

function isAccepted(file) {
  const name = file.name.toLowerCase()
  return ACCEPTED.some((extension) => name.endsWith(extension))
}

export function UploadGuidelinesModal({ open, onClose, onUploaded }) {
  const inputId = useId()
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState('idle')
  const [result, setResult] = useState(null)

  const chooseFile = (candidate) => {
    setError('')
    setResult(null)
    setPhase('idle')
    if (!candidate) return
    if (!isAccepted(candidate)) {
      setError('Choose a PDF, Word document, Markdown or plain text file.')
      return
    }
    if (candidate.size > MAX_SIZE) {
      setError('This demo accepts files up to 5 MB.')
      return
    }
    setFile(candidate)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    chooseFile(event.dataTransfer.files?.[0])
  }

  const handleUpload = async () => {
    if (!file) return
    setPhase('uploading')
    setError('')
    try {
      const uploaded = await uploadGuidelineDocument(file)
      setResult(uploaded)
      setPhase('ready')
      onUploaded?.(uploaded)
      toast.success('Simulated import complete', {
        description: 'The file was not uploaded. This demo only demonstrates the interaction.',
      })
    } catch (uploadError) {
      setPhase('idle')
      setError(uploadError.message || 'The simulated upload failed. Try again.')
    }
  }

  const reset = () => {
    setFile(null)
    setResult(null)
    setError('')
    setPhase('idle')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Import guideline document"
      description="Drag in a brand book, policy or accessibility standard. Demo import only — no file leaves your browser."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={phase === 'ready' ? reset : onClose} disabled={phase === 'uploading'}>
            {phase === 'ready' ? 'Import another' : 'Cancel'}
          </Button>
          {phase !== 'ready' ? (
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={!file || phase === 'uploading'}
              icon={UploadCloud}
              loading={phase === 'uploading'}
            >
              {phase === 'uploading' ? 'Simulating import…' : 'Import document'}
            </Button>
          ) : (
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          )}
        </>
      }
    >
      {phase === 'ready' && result ? (
        <div className="rounded-2xl border border-[var(--success-line)] bg-[var(--success-soft)] p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--success-soft)] text-[var(--success)]">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-semibold text-ink">{result.name}</p>
                <span className="badge tone-approved">
                  <span className="dot" aria-hidden="true" />
                  Ready
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted">
                {formatNumber(Math.round(result.size / 1024))} KB · {result.extractedRules} rules
                suggested
              </p>
              <p className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3 text-[10px] leading-relaxed text-muted">
                <strong className="font-semibold text-ink">Simulation notice:</strong> the file was
                not uploaded or parsed by a real service. No rules were added to the library. Use
                “Add rule” to create rules manually.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {phase === 'uploading' ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] px-6 py-12 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-ink">Simulating document parsing</p>
              <p className="mt-1 max-w-sm text-[11px] leading-relaxed text-muted">
                A real backend would extract rules, categories and source references here.
              </p>
              <div className="mt-5 h-1.5 w-48 overflow-hidden rounded-full bg-[var(--line)]">
                <div className="skeleton h-full w-2/3 rounded-full" />
              </div>
            </div>
          ) : (
            <>
              {file ? (
                <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <FileText className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-ink">{file.name}</p>
                    <p className="mt-0.5 text-[10px] text-subtle">
                      {formatNumber(Math.round(file.size / 1024))} KB · Ready to simulate
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className="btn btn-ghost btn-icon"
                    aria-label="Remove selected file"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor={inputId}
                  onDragOver={(event) => {
                    event.preventDefault()
                    setDragging(true)
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center transition-colors ${
                    dragging
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                      : 'border-[var(--line-strong)] bg-[var(--panel-muted)] hover:border-[var(--accent)] hover:bg-[var(--hover-surface)]'
                  }`}
                >
                  <input
                    id={inputId}
                    type="file"
                    accept={ACCEPTED.join(',')}
                    className="sr-only"
                    onChange={(event) => chooseFile(event.target.files?.[0])}
                  />
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--glass-panel-strong)] text-[var(--accent)] shadow-sm">
                    <UploadCloud className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-xs font-semibold text-ink">
                    Drop a document here, or browse
                  </p>
                  <p className="mt-1 max-w-xs text-[10px] leading-relaxed text-subtle">
                    PDF, DOC, DOCX, MD or TXT · up to 5 MB. Import is simulated in this frontend
                    demo.
                  </p>
                </label>
              )}

              {error && (
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--danger)]" role="alert">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {error}
                </p>
              )}

              <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-subtle">
                  What a connected backend would do
                </p>
                <ul className="mt-1.5 list-inside list-disc space-y-1 text-[10px] leading-relaxed text-muted">
                  <li>Parse the document into discrete, citeable rules.</li>
                  <li>Suggest a category, severity and source reference for review.</li>
                  <li>Require a human to accept imported rules before they take effect.</li>
                </ul>
              </div>
            </>
          )}
        </>
      )}
    </Modal>
  )
}
