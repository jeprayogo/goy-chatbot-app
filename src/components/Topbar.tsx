import { Icon } from './Icon'

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="model-picker">
        <div className="model-button" title="Model dikonfigurasi oleh backend">
          <span className="online-dot" />
          <span>Gemini 3.8 Flash</span>
        </div>
      </div>
      <button className="icon-button settings-button" aria-label="Pengaturan">
        <Icon name="settings" />
      </button>
    </header>
  )
}
