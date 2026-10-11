import { useEffect, useState } from 'react'
import { AssistantMessage, AssistantResponse, AssistantTyping, UserMessage } from './ChatMessages'
import type { ConversationMessage } from './chatTypes'
import { Icon } from './Icon'

type ConversationViewProps = {
  isNewSession: boolean
  messages: ConversationMessage[]
  isLoading: boolean
  requestError: string
  onNewSession: () => void
  onSuggestion: (text: string) => void
}

function getCurrentWibTime() {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date())
}

export default function ConversationView({
  isNewSession,
  messages,
  isLoading,
  requestError,
  onNewSession,
  onSuggestion,
}: ConversationViewProps) {
  const [currentWibTime, setCurrentWibTime] = useState(getCurrentWibTime)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentWibTime(getCurrentWibTime())
    }, 60_000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <>
      <div className="thread-toolbar">
        <div className="thread-tabs">
          <button className="thread-tab thread-tab--active"><Icon name="neurology" /> AI</button>
          <button className="thread-tab"><Icon name="person" /> You • {currentWibTime} WIB</button>
        </div>
        <button className="thread-action" onClick={onNewSession}><Icon name="add" /> Obrolan Baru</button>
      </div>
      <div className="conversation">
        {isNewSession ? (
          <div className="empty-session">
            <span className="brand-mark"><Icon name="neurology" /></span>
            <h1>Selamat Datang di Unicorn Indorent Chatbot</h1>
            <p>Mimin Poni dengan senang hati akan membantu Anda.</p>
          </div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((message) => message.role === 'user'
              ? <UserMessage key={message.id} text={message.text} attachments={message.attachments} timestamp={message.timestamp} />
              : <AssistantResponse key={message.id} text={message.text} timestamp={message.timestamp} />)}
            {isLoading && <AssistantTyping />}
            {requestError && <div className="api-error" role="alert"><Icon name="close" /><span>{requestError}</span></div>}
          </>
        ) : (
          <>
            <UserMessage
              text="Apa itu Unicorn Indorent Chatbot?"
              timestamp={currentWibTime}
            />
            <AssistantMessage onSuggestion={onSuggestion} />
          </>
        )}
      </div>
    </>
  )
}
