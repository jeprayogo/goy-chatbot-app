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
const HEALTH_API_URL = import.meta.env.VITE_HEALTH_API_URL ||
  CHAT_API_URL.replace(/\/api\/chat\/?$/, '/api/health')

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
  const [composerKey, setComposerKey] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [status, setStatus] = useState('')
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  useEffect(() => () => activeRequest.current?.abort(), [])

  useEffect(() => {
    const controller = new AbortController()

    async function checkBackendHealth() {
      try {
        const response = await fetch(HEALTH_API_URL, { signal: controller.signal })
        if (!response.ok) {
          setBackendStatus('offline')
          return
        }

        const health = await response.json() as { status?: unknown }
        setBackendStatus(health.status === 'ok' ? 'online' : 'offline')
      } catch {
        if (!controller.signal.aborted) setBackendStatus('offline')
      }
    }

    void checkBackendHealth()
    return () => controller.abort()
  }, [])

  function startNewSession() {
    requestSequence.current += 1
    activeRequest.current?.abort()
    activeRequest.current = null
    setIsLoading(false)
    setMessages([])
    setPrompt('')
    setComposerKey((current) => current + 1)
    setIsNewSession(true)
    setStatus('Obrolan baru siap dimulai.')
  }

  async function sendMessage(text: string, files: File[]) {
    if (isLoading) return
    const message = text.trim()
      if (!message && files.length === 0) return

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
      attachments: files.map((file) => file.name),
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
      const formData = new FormData()
      formData.append('conversation', JSON.stringify(requestMessages.map(({ role, text: content }) => ({
        role,
        text: content,
      }))))
      files.forEach((file) => formData.append('files', file))

      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        body: formData,
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
      setBackendStatus('online')
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
          : 'Terjadi kesalahan saat menghubungi backend Mimin Poni.'
      setRequestError(message)
      if (error instanceof TypeError) setBackendStatus('offline')
    } finally {
      if (requestId === requestSequence.current) {
        activeRequest.current = null
        setIsLoading(false)
      }
    }
  }

  function submitPrompt(event: FormEvent<HTMLFormElement>, files: File[]) {
    event.preventDefault()
    void sendMessage(prompt, files)
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />
      <div className="main-panel">
        <Topbar backendStatus={backendStatus} />
        <main className="chat-workspace">
          <ConversationView
            isNewSession={isNewSession}
            messages={messages}
            isLoading={isLoading}
            requestError={requestError}
            onNewSession={startNewSession}
            onSuggestion={setPrompt}
          />
          <PromptComposer
            key={composerKey}
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
