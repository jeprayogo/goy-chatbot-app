import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Icon } from './Icon'
import type { IconName } from './Icon'

const MAX_FILE_COUNT = 5
const MAX_TOTAL_FILE_SIZE = 18 * 1024 * 1024
const supportedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'audio/aac',
  'audio/flac',
  'audio/mp3',
  'audio/mpeg',
  'audio/ogg',
  'audio/opus',
  'audio/wav',
  'audio/x-wav',
  'application/pdf',
  'text/plain',
  'text/csv',
])

const suggestions: { icon: IconName; text: string }[] = [
  { icon: 'library_books', text: 'Cara memesan tiket bus' },
  { icon: 'bolt', text: 'Pilih asal, tujuan, dan tanggal' },
  { icon: 'person', text: 'Cara daftar akun Unicorn Indorent' },
]

type PromptComposerProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>, files: File[]) => void
  onSuggestion: (text: string) => void
  status: string
  isLoading: boolean
}

export default function PromptComposer({
  value,
  onChange,
  onSubmit,
  onSuggestion,
  status,
  isLoading,
}: PromptComposerProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const [attachmentError, setAttachmentError] = useState('')

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  function addAttachments(selectedFiles: FileList | null) {
    if (!selectedFiles?.length) return

    const nextFiles = [...attachments, ...Array.from(selectedFiles)]
    if (nextFiles.length > MAX_FILE_COUNT) {
      setAttachmentError('Maksimal 5 file dalam satu pesan.')
    } else if (nextFiles.some((file) => !supportedMimeTypes.has(file.type.toLowerCase()))) {
      setAttachmentError('Tipe file tidak didukung. Gunakan gambar, audio, PDF, TXT, atau CSV.')
    } else if (nextFiles.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_FILE_SIZE) {
      setAttachmentError('Ukuran total lampiran maksimal 18 MB.')
    } else {
      setAttachments(nextFiles)
      setAttachmentError('')
    }

    if (fileInput.current) fileInput.current.value = ''
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!value.trim() && attachments.length === 0) {
      event.preventDefault()
      return
    }

    onSubmit(event, attachments)
    setAttachments([])
  }

  return (
    <div className="composer-area">
      <div className="quick-prompts">
        {suggestions.map((suggestion) => (
          <button key={suggestion.text} onClick={() => onSuggestion(suggestion.text)}>
            <Icon name={suggestion.icon} />{suggestion.text}
          </button>
        ))}
      </div>
      <form className="composer" onSubmit={handleSubmit}>
        <textarea
          aria-label="Pesan untuk Mimin Poni"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Kirim pesan ke Mimin Poni..."
          rows={2}
        />
        {attachments.length > 0 && (
          <div className="attachment-list" aria-label="Lampiran terpilih">
            {attachments.map((attachment, index) => (
              <div className="attachment-chip" key={`${attachment.name}-${attachment.lastModified}-${index}`}>
                <Icon name="attach_file" />
                <span>{attachment.name}</span>
                <button
                  type="button"
                  className="attachment-remove"
                  aria-label={`Hapus ${attachment.name}`}
                  onClick={() => setAttachments((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                >
                  <Icon name="close" />
                </button>
              </div>
            ))}
          </div>
        )}
        {attachmentError && <p className="attachment-error" role="alert">{attachmentError}</p>}
        <div className="composer-toolbar">
          <div className="composer-tools">
            <input
              ref={fileInput}
              className="visually-hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,audio/aac,audio/flac,audio/mp3,audio/mpeg,audio/ogg,audio/opus,audio/wav,audio/x-wav,application/pdf,text/plain,text/csv"
              multiple
              onChange={(event) => addAttachments(event.target.files)}
            />
            <button
              type="button"
              className="tool-button"
              title="Lampirkan hingga 5 file (maksimal total 18 MB)"
              aria-label="Lampirkan file"
              disabled={isLoading}
              onClick={() => fileInput.current?.click()}
            >
              <Icon name="attach_file" />
            </button>
            <button type="button" className="tool-button" title="Input suara belum tersedia" disabled>
              <Icon name="mic" />
            </button>
          </div>
          <div className="composer-submit">
            <span className="keyboard-hint">Ctrl + Enter untuk mengirim</span>
            <button className="send-button" type="submit" title={isLoading ? 'Menunggu respons' : 'Kirim'} aria-label={isLoading ? 'Menunggu respons' : 'Kirim pesan'} disabled={isLoading || (!value.trim() && attachments.length === 0)}>
              <Icon name={isLoading ? 'close' : 'arrow_upward'} />
            </button>
          </div>
        </div>
      </form>
      <p className="composer-note">{status || 'Maksimal 5 file dan total 18 MB. Gambar, audio, PDF, TXT, dan CSV didukung. Mimin Poni dapat membuat kesalahan.'}</p>
    </div>
  )
}
