export type SkillStatus = 'Comfortable using' | 'Project experience' | 'Currently learning' | 'Not specified'
export type SkillCategoryId = 'frontend' | 'backend' | 'databases' | 'tools' | 'ai' | 'mobile'
export type SkillCategory = { id: SkillCategoryId; title: string; short: string; symbol: string; color: string; description: string; technologies: { name: string; status: SkillStatus }[] }
// Proposed technologies; set each status only after confirming your own experience.
const technologies = (names: string[]) => names.map(name => ({ name, status: 'Not specified' as SkillStatus }))
export const portfolio = {
  name: 'Ashan',
  email: '',
  terminal: {
    title: 'Beyond the Interface',
    subtitle: 'A little command line, a lot of curiosity.',
    description: 'Step inside my developer workspace. Explore projects, discover technologies, and uncover a few hidden surprises through an interactive terminal.',
    welcome: "Welcome to Ashan's Developer Terminal.",
    invitation: 'Explore my world, one command at a time.',
    secret: 'You found a quiet thought between the lines: stay curious, build something useful, and leave room for a little magic.',
  },
  github: '',
  linkedin: '',
  cv: '', // e.g. /ashan-cv.pdf, placed in public/
  audio: '/audio/ambient.mp3',
  skills: {
    heading: 'The Crystal Codex',
    subtitle: 'The technologies shaping my developer journey.',
    introduction: "Every crystal represents a skill I've explored, practiced, or used to build something meaningful.",
    location: 'The Crystal Garden',
    categories: [
      { id: 'frontend', title: 'Frontend Development', short: 'Frontend', symbol: '</>', color: '#8fe7ef', description: 'Interfaces and the building blocks of the web.', technologies: technologies(['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS']) },
      { id: 'backend', title: 'Backend Development', short: 'Backend', symbol: '{ }', color: '#d8b0ff', description: 'Services, application logic and connected systems.', technologies: technologies(['Java', 'Spring Boot', 'REST APIs', 'Jakarta EE']) },
      { id: 'databases', title: 'Databases', short: 'Databases', symbol: 'DB', color: '#9fe7c6', description: 'Organizing, querying and working with data.', technologies: technologies(['MySQL', 'MongoDB', 'Oracle SQL']) },
      { id: 'tools', title: 'DevOps & Development Tools', short: 'DevOps & Tools', symbol: '>_', color: '#ffc6e5', description: 'Tools for building, collaborating and delivering.', technologies: technologies(['Git', 'GitHub', 'Docker', 'Linux', 'Maven']) },
      { id: 'ai', title: 'AI & Machine Learning', short: 'AI & ML', symbol: 'AI', color: '#c5b6ff', description: 'Exploring patterns, prediction and learning systems.', technologies: technologies(['Python', 'scikit-learn', 'Random Forest', 'Artificial Neural Networks']) },
      { id: 'mobile', title: 'Mobile Development', short: 'Mobile', symbol: '[ ]', color: '#ffdab0', description: 'Interfaces and experiences for mobile devices.', technologies: technologies(['React Native', 'Expo']) },
    ] satisfies SkillCategory[],
  },
  about: {
    heading: 'Behind the Code',
    subtitle: 'A little about the developer behind this world.',
    introduction: "I'm Ashan, a software developer passionate about building meaningful digital experiences. I enjoy exploring full-stack development, scalable backend systems, creative interfaces, and emerging technologies.",
    location: "The Developer's Sanctuary",
    areas: [
      { id: 'laptop', title: 'What I Build', text: 'Full-stack web applications, thoughtful backend systems, and interactive interfaces built on clear software architecture.', object: 'Explore the laptop', dialogTitle: 'Technology interests', detail: 'I enjoy connecting the pieces of a digital experience, from the interface people use to the systems that support it.', items: ['Full-stack web applications', 'Scalable backend systems', 'Interactive frontend experiences', 'Software architecture'] },
      { id: 'bookshelf', title: "What I'm Learning", text: 'DevOps, cloud technologies, advanced frontend animation, and system design. There is always another idea to explore.', object: 'Browse the bookshelf', dialogTitle: 'A learning journey', detail: 'Learning is an ongoing part of how I build. These are the areas I am exploring next, one experiment and one useful project at a time.', items: ['DevOps and delivery workflows', 'Cloud technologies', 'Advanced frontend animation', 'System design'] },
      { id: 'crystal', title: 'What Inspires Me', text: 'Creative problem-solving, playful interactions, continuous learning, and making software that is useful to people.', object: 'Discover the crystal', dialogTitle: 'A little philosophy', detail: 'Stay curious. Make something useful. I believe thoughtful software starts with understanding a problem, exploring possibilities, and learning through the things we build.', items: ['Curiosity before assumptions', 'Clarity in the experience', 'Learning through building'] },
    ],
  },
}
export type AboutObject = 'laptop' | 'bookshelf' | 'crystal'
export const destinations = ['Home', 'About', 'Skills', 'Projects', 'Journey', 'Terminal', 'Contact'] as const
export type Destination = typeof destinations[number]
