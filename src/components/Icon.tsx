export type IconName =
  | 'add'
  | 'auto_fix'
  | 'arrow_upward'
  | 'attach_file'
  | 'bolt'
  | 'check_circle'
  | 'chat_bubble'
  | 'close'
  | 'code_blocks'
  | 'content_copy'
  | 'dock_to_left'
  | 'folder_data'
  | 'history'
  | 'library_books'
  | 'mic'
  | 'neurology'
  | 'person'
  | 'settings'
  | 'smart_toy'
  | 'tune'

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  )
}
