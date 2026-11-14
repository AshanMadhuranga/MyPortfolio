
import type { ProjectId } from './projects'

export type MilestoneId =
  | 'beginning'
  | 'foundations'
  | 'applications'
  | 'intelligence'
  | 'systems'
  | 'ahead'

export type Milestone = {
  id: MilestoneId
  title: string
  subtitle: string
  description: string
  category: string
  technologies: string[]
  date?: string
  relatedProject?: ProjectId
  relatedProjects?: ProjectId[]
  icon:
    | 'spark'
    | 'code'
    | 'layers'
    | 'brain'
    | 'network'
    | 'mobile'
    | 'compass'
  theme: {
    color: string
    symbol: string
    label: string
  }
}

// Narrative chapters, not a dated chronology.
// Add dates only when confirmed.

export const milestones: Milestone[] = [
  {
    id: 'beginning',
    title: 'The Beginning',
    subtitle: 'Discovering programming',
    category: 'Curiosity',
    description:
      'My journey into software development began with curiosity about how technology works and how ideas can become real applications. What started as an interest in programming gradually developed into a passion for creating useful digital experiences.',
    technologies: [],
    icon: 'spark',
    theme: {
      color: '#ffd0ea',
      symbol: '*',
      label: 'Curiosity',
    },
  },

  {
    id: 'foundations',
    title: 'Learning the Foundations',
    subtitle: 'Building a way of thinking',
    category: 'Foundations',
    description:
      'I developed my programming foundations through Java, object-oriented programming, databases, JavaScript and web development. Learning these technologies strengthened my problem-solving skills and prepared me to build full-stack applications.',
    technologies: [
      'Java',
      'OOP',
      'JavaScript',
      'MySQL',
      'MongoDB',
      'Web Development',
      'Problem Solving',
    ],
    icon: 'code',
    theme: {
      color: '#b3e9ee',
      symbol: '</>',
      label: 'Foundations',
    },
  },

  {
    id: 'applications',
    title: 'Building Full-Stack Applications',
    subtitle: 'Turning ideas into working software',
    category: 'Full-Stack Development',
    description:
      'I moved from learning programming concepts to building full-stack applications using the MERN stack. My projects include a Gym Management Web Application, Food Ordering Web Application and CTMS. These experiences helped me work with frontend interfaces, backend services and databases while developing complete web applications.',
    technologies: [
      'MongoDB',
      'Express.js',
      'React',
      'Node.js',
      'JavaScript',
    ],
    relatedProject: 'gym-management',
    relatedProjects: [
      'gym-management',
      'food-ordering-web',
      'ctms',
    ],
    icon: 'layers',
    theme: {
      color: '#e6bbff',
      symbol: '{ }',
      label: 'Applications',
    },
  },

  {
    id: 'intelligence',
    title: 'Exploring Artificial Intelligence',
    subtitle: 'Combining software with intelligent features',
    category: 'AI Development',
    description:
      'My interest in artificial intelligence led me to explore AI-related applications, including AgeiosAI and an AI-powered clothing shop. The clothing shop combines MERN stack development with AI-based recommendations, allowing me to explore how intelligent features can enhance web applications.',
    technologies: [
      'Artificial Intelligence',
      'React',
      'Node.js',
      'MongoDB',
      'AI Recommendations',
    ],
    relatedProject: 'ai-clothing-shop',
    relatedProjects: [
      'ai-clothing-shop',
      'ageios-ai',
    ],
    icon: 'brain',
    theme: {
      color: '#b9c5ff',
      symbol: 'AI',
      label: 'Intelligence',
    },
  },

  {
    id: 'systems',
    title: 'Expanding into Mobile Development',
    subtitle: 'Building beyond the browser',
    category: 'Mobile Development',
    description:
      'After gaining experience with web applications, I expanded into mobile development using React Native and Expo. I developed a Food Ordering Mobile Application, exploring how to build mobile interfaces and application experiences beyond traditional web browsers.',
    technologies: [
      'React Native',
      'Expo',
      'JavaScript',
      'Mobile Development',
    ],
    relatedProject: 'food-ordering-mobile',
    relatedProjects: [
      'food-ordering-mobile',
      'food-ordering-web',
    ],
    icon: 'mobile',
    theme: {
      color: '#aee8d7',
      symbol: 'APP',
      label: 'Mobile',
    },
  },

  {
    id: 'ahead',
    title: 'The Road Ahead',
    subtitle: 'Still curious. Still building.',
    category: 'Future Learning Goals',
    description:
      'My journey continues as I explore DevOps, cloud technologies, advanced frontend engineering, artificial intelligence and creative web development. I want to keep improving my skills, building meaningful applications and creating interactive digital experiences that combine technology with creativity.',
    technologies: [
      'DevOps',
      'Cloud Technologies',
      'Artificial Intelligence',
      'Frontend Engineering',
      'Creative Development',
    ],
    icon: 'compass',
    theme: {
      color: '#f5b7f0',
      symbol: '+',
      label: 'Possibility',
    },
  },
]

// ======================================================
// JOURNEY SECTION CONTENT
// ======================================================

export const journeyContent = {
  title: 'The Path So Far',

  subtitle: 'Every line of code has a story.',

  introduction:
    'From learning programming fundamentals to building MERN stack applications, exploring artificial intelligence and developing mobile experiences, every project has shaped my journey as a software developer.',
}
