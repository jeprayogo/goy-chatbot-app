import { useEffect, useRef, useState, type FormEvent } from 'react'
import './App.css'
import ConversationView from './components/ConversationView'
import type { ConversationMessage } from './components/chatTypes'
import PromptComposer from './components/PromptComposer'
import Topbar from './components/Topbar'

type ChatApiResponse = {
  response?: unknown
  error?: unknown
}

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:3000/api/chat'

function currentTimestamp() {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
}

function App() {
  const requestSequence = useRef(0)
  const activeRequest = useRef<AbortController | null>(null)
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [isNewSession, setIsNewSession] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => () => activeRequest.current?.abort(), [])

  function startNewSession() {
    requestSequence.current += 1
    activeRequest.current?.abort()
    activeRequest.current = null
    setIsLoading(false)
    setMessages([])
    setPrompt('')
    setIsNewSession(true)
    setStatus('Obrolan baru siap dimulai.')
  }

  async function sendMessage(text: string) {
    if (isLoading) return
    const message = text.trim()
    if (!message) return

    const previousAssistantIndex = messages.reduce(
      (lastIndex, item, index) => item.role === 'assistant' ? index : lastIndex,
      -1,
    )
    const completedHistory = previousAssistantIndex < 0
      ? []
      : messages.slice(0, previousAssistantIndex + 1)
    const userMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: message,
      timestamp: currentTimestamp(),
    }
    const requestMessages = [...completedHistory, userMessage]
    const controller = new AbortController()
    const requestId = ++requestSequence.current
    activeRequest.current = controller

    setMessages((current) => [...current, userMessage])
    setIsNewSession(false)
    setPrompt('')
    setRequestError('')
    setStatus('')
    setIsLoading(true)

    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation: requestMessages.map(({ role, text: content }) => ({
            role,
            text: content,
          })),
        }),
        signal: controller.signal,
      })

      let payload: ChatApiResponse
      try {
        payload = await response.json() as ChatApiResponse
      } catch {
        throw new Error(`Server mengembalikan respons yang tidak valid (HTTP ${response.status}).`)
      }

      if (!response.ok) {
        const errorMessage = typeof payload.error === 'string'
          ? payload.error
          : `Permintaan gagal (HTTP ${response.status}).`
        throw new Error(errorMessage)
      }

      if (typeof payload.response !== 'string' || !payload.response.trim()) {
        throw new Error('Respons backend tidak berisi teks jawaban.')
      }
      const assistantText = payload.response

      if (requestId !== requestSequence.current) return
      setMessages((current) => [...current, {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: assistantText,
        timestamp: currentTimestamp(),
      }])
    } catch (error) {
      if (controller.signal.aborted || requestId !== requestSequence.current) return
      const message = error instanceof TypeError
        ? 'Tidak dapat terhubung ke backend. Pastikan server berjalan di http://localhost:3000.'
        : error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menghubungi backend chatbot.'
      setRequestError(message)
    } finally {
      if (requestId === requestSequence.current) {
        activeRequest.current = null
        setIsLoading(false)
      }
    }
  }

  function submitPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void sendMessage(prompt)
  }

  async function copyCode(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('Kode berhasil disalin.')
    } catch {
      setStatus('Clipboard tidak tersedia di browser ini.')
    }
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />
      <div className="main-panel">
        <Topbar />
        <main className="chat-workspace">
          <ConversationView
            isNewSession={isNewSession}
            messages={messages}
            isLoading={isLoading}
            requestError={requestError}
            onNewSession={startNewSession}
            onCopy={copyCode}
            onSuggestion={setPrompt}
          />
          <PromptComposer
            value={prompt}
            onChange={setPrompt}
            onSubmit={submitPrompt}
            onSuggestion={setPrompt}
            status={status}
            isLoading={isLoading}
          />
        </main>
      </div>
    </div>
  )
}

export default App
