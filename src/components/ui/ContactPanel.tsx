import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUpRight, Copy, Mail, Sparkles, X } from 'lucide-react'
import { contact } from '../../config/contact'
import { portfolio } from '../../config/portfolio'
import { contactLimits, contactLinks, copyContactEmail, emailDraftLink, validateContact, type ContactDraft, type ContactErrors } from '../../utils/contact'

export function ContactPanel({ visible, onPortal, onBack }: { visible: boolean; onPortal: () => void; onBack: () => void }) {
  const [draft, setDraft] = useState<ContactDraft>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState('')
  const [checked, setChecked] = useState(false)
  const links = contactLinks(portfolio.email, [{ label: 'GitHub', url: portfolio.github }, { label: 'LinkedIn', url: portfolio.linkedin }, ...contact.socials])
  function check(event: FormEvent) {
    event.preventDefault()
    const next = validateContact(draft); setErrors(next); setChecked(true)
    const first = Object.keys(next)[0]
    if (first) { setStatus('Please review the highlighted fields. Nothing has been sent.'); document.getElementById(`contact-${first}`)?.focus({ preventScroll: true }) }
    else setStatus(links.email ? 'Your draft is ready. Open it in your email app to send it. Nothing has been sent here.' : 'Your draft is valid. Sending is unavailable until contact details are configured. Nothing has been sent.')
  }
  const mailDraft = checked && !Object.keys(validateContact(draft)).length && links.email ? emailDraftLink(links.email, draft) : null
  return <section className="contact-panel" aria-labelledby="contact-heading" aria-hidden={!visible} inert={!visible}>
    <div className="chapter-label"><span />CHAPTER SEVEN / THE FINAL PORTAL</div>
    <h1 id="contact-heading">{contact.title}</h1><p className="contact-subtitle">{contact.subtitle}</p><p className="contact-introduction">{contact.introduction}</p>
    <div className="contact-links">
      {links.email && <><a href={emailDraftLink(links.email)!}><Mail size={15} /><span>{links.email}</span></a><button type="button" aria-label="Copy email address" onClick={async () => setStatus(await copyContactEmail(links.email, navigator.clipboard?.writeText.bind(navigator.clipboard)))}><Copy size={15} />Copy email</button></>}
      {links.socials.map(link => <a key={link.label + link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}<ArrowUpRight size={14} /></a>)}
    </div>
    {!links.email && !links.socials.length && <p className="contact-unavailable">Contact details are not available yet. Please check back soon.</p>}
    <form className="contact-form" onSubmit={check} noValidate aria-describedby="contact-delivery-note">
      <p id="contact-delivery-note">Message delivery is not connected.{links.email ? ' You can use email instead.' : ' This form cannot send messages yet.'}</p>
      <div className="contact-fields">{(['name', 'email', 'message'] as const).map(field => {
        const props = { id: `contact-${field}`, name: field, required: true, maxLength: contactLimits[field], value: draft[field], 'aria-invalid': !!errors[field], 'aria-describedby': errors[field] ? `contact-${field}-error` : undefined, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setDraft({ ...draft, [field]: event.target.value }); setErrors({ ...errors, [field]: undefined }); setChecked(false); setStatus('') }, onBlur: () => setErrors(previous => ({ ...previous, [field]: validateContact(draft)[field] })) }
        return <div className={`contact-field contact-field-${field}`} key={field}><label htmlFor={props.id}>{field === 'name' ? 'Your name' : field === 'email' ? 'Your email' : 'Your message'}</label>{field === 'message' ? <textarea {...props} rows={3} /> : <input {...props} type={field === 'email' ? 'email' : 'text'} autoComplete={field === 'name' ? 'name' : 'email'} />}<span id={`contact-${field}-error`} className="contact-error">{errors[field]}</span></div>
      })}</div>
      <div className="contact-form-actions"><button type="button" disabled aria-describedby="contact-delivery-note">Send message — unavailable</button><button type="submit">Check draft</button>{mailDraft && <a href={mailDraft}>Open draft in email <ArrowUpRight size={14} /></a>}</div>
    </form>
    <p className="contact-status" role="status" aria-live="polite">{status}</p>
    <div className="contact-actions"><button type="button" id="contact-portal-control" aria-haspopup="dialog" onClick={onPortal}><Sparkles size={15} />Step into the portal</button><button type="button" onClick={onBack}>Back to Terminal</button></div>
  </section>
}

export function ContactDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!open) { ref.current?.close(); return }
    const previous = document.activeElement as HTMLElement | null, dialog = ref.current
    dialog?.showModal()
    return () => { dialog?.close(); if (previous?.isConnected && previous !== document.body && previous.tagName !== 'CANVAS') previous.focus({ preventScroll: true }); else document.getElementById('contact-portal-control')?.focus({ preventScroll: true }) }
  }, [open])
  return <dialog ref={ref} className="upcoming-dialog contact-dialog" aria-labelledby="contact-closing-title" aria-describedby="contact-closing-message" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose() }}><button autoFocus className="dialog-close" aria-label="Close portal message" onClick={onClose}><X size={20} /></button><Sparkles size={28} /><span className="eyebrow">THE NEXT ADVENTURE</span><h2 id="contact-closing-title">A hello away.</h2><p id="contact-closing-message">{contact.closing}</p><button className="primary-button" onClick={onClose}>Return to the portal</button></dialog>
}
