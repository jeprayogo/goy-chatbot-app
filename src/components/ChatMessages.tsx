import { Icon } from './Icon'
import ReactMarkdown from 'react-markdown'

export function AssistantMessage({ onSuggestion }: { onSuggestion: (text: string) => void }) {
  return (
    <article className="message assistant-message">
      <div className="message-avatar assistant-avatar"><Icon name="smart_toy" /></div>
      <div className="message-content">
        <div className="message-meta"><strong>Mimin Poni</strong><span>10:42 WIB</span></div>
        <div className="assistant-copy assistant-response">
          <ReactMarkdown>{`**Unicorn Indorent Chatbot** adalah asisten virtual untuk membantu Anda mendapatkan informasi dan dukungan terkait layanan Unicorn Indorent. Anda dapat berinteraksi dengan Mimin Poni melalui percakapan sederhana untuk mengajukan pertanyaan dan meminta bantuan dengan cepat.

Silakan tulis pertanyaan atau kebutuhan Anda di kolom pesan. Mimin Poni akan berusaha memberikan jawaban yang **singkat, jelas, dan bermanfaat**.`}</ReactMarkdown>
        </div>
        <div className="suggestion-intro">Anda bisa mulai dengan bertanya tentang:</div>
        <div className="suggestion-list">
          <button onClick={() => onSuggestion('Bagaimana cara memesan tiket bus di Unicorn Indorent?')}><Icon name="library_books" /> Langkah pemesanan tiket</button>
          <button onClick={() => onSuggestion('Bagaimana cara memilih kota asal, tujuan, dan tanggal keberangkatan?')}><Icon name="bolt" /> Pilih rute dan tanggal</button>
          <button onClick={() => onSuggestion('Bagaimana cara mendaftar akun Unicorn Indorent?')}><Icon name="person" /> Daftar akun</button>
        </div>
      </div>
    </article>
  )
}

export function UserMessage({
  text,
  attachments = [],
  timestamp,
}: {
  text: string
  attachments?: string[]
  timestamp: string
}) {
  return (
    <article className="message user-message">
      <div className="message-content">
        <div className="message-meta"><strong>You</strong><span>{timestamp} WIB</span></div>
        {text && <p className="user-bubble">{text}</p>}
        {attachments.length > 0 && (
          <div className="sent-attachments">
            {attachments.map((name, index) => (
              <span className="sent-attachment" key={`${name}-${index}`}><Icon name="attach_file" />{name}</span>
            ))}
          </div>
        )}
      </div>
      <div className="message-avatar user-avatar"><Icon name="person" /></div>
    </article>
  )
}

export function AssistantResponse({ text, timestamp }: { text: string; timestamp: string }) {
  return (
    <article className="message assistant-message">
      <div className="message-avatar assistant-avatar"><Icon name="smart_toy" /></div>
      <div className="message-content">
        <div className="message-meta"><strong>Mimin Poni</strong><span>{timestamp} WIB</span></div>
        <div className="assistant-copy assistant-response">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </div>
    </article>
  )
}

export function AssistantTyping() {
  return (
    <div className="preview-reply" role="status" aria-live="polite">
      <div className="message-avatar assistant-avatar"><Icon name="smart_toy" /></div>
      <p className="typing-indicator"><span /><span /><span /><span className="visually-hidden">Mimin Poni sedang menyiapkan jawaban...</span></p>
    </div>
  )
}
