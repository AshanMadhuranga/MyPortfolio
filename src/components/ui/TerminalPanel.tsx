import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowUpRight, Moon, Sun, Terminal, Trash2 } from 'lucide-react'
import { portfolio } from '../../config/portfolio'
import { projects } from '../../config/projects'
import { milestones } from '../../config/journey'
import { executeCommand, historyEntry, type TerminalTheme } from '../../utils/terminal'

type Entry = { id: number; command?: string; lines: string[]; error?: boolean }
const themeKey = 'ashan-terminal-theme-v1'
const initial: Entry[] = [{ id: 0, lines: [portfolio.terminal.welcome, portfolio.terminal.invitation, "Type 'help' to begin."] }]

export function TerminalPanel({ visible, onFocusChange, onSecret, onBack }: { visible: boolean; onFocusChange: (focused: boolean) => void; onSecret: () => void; onBack: () => void }) {
  const [entries, setEntries] = useState<Entry[]>(initial)
  const [input, setInput] = useState('')
  const [theme, setTheme] = useState<TerminalTheme>(() => {
    try { return localStorage.getItem(themeKey) === 'midnight' ? 'midnight' : 'pastel' } catch { return 'pastel' }
  })
  const history = useRef<string[]>([]), cursor = useRef(0), draft = useRef(''), nextId = useRef(1)
  const output = useRef<HTMLDivElement>(null), field = useRef<HTMLInputElement>(null)
  const [announcement, setAnnouncement] = useState('')
  useEffect(() => { try { localStorage.setItem(themeKey, theme) } catch { /* Storage may be unavailable in private contexts. */ } }, [theme])
  useLayoutEffect(() => { if (output.current) output.current.scrollTop = output.current.scrollHeight }, [entries])
  const focus = () => field.current?.focus({ preventScroll: true })
  function run(command: string) {
    if (!command.trim()) return
    const result = executeCommand(command, {
      name: portfolio.name, introduction: portfolio.about.introduction, skills: portfolio.skills.categories,
      projects, milestones, contacts: [{ label: 'Email', value: portfolio.email }, { label: 'GitHub', value: portfolio.github }, { label: 'LinkedIn', value: portfolio.linkedin }],
      secret: portfolio.terminal.secret, now: new Date(),
    })
    history.current = [...history.current, command].slice(-50); cursor.current = history.current.length; draft.current = ''
    setInput('')
    if (result.action === 'clear') { setEntries([]); setAnnouncement('Terminal output cleared.') }
    else { const entry = { id: nextId.current++, command, lines: result.lines, error: result.error }; setEntries(previous => [...previous.slice(-79), entry]); setAnnouncement('') }
    if (result.theme) setTheme(result.theme)
    if (result.action === 'secret') onSecret()
    focus()
  }
  function submit(event: FormEvent) { event.preventDefault(); run(input) }
  function keys(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing || !['ArrowUp', 'ArrowDown'].includes(event.key)) return
    event.preventDefault()
    if (cursor.current === history.current.length) draft.current = input
    const next = historyEntry(history.current, cursor.current, event.key === 'ArrowUp' ? -1 : 1, draft.current)
    cursor.current = next.cursor; setInput(next.value)
  }
  return <section className="terminal-panel" aria-labelledby="terminal-heading" aria-hidden={!visible} inert={!visible}>
    <div className="chapter-label"><span />CHAPTER SIX / THE NEON OBSERVATORY</div>
    <h1 id="terminal-heading">{portfolio.terminal.title}</h1>
    <p className="terminal-subtitle">{portfolio.terminal.subtitle}</p>
    <p className="terminal-description">{portfolio.terminal.description}</p>
    <div className="terminal-window" data-theme={theme} onFocusCapture={() => onFocusChange(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onFocusChange(false) }}>
      <div className="terminal-toolbar"><span><Terminal size={15} /> ashan / workspace</span><div><button type="button" aria-label={`Switch to ${theme === 'pastel' ? 'midnight' : 'pastel'} terminal theme`} onClick={() => setTheme(theme === 'pastel' ? 'midnight' : 'pastel')}>{theme === 'pastel' ? <Moon size={16} /> : <Sun size={16} />}</button><button type="button" aria-label="Clear terminal output" onClick={() => run('clear')}><Trash2 size={16} /></button></div></div>
      <div ref={output} className="terminal-output" role="log" aria-label="Terminal output" aria-live={visible ? 'polite' : 'off'} aria-relevant="additions" tabIndex={0}>
        {entries.map(entry => <div key={entry.id} className={entry.error ? 'terminal-entry is-error' : 'terminal-entry'}>{entry.command && <p className="terminal-command-line"><span>visitor@ashan:~$</span> {entry.command}</p>}<pre>{entry.lines.join('\n')}</pre></div>)}
      </div>
      <form className="terminal-prompt" onSubmit={submit} aria-label="Run a portfolio command"><label htmlFor="terminal-command">visitor@ashan:~$</label><input ref={field} id="terminal-command" aria-label="Terminal command" aria-describedby="terminal-keyboard-hint" value={input} onChange={event => { setInput(event.target.value); cursor.current = history.current.length }} onKeyDown={keys} maxLength={512} autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} enterKeyHint="send" /><button type="submit" aria-label="Run command"><ArrowUpRight size={18} /></button></form>
      <div className="terminal-suggestions" aria-label="Quick commands">{['help', 'about', 'skills', 'projects', 'journey', 'secret'].map(command => <button type="button" key={command} onClick={() => run(command)}>{command}</button>)}</div>
      <p id="terminal-keyboard-hint" className="terminal-hint">Enter to run · ↑ / ↓ for history · Local portfolio commands</p>
      <span role="status" className="sr-only">{announcement}</span>
    </div>
    <div className="terminal-actions"><button id="terminal-focus" type="button" onClick={focus}>Focus terminal <ArrowUpRight size={13} /></button><button type="button" onClick={onBack}>Back to the Journey</button></div>
  </section>
}
