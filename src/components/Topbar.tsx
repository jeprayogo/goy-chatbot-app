import { Icon } from './Icon'
import chromeLogo from '../assets/chrome_logo.svg'

type TopbarProps = {
  backendStatus: 'checking' | 'online' | 'offline'
}

export default function Topbar({ backendStatus }: TopbarProps) {
  const statusLabel = backendStatus === 'checking'
    ? 'Memeriksa koneksi backend'
    : backendStatus === 'online'
      ? 'Backend terhubung'
      : 'Backend tidak terhubung'

  return (
    <header className="topbar">
      <img className="topbar-logo" src={chromeLogo} alt="Unicorn Indorent" />
      <div className="model-picker">
        <div className="model-button" title={statusLabel}>
          <span className={`online-dot online-dot--${backendStatus}`} />
          <span>Unicorn AI</span>
        </div>
      </div>
      <button className="icon-button settings-button" aria-label="Pengaturan">
        <Icon name="settings" />
      </button>
    </header>
  )
}
