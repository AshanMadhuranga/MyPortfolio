import { useState } from 'react'
import { Code2, Menu, X, ArrowUpRight } from 'lucide-react'
import { destinations, type Destination } from '../../config/portfolio'
export function Navigation({ onNavigate, active = 'home' }: { onNavigate: (name: Destination) => void; active?: 'home' | 'about' | 'skills' | 'projects' | 'journey' | 'terminal' | 'contact' }) {
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <a href="#home" onClick={event => { event.preventDefault(); onNavigate('Home') }} className="brand" aria-label="Ashan, home"><span className="brand-mark"><Code2 size={22} /></span><span>ashan<span className="brand-dot">.</span><small>MY LITTLE UNIVERSE</small></span></a>
    <button className="menu-toggle" aria-expanded={open} aria-controls="main-nav" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    <nav id="main-nav" aria-label="Main navigation" className={open ? 'navigation is-open' : 'navigation'} onKeyDown={e => { if (e.key === 'Escape') setOpen(false) }}>
      {destinations.map(name => <button key={name} aria-current={name.toLowerCase() === active ? 'page' : undefined} onClick={() => { onNavigate(name); setOpen(false) }}><span>{name}</span></button>)}
    </nav>
    <button className="header-contact" onClick={() => onNavigate('Contact')}>Let’s connect <ArrowUpRight size={15} /></button>
  </header>
}
