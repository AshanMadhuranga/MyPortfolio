/** Public contact addresses remain in portfolio.ts, shared with Terminal and Home. */
export const contact = {
  title: "Let's Create Something Together",
  subtitle: 'Every great adventure begins with a conversation.',
  introduction: 'Have an idea, a question, or a new possibility in mind? This is where our next conversation begins.',
  closing: 'Thank you for exploring my world. The next adventure starts with a hello.',
  // No approved delivery service exists. A future integration must be implemented server-side.
  delivery: 'unconfigured',
  socials: [] as { label: string; url: string }[],
} as const
