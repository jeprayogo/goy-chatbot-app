import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Icon } from './Icon'
import type { IconName } from './Icon'

const suggestions: { icon: IconName; text: string }[] = [
  { icon: 'code_blocks', text: 'Jelaskan arsitektur React' },
  { icon: 'bolt', text: 'Optimasi streaming buffer' },
  { icon: 'auto_fix', text: 'Buat unit test' },
]

type PromptComposerProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
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
  const [attachment, setAttachment] = useState('')

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
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
      <form className="composer" onSubmit={onSubmit}>
        <textarea
          aria-label="Pesan untuk GOY Chatbot"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Kirim pesan ke GOY Chatbot..."
          rows={2}
        />
        {attachment && <div className="attachment-chip"><Icon name="attach_file" />{attachment}</div>}
        <div className="composer-toolbar">
          <div className="composer-tools">
            <input
              ref={fileInput}
              className="visually-hidden"
              type="file"
              onChange={(event) => setAttachment(event.target.files?.[0]?.name ?? '')}
            />
            <button type="button" className="tool-button" title="Lampirkan File" onClick={() => fileInput.current?.click()}>
              <Icon name="attach_file" />
            </button>
            <button type="button" className="tool-button" title="Input Suara">
              <Icon name="mic" />
            </button>
            <button type="button" className="web-button"><Icon name="neurology" /> Web</button>
          </div>
          <div className="composer-submit">
            <span className="keyboard-hint">Ctrl + Enter untuk mengirim</span>
            <button className="send-button" type="submit" title={isLoading ? 'Menunggu respons' : 'Kirim'} aria-label={isLoading ? 'Menunggu respons' : 'Kirim pesan'} disabled={isLoading}>
              <Icon name={isLoading ? 'close' : 'arrow_upward'} />
            </button>
          </div>
        </div>
      </form>
      <p className="composer-note">{status || 'GOY CHATBOT dapat membuat kesalahan. Harap periksa info penting.'}</p>
    </div>
  )
}
