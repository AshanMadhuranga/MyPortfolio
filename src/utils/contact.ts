export type ContactDraft = { name: string; email: string; message: string }
export type ContactErrors = Partial<Record<keyof ContactDraft, string>>
export const contactLimits = { name: 80, email: 254, message: 3000 } as const
export function validEmail(email: string) {
  return email.length <= contactLimits.email && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) && !/[\r\n]/.test(email)
}
export function validateContact(draft: ContactDraft): ContactErrors {
  const errors: ContactErrors = {}
  for (const field of ['name', 'email', 'message'] as const) {
    if (!draft[field].trim()) errors[field] = `Please enter your ${field}.`
    else if (draft[field].length > contactLimits[field]) errors[field] = `Use ${contactLimits[field]} characters or fewer.`
  }
  if (!errors.email && !validEmail(draft.email.trim())) errors.email = 'Enter a valid email address.'
  return errors
}
export function contactLinks(email: string, socials: readonly { label: string; url: string }[]) {
  return {
    email: validEmail(email.trim()) ? email.trim() : '',
    socials: socials.filter(item => {
      try { const url = new URL(item.url); return !!item.label.trim() && url.protocol === 'https:' && !url.username && !url.password } catch { return false }
    }),
  }
}
export function emailDraftLink(email: string, draft?: ContactDraft) {
  if (!validEmail(email)) return null
  const base = `mailto:${encodeURIComponent(email)}`
  return draft ? `${base}?subject=${encodeURIComponent(`Portfolio conversation from ${draft.name.trim()}`)}&body=${encodeURIComponent(`${draft.message.trim()}\n\nFrom: ${draft.name.trim()}\nReply to: ${draft.email.trim()}`)}` : base
}
export async function copyContactEmail(email: string, write: ((text: string) => Promise<void>) | undefined) {
  if (!validEmail(email)) return 'Email is not configured yet.'
  if (!write) return 'Clipboard unavailable. Select and copy the email address above.'
  try { await write(email); return 'Email copied.' } catch { return 'Could not copy automatically. Select and copy the email address above.' }
}
