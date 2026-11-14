
export type ProjectId =
  | 'gym-management'
  | 'food-ordering-web'
  | 'ctms'
  | 'ai-clothing-shop'
  | 'ageios-ai'
  | 'food-ordering-mobile'

export interface Project {
  id: ProjectId
  title: string
  summary: string
  description: string
  category: string
  technologies: string[]
  features: string[]
  contribution: string
  status: string
  github: string
  demo: string
  documentation: string
  gallery: { src: string; alt: string }[]
}

export const projects: Project[] = [
  {
    id: 'gym-management',
    title: 'Gym Management',
    summary: 'Full-stack gym management web application',
    description:
      'A gym management web application developed using the MERN stack.',
    category: 'Web Application',
    technologies: [
      'MongoDB',
      'Express.js',
      'React',
      'Node.js',
    ],
    features: [
      'Gym management web application',
      'Full-stack MERN architecture',
    ],
    contribution: 'Developed the gym management web application.',
    status: 'Built',
    github: '',
    demo: '',
    documentation: '',
    gallery: [],
  },
  {
    id: 'food-ordering-web',
    title: 'Food Ordering Web',
    summary: 'Food ordering platform built with MERN',
    description:
      'A full-stack food ordering web application developed using MongoDB, Express.js, React and Node.js.',
    category: 'Web Application',
    technologies: [
      'MongoDB',
      'Express.js',
      'React',
      'Node.js',
    ],
    features: [
      'Food ordering web application',
      'Full-stack MERN architecture',
    ],
    contribution: 'Developed the food ordering web application.',
    status: 'Built',
    github: '',
    demo: '',
    documentation: '',
    gallery: [],
  },
  {
    id: 'ctms',
    title: 'CTMS',
    summary: 'CTMS web application built with MERN',
    description:
      'A CTMS web application developed using the MERN stack. Detailed functionality will be added after confirmation.',
    category: 'Web Application',
    technologies: [
      'MongoDB',
      'Express.js',
      'React',
      'Node.js',
    ],
    features: [
      'CTMS web application',
      'Full-stack MERN architecture',
    ],
    contribution: 'Developed the CTMS web application.',
    status: 'Built',
    github: '',
    demo: '',
    documentation: '',
    gallery: [],
  },
  {
    id: 'ai-clothing-shop',
    title: 'AI Clothing Shop',
    summary: 'Clothing e-commerce with AI recommendations',
    description:
      'A clothing shop web application built using the MERN stack, featuring AI-powered product recommendations.',
    category: 'AI-Powered Web Application',
    technologies: [
      'MongoDB',
      'Express.js',
      'React',
      'Node.js',
      'AI Recommendations',
    ],
    features: [
      'Clothing shop web application',
      'AI-powered recommendations',
      'Full-stack MERN architecture',
    ],
    contribution:
      'Developed the clothing shop web application with AI recommendations.',
    status: 'Built',
    github: '',
    demo: '',
    documentation: '',
    gallery: [],
  },
  {
    id: 'ageios-ai',
    title: 'AgeiosAI',
    summary: 'Existing AI project',
    description:
      'AgeiosAI is an existing project. Its specific functionality and technical architecture will be added once confirmed.',
    category: 'AI Project',
    technologies: [],
    features: [],
    contribution: 'Project details to be added.',
    status: 'Existing Work',
    github: '',
    demo: '',
    documentation: '',
    gallery: [],
  },
  {
    id: 'food-ordering-mobile',
    title: 'Food Ordering Mobile',
    summary: 'Food ordering mobile app built with Expo',
    description:
      'A food ordering mobile application developed using React Native and Expo.',
    category: 'Mobile Application',
    technologies: [
      'React Native',
      'Expo',
    ],
    features: [
      'Food ordering mobile application',
      'React Native and Expo development',
    ],
    contribution:
      'Developed the food ordering mobile application.',
    status: 'Built',
    github: '',
    demo: '',
    documentation: '',
    gallery: [],
  },
]
