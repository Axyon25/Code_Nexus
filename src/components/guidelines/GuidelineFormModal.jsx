import { useState } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { useAppData } from '../../context/useAppData'
import {
  GUIDELINE_CATEGORIES,
  SEVERITIES,
  SEVERITY_META,
} from '../../utils/status'
import { Button } from '../common/Button'
import { Modal } from '../common/Modal'
import { SelectField, TextAreaField, TextField } from '../common/Form'

const EMPTY_FORM = {
  title: '',
  code: '',
  category: 'Brand Voice',
  severity: 'Medium',
  source: '',
  description: '',
  example: '',
  status: 'active',
}

function formFromGuideline(guideline) {
  if (!guideline) return EMPTY_FORM
  return {
    title: guideline.title,
    code: guideline.code,
    category: guideline.category,
    severity: guideline.severity,
    source: guideline.source,
    description: guideline.description,
    example: guideline.example ?? '',
    status: guideline.status,
  }
}

export function GuidelineFormModal({ open, onClose, guideline }) {
  const { addGuideline, updateGuideline } = useAppData()
  const [form, setForm] = useState(() => formFromGuideline(guideline))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const editing = Boolean(guideline)

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = 'Add a short, descriptive rule title.'
    if (form.title.trim().length > 90) next.title = 'Keep the title under 90 characters.'
    if (!form.description.trim()) next.description = 'Explain what the rule requires.'
    if (!form.source.trim()) next.source = 'Add a source reference so findings stay traceable.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      if (editing) {
        await updateGuideline(guideline.id, form)
        toast.success('Guideline updated', { description: `${form.code || form.title} is saved in the local library.` })
      } else {
        await addGuideline(form)
        toast.success('Guideline added', {
          description: 'The new rule is available for future reviews in this demo.',
        })
      }
      onClose()
    } catch (error) {
      toast.error(error.message || 'Unable to save the guideline.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit guideline rule' : 'Add a guideline rule'}
      description="Rules are stored in your browser for this demo. They are not synced to a server."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="guideline-form"
            variant="primary"
            loading={saving}
            icon={Save}
          >
            {editing ? 'Save changes' : 'Add rule'}
          </Button>
        </>
      }
    >
      <form id="guideline-form" className="space-y-4" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Rule title"
          required
          placeholder="e.g. Date references must be current"
          value={form.title}
          onChange={(event) => update('title', event.target.value)}
          error={errors.title}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Rule code"
            placeholder="Auto-generated if blank"
            hint="Used in finding references."
            value={form.code}
            onChange={(event) => update('code', event.target.value)}
          />
          <SelectField
            label="Category"
            value={form.category}
            onChange={(event) => update('category', event.target.value)}
          >
            {GUIDELINE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Severity"
            value={form.severity}
            onChange={(event) => update('severity', event.target.value)}
          >
            {SEVERITIES.map((severity) => (
              <option key={severity} value={SEVERITY_META[severity].label}>
                {SEVERITY_META[severity].label}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Status"
            value={form.status}
            onChange={(event) => update('status', event.target.value)}
          >
            <option value="active">Active</option>
            <option value="review">Needs review</option>
            <option value="draft">Draft</option>
          </SelectField>
        </div>

        <TextField
          label="Source reference"
          required
          placeholder="e.g. Brand Book v4.2 · §2.1"
          hint="Shown with every finding that cites this rule."
          value={form.source}
          onChange={(event) => update('source', event.target.value)}
          error={errors.source}
        />

        <TextAreaField
          label="Rule description"
          required
          rows={4}
          placeholder="What does the rule require? What should writers avoid?"
          value={form.description}
          onChange={(event) => update('description', event.target.value)}
          error={errors.description}
        />

        <TextAreaField
          label="Example (optional)"
          rows={2}
          placeholder="A short before/after example for reviewers"
          value={form.example}
          onChange={(event) => update('example', event.target.value)}
        />
      </form>
    </Modal>
  )
}
