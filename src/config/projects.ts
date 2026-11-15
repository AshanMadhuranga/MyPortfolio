
export type ProjectId =
  | 'gym-management'
  | 'food-ordering-web'
  | 'ctms'
  | 'ai-clothing-shop'
  | 'ageios-ai'
  | 'food-ordering-mobile'
  | 'landhub'

export interface ProjectImage {
  src: string
  alt: string
  caption?: string
  concept?: boolean
  portrait?: boolean
  thumbnail?: string
}

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
  gallery: ProjectImage[]
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
    gallery: [
      {
        src: '/projects/gym-management/cover.webp',
        alt: 'AI-generated Gym Management concept with a cyan dashboard on a laptop in a gym',
        caption: 'Dashboard presentation — temporary AI-generated concept, not a real application screenshot.',
        concept: true,
      },
      {
        src: '/projects/gym-management/showcase-2.webp',
        alt: 'AI-generated Gym Management laptop concept showing revenue and attendance charts',
        caption: 'Analytics presentation — temporary AI-generated concept, not a real application screenshot.',
        concept: true,
      },
      {
        src: '/projects/gym-management/showcase-3.webp',
        alt: 'AI-generated Gym Management multi-screen concept with member, trainer schedule and membership panels',
        caption: 'Multi-screen presentation — temporary AI-generated concept, not a real application screenshot.',
        concept: true,
      },
    ],
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
    gallery: [
      {
        src: '/projects/food-ordering-web/cover.webp',
        alt: 'AI-generated food ordering storefront concept on a laptop with orange accents and food cards',
        caption: 'Storefront presentation — temporary AI-generated concept, not a real application screenshot.',
        concept: true,
      },
      {
        src: '/projects/food-ordering-web/showcase-2.webp',
        alt: 'AI-generated food menu concept on a laptop beside a tablet showing a shopping cart',
        caption: 'Menu and cart presentation — temporary AI-generated concept, not a real application screenshot.',
        concept: true,
      },
      {
        src: '/projects/food-ordering-web/showcase-3.webp',
        alt: 'AI-generated food ordering analytics dashboard concept with orange charts and an order list',
        caption: 'Analytics presentation — temporary AI-generated concept, not a real application screenshot.',
        concept: true,
      },
    ],
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
    gallery: [
      {
        src: '/projects/ctms/cover.webp',
        alt: 'AI-generated CTMS concept showing customer and case charts on a laptop',
        caption: 'Dashboard concept — AI-generated artwork, not an application screenshot. Depicted customer and case features are unverified.',
        concept: true,
      },
      {
        src: '/projects/ctms/showcase-2.webp',
        alt: 'AI-generated CTMS concept showing a case table and activity timeline on a laptop',
        caption: 'Case interface concept — AI-generated artwork, not an application screenshot. Depicted workflows are unverified.',
        concept: true,
      },
      {
        src: '/projects/ctms/showcase-3.webp',
        alt: 'AI-generated CTMS concept showing trial and participant analytics on a laptop',
        caption: 'Reporting concept — AI-generated artwork, not an application screenshot. Trial and participant terminology is not confirmed for this project.',
        concept: true,
      },
    ],
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
    gallery: [
      {
        src: '/projects/ai-clothing-shop/cover.webp',
        alt: 'AI-generated fashion storefront on a laptop with violet styling and clothing category cards',
        caption: 'AI Clothing Shop — fashion storefront concept. AI-generated illustrative design, not a verified application screenshot.',
        concept: true,
      },
      {
        src: '/projects/ai-clothing-shop/showcase-2.webp',
        alt: 'AI-generated personalized outfit recommendation interface with coordinated looks and style preferences',
        caption: 'AI Clothing Shop — personalized outfit recommendation concept. AI-generated illustrative design, not a verified application screenshot.',
        concept: true,
      },
      {
        src: '/projects/ai-clothing-shop/showcase-3.webp',
        alt: 'AI-generated fashion product catalog with clothing cards and category, size, price and color filters',
        caption: 'AI Clothing Shop — product catalog and filtering concept. AI-generated illustrative design, not a verified application screenshot.',
        concept: true,
      },
    ],
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
    gallery: [
      {
        src: '/projects/ageios-ai/cover.webp',
        alt: 'AI-generated AgeiosAI platform concept with a luminous digital head and cyan dashboard charts on a laptop',
        caption: 'AgeiosAI — futuristic AI platform concept. AI-generated artwork, not a real application screenshot; depicted capabilities are unverified.',
        concept: true,
      },
      {
        src: '/projects/ageios-ai/showcase-2.webp',
        alt: 'AI-generated AgeiosAI interaction interface concept with a robot avatar and message-shaped panels',
        caption: 'AgeiosAI — AI interaction interface concept. AI-generated artwork, not a real application screenshot; chatbot functionality is unverified.',
        concept: true,
      },
      {
        src: '/projects/ageios-ai/showcase-3.webp',
        alt: 'AI-generated AgeiosAI insights visualization concept with a glowing brain, charts and product illustrations',
        caption: 'AgeiosAI — AI insights visualization concept. AI-generated artwork, not a real application screenshot; analytics and recommendations are unverified.',
        concept: true,
      },
    ],
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
    gallery: [
      {
        src: '/projects/food-ordering-mobile/cover.webp',
        alt: 'AI-generated food ordering home screen on a smartphone in a landscape restaurant composition',
        caption: 'Food Ordering Mobile — home screen concept. AI-generated illustration, not a real application screenshot; depicted details are not verified features.',
        concept: true,
        portrait: false,
      },
      {
        src: '/projects/food-ordering-mobile/showcase-2.webp',
        alt: 'AI-generated smartphone menu with food categories and browsing cards in a landscape composition',
        caption: 'Food Ordering Mobile — menu and browsing concept. AI-generated illustration, not a real application screenshot; depicted details are not verified features.',
        concept: true,
        portrait: false,
      },
      {
        src: '/projects/food-ordering-mobile/showcase-3.webp',
        alt: 'AI-generated landscape composition of three smartphones showing food browsing, a cart and a delivery map',
        caption: 'Food Ordering Mobile — cart and delivery flow concept. AI-generated illustration, not a real application screenshot; depicted details are not verified features.',
        concept: true,
        portrait: false,
      },
    ],
  },
  {
    id: 'landhub',
    title: 'LandHub — Land Sales & Property Management',
    summary:
      'A collaborative land sales and property management platform built with Spring Boot, MySQL, and Thymeleaf, featuring land listings, bookings, payments, and promotional management.',
    description:
      'LandHub is an ongoing collaborative university project: a land sales and property management platform built with Java 21, Spring Boot 3, Spring Security, Spring Data JPA/Hibernate, MySQL, Thymeleaf, Bootstrap, and Maven.',
    category: 'Collaborative Web Application',
    technologies: [
      'Java 21',
      'Spring Boot 3',
      'Spring Security',
      'MySQL',
      'Spring Data JPA / Hibernate',
      'Thymeleaf',
      'Bootstrap',
      'Maven',
    ],
    features: [
      'User registration and authentication',
      'Role-based access for customers, administrators, and staff',
      'Land listing management, public browsing, and details',
      'Customer inquiries and site visit scheduling',
      'Land booking management',
      'Payment management and receipts',
      'Marketing promotions and customer feedback/reviews',
    ],
    contribution:
      'Collaborative university group project; individual contributions are not specified.',
    status: 'Ongoing university group project',
    github: '',
    demo: '',
    documentation: '',
    gallery: [
      {
        src: '/projects/landhub/cover.webp',
        alt: 'AI-generated concept artwork depicting a LandHub land marketplace on a laptop with listing cards and map imagery',
        caption: 'LandHub — land marketplace concept',
        concept: true,
      },
      {
        src: '/projects/landhub/showcase-2.webp',
        alt: 'AI-generated concept artwork depicting LandHub land parcels and listing filters on a laptop interface',
        caption: 'LandHub — land listing and management concept',
        concept: true,
      },
      {
        src: '/projects/landhub/showcase-3.webp',
        alt: 'AI-generated concept artwork depicting a LandHub-style administrative dashboard on a laptop',
        caption: 'LandHub — administrative management dashboard concept',
        concept: true,
      },
    ],
  },
]
