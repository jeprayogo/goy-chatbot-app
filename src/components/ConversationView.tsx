import { AssistantMessage, AssistantResponse, AssistantTyping, UserMessage } from './ChatMessages'
import type { ConversationMessage } from './chatTypes'
import { Icon } from './Icon'

type ConversationViewProps = {
  isNewSession: boolean
  messages: ConversationMessage[]
  isLoading: boolean
  requestError: string
  onNewSession: () => void
  onCopy: (text: string) => void
  onSuggestion: (text: string) => void
}

export default function ConversationView({
  isNewSession,
  messages,
  isLoading,
  requestError,
  onNewSession,
  onCopy,
  onSuggestion,
}: ConversationViewProps) {
  return (
    <>
      <div className="thread-toolbar">
        <div className="thread-tabs">
          <button className="thread-tab thread-tab--active"><Icon name="neurology" /> AI</button>
          <button className="thread-tab"><Icon name="person" /> You • 10:42 WIB</button>
        </div>
        <button className="thread-action" onClick={onNewSession}><Icon name="add" /> Obrolan Baru</button>
      </div>
      <div className="conversation">
        {isNewSession ? (
          <div className="empty-session">
            <span className="brand-mark"><Icon name="neurology" /></span>
            <h1>Apa yang ingin kita bangun hari ini?</h1>
            <p>Mulai percakapan baru dengan GOY Chatbot.</p>
          </div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((message) => message.role === 'user'
              ? <UserMessage key={message.id} text={message.text} timestamp={message.timestamp} />
              : <AssistantResponse key={message.id} text={message.text} timestamp={message.timestamp} />)}
            {isLoading && <AssistantTyping />}
            {requestError && <div className="api-error" role="alert"><Icon name="close" /><span>{requestError}</span></div>}
          </>
        ) : (
          <>
            <UserMessage
              text="Buatkan arsitektur komponen React + Vite untuk AI Chatbot Workspace dengan tampilan glassmorphism ultra-bersih. Sertakan hooks state manajemen streaming token, syntax highlighter code block, dan responsive floating prompt dock."
              timestamp="10:42"
            />
            <AssistantMessage onCopy={onCopy} onSuggestion={onSuggestion} />
          </>
        )}
      </div>
    </>
  )
}
