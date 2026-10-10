import { Icon } from './Icon'

export function AssistantMessage({
  onCopy,
  onSuggestion,
}: {
  onCopy: (text: string) => void
  onSuggestion: (text: string) => void
}) {
  const code = `import React, { useState, useRef, useEffect } from 'react';
import { useAuraStream } from '@aura/core-hooks';

export const AuraChatWorkspace: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const { messages, isStreaming, sendPrompt } = useAuraStream({
    model: 'aura-4.5-turbo',
    temperature: 0.7,
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (query.trim()) {
        sendPrompt(query);
        setQuery('');
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-surface-lowest text-on-surface">
      <main className="max-w-4xl mx-auto px-6 pt-12 pb-36 space-y-8">
        {messages.map((item) => (
          <MessageItem key={item.id} payload={item} />
        ))}
      </main>
    </div>
  );
};`

  return (
    <article className="message assistant-message">
      <div className="message-avatar assistant-avatar"><Icon name="smart_toy" /></div>
      <div className="message-content">
        <div className="message-meta"><strong>GOY</strong><span>10:42 WIB</span></div>
        <div className="thinking-status"><Icon name="check_circle" /> Berpikir sejenak (1.2 detik)</div>
        <div className="assistant-copy">
          <p>
            Berikut adalah implementasi arsitektur React 19 + Vite modern. Struktur ini menggabungkan
            <strong> streaming hook reaktif</strong>, kartu dialog berkaca frosted glass, dan modul dock
            input ergonomis dengan aksen aurora.
          </p>
        </div>
        <div className="code-card">
          <div className="code-toolbar">
            <span><span className="code-language-icon">JS</span> AuraChatWorkspace.tsx</span>
            <span className="code-lines">TypeScript • 48 lines</span>
            <button className="copy-button" onClick={() => onCopy(code)}><Icon name="content_copy" /> Salin Kode</button>
          </div>
          <pre><code>{code}</code></pre>
        </div>
        <div className="tips-card">
          <strong>Tips Optimalisasi Produksi:</strong>
          <p>Pastikan menerapkan <code>will-change: transform</code> pada parent aurora untuk menjaga framerate tetap responsif.</p>
          <p>Gunakan token font responsif <code>Plus Jakarta Sans</code> untuk readability superior di layar berkepadatan tinggi.</p>
        </div>
        <div className="suggestion-intro">Lanjutkan eksplorasi dengan satu klik:</div>
        <div className="suggestion-list">
          <button onClick={() => onSuggestion('Jelaskan integrasi ReadableStream Web Workers')}><Icon name="bolt" /> Integrasi ReadableStream Web Workers</button>
          <button onClick={() => onSuggestion('Tambahkan animasi Framer Motion')}><Icon name="neurology" /> Tambahkan animasi Framer Motion</button>
          <button onClick={() => onSuggestion('Optimasi token buffer')}><Icon name="folder_data" /> Optimasi token buffer</button>
        </div>
      </div>
    </article>
  )
}

export function UserMessage({ text, timestamp }: { text: string; timestamp: string }) {
  return (
    <article className="message user-message">
      <div className="message-content">
        <div className="message-meta"><strong>You</strong><span>{timestamp} WIB</span></div>
        <p className="user-bubble">{text}</p>
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
        <div className="message-meta"><strong>GOY</strong><span>{timestamp} WIB</span></div>
        <div className="assistant-copy assistant-response"><p>{text}</p></div>
      </div>
    </article>
  )
}

export function AssistantTyping() {
  return (
    <div className="preview-reply" role="status" aria-live="polite">
      <div className="message-avatar assistant-avatar"><Icon name="smart_toy" /></div>
      <p className="typing-indicator"><span /><span /><span /><span className="visually-hidden">GOY sedang menyiapkan jawaban...</span></p>
    </div>
  )
}
