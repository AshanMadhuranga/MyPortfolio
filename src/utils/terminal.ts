
export type TerminalTheme = 'pastel' | 'midnight'

export type TerminalContext = {
  name: string
  introduction: string
  skills: readonly {
    title: string
    technologies: readonly { name: string }[]
  }[]
  projects: readonly {
    title: string
    summary: string
  }[]
  milestones: readonly {
    title: string
    subtitle: string
  }[]
  contacts: readonly {
    label: string
    value: string
  }[]
  secret: string
  now: Date
  locale?: string
}

export type CommandResult = {
  lines: string[]
  action?: 'clear' | 'secret'
  theme?: TerminalTheme
  error?: boolean
}

export const commandDescriptions = {
  help: 'List commands',
  about: 'Meet the developer',
  skills: 'Explore skill categories',
  projects: 'Browse portfolio projects',
  journey: 'Read the six story chapters',
  contact: 'Configured contact details',
  whoami: 'Developer identity',
  clear: 'Clear output',
  date: 'Your current local date',
  theme: 'theme [pastel|midnight]',
  echo: 'echo <text>',
  neofetch: 'A little developer profile',
  secret: 'A quiet discovery',

  // Phase 8.4 — Enchanted Observatory
  summon: 'Summon a magical companion',
  constellation: 'Reveal the developer constellation',
  origin: 'Discover how this world began',
  awakening: 'Awaken the Observatory',
} as const

type Command = keyof typeof commandDescriptions

type Handler = (
  args: string,
  context: TerminalContext
) => CommandResult

const registry: Record<Command, Handler> = {
  help: () => ({
    lines: Object.entries(commandDescriptions).map(
      ([name, description]) =>
        `${name.padEnd(15)} ${description}`
    ),
  }),

  about: (_, c) => ({
    lines: [c.introduction],
  }),

  skills: (_, c) => ({
    lines: c.skills.map(
      s =>
        `${s.title}: ${s.technologies
          .map(t => t.name)
          .join(', ')}`
    ),
  }),

  projects: (_, c) => ({
    lines: c.projects.map(
      p => `${p.title} — ${p.summary}`
    ),
  }),

  journey: (_, c) => ({
    lines: c.milestones.map(
      (m, i) =>
        `${i + 1}. ${m.title} — ${m.subtitle}`
    ),
  }),

  contact: (_, c) => ({
    lines: c.contacts
      .filter(item => item.value.trim())
      .map(
        item => `${item.label}: ${item.value}`
      )
      .concat(
        c.contacts.some(item => item.value.trim())
          ? []
          : [
              'Contact details have not been configured yet. Visit the Contact destination for updates.',
            ]
      ),
  }),

  whoami: (_, c) => ({
    lines: [c.name, c.introduction],
  }),

  clear: () => ({
    lines: [],
    action: 'clear',
  }),

  date: (_, c) => ({
    lines: [
      new Intl.DateTimeFormat(c.locale, {
        dateStyle: 'full',
      }).format(c.now),
    ],
  }),

  theme: args => {
    const name = args.trim().toLowerCase()

    if (!name) {
      return {
        lines: [
          'Available terminal themes: pastel, midnight.',
          'Try: theme midnight',
        ],
      }
    }

    if (name === 'pastel' || name === 'midnight') {
      return {
        lines: [`Terminal theme: ${name}.`],
        theme: name,
      }
    }

    return {
      lines: [
        'Unknown theme. Choose pastel or midnight.',
      ],
      error: true,
    }
  },

  echo: args => ({
    lines: [args],
  }),

  neofetch: (_, c) => ({
    lines: [
      '   /\\     ' + c.name,
      '  /<>\\    A little code. A little curiosity.',
      ' /____\\   ' + c.projects.length + ' portfolio projects',
      '           ' + c.skills.length + ' skill categories',
      '           ' + c.milestones.length + ' story chapters',
      '           Built with React, TypeScript & Three.js',
    ],
  }),

  secret: (_, c) => ({
    lines: [c.secret],
    action: 'secret',
  }),

  // ==========================================
  // SECRET COMMAND 1 — SUMMON
  // ==========================================

  summon: () => ({
    lines: [
      '✦ SUMMONING RITUAL INITIATED ✦',
      '',
      'Searching the enchanted network...',
      'Gathering fragments of starlight...',
      'A tiny guardian answers your call.',
      '',
      '       /\\_/\\',
      '      ( o.o )',
      '       > ^ <',
      '',
      'Guardian: "Every great creation begins',
      'with a little curiosity."',
      '',
      'Achievement discovered: STARBOUND COMPANION',
    ],
    action: 'secret',
  }),

  // ==========================================
  // SECRET COMMAND 2 — CONSTELLATION
  // ==========================================

  constellation: (_, c) => ({
    lines: [
      '✧ THE DEVELOPER CONSTELLATION ✧',
      '',
      '          *           *',
      '           \\         /',
      '      *-----*-------*',
      '             \\     /',
      '              *---*',
      '                  \\',
      '                   *',
      '',
      `Stars discovered: ${c.skills.length} skill categories`,
      `Worlds created: ${c.projects.length} projects`,
      `Journey memories: ${c.milestones.length} chapters`,
      '',
      'Every skill is a star.',
      'Every project is a new constellation.',
    ],
  }),

  // ==========================================
  // SECRET COMMAND 3 — ORIGIN
  // ==========================================

  origin: (_, c) => ({
    lines: [
      '✦ THE ORIGIN OF THE ENCHANTED WORLD ✦',
      '',
      'Before the floating islands...',
      'Before the crystal garden...',
      'Before the portals and observatories...',
      '',
      'There was only a blank screen.',
      'And a developer with an idea.',
      '',
      `That developer was ${c.name}.`,
      '',
      'One line of code became a landscape.',
      'One experiment became an adventure.',
      'And curiosity became an entire world.',
      '',
      '"Every world begins with a single line of code."',
    ],
  }),

  // ==========================================
  // SECRET COMMAND 4 — AWAKENING
  // ==========================================

  awakening: () => ({
    lines: [
      '✦ THE OBSERVATORY AWAKENS ✦',
      '',
      '[SYSTEM] Ancient coordinates discovered.',
      '[SYSTEM] Crystal energy synchronized.',
      '[SYSTEM] Portal resonance detected.',
      '[SYSTEM] Starlight protocol activated.',
      '',
      'THE CODEX IS AWAKE.',
      '',
      'You have discovered the hidden',
      'magic of the Neon Observatory.',
      '',
      'Achievement unlocked: KEEPER OF THE STARS',
      '',
      'The journey does not end here.',
      'There are always more worlds to build.',
    ],
    action: 'secret',
  }),
}

/**
 * Local portfolio command interpreter.
 *
 * No shell execution, HTML evaluation,
 * network requests, or JavaScript evaluation.
 */
export function executeCommand(
  input: string,
  context: TerminalContext
): CommandResult {
  if (input.length > 512) {
    return {
      lines: [
        'Please keep commands to 512 characters.',
      ],
      error: true,
    }
  }

  const match = input
    .trimStart()
    .match(/^(\S+)(?:[ \t]+([\s\S]*))?$/)

  if (!match) {
    return { lines: [] }
  }

  const name = match[1].toLowerCase()

  if (!Object.hasOwn(registry, name)) {
    return {
      lines: [
        "Command not found. Type 'help' to see available commands.",
      ],
      error: true,
    }
  }

  return registry[name as Command](
    match[2] ?? '',
    context
  )
}

export function historyEntry(
  history: readonly string[],
  cursor: number,
  direction: -1 | 1,
  draft: string
) {
  const next = Math.max(
    0,
    Math.min(
      history.length,
      cursor + direction
    )
  )

  return {
    cursor: next,
    value: history[next] ?? draft,
  }
}

