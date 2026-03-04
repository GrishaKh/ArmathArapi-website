declare module 'contentlayer2/generated' {
  export interface Event {
    id: string
    slug: string
    language: string
    title: string
    description?: string
    year: number
    date: string
    location: string
    image: string
    category: 'competition' | 'workshop' | 'camp' | 'exhibition'
    technologies: string[]
    highlights?: string[]
    participants?: {
      schools?: string[]
      numberOfStudents?: number
    }
    body: { code: string }
  }

  export interface Project {
    id: string
    slug: string
    language: string
    title: string
    description?: string
    shortDescription?: string
    image: string
    category: string
    categoryHy?: string
    year: number
    featured?: boolean
    tools?: string[]
    toolsHy?: string[]
    challenge?: string
    challengeHy?: string
    solution?: string
    solutionHy?: string
    results?: string[]
    resultsHy?: string[]
    impact?: string
    impactHy?: string
    studentName?: string
    presentedAt?: string
    technologies?: Array<{ name: string; description?: string; descriptionHy?: string }>
    body: { code: string }
  }

  export interface Material {
    id: string
    slug: string
    language: string
    title: string
    summary: string
    topic: 'programming' | 'electronics' | 'robotics' | 'modeling3d' | 'cncLaser'
    difficulty: 'beginner' | 'next' | 'advanced'
    format: 'lesson' | 'project-guide' | 'worksheet' | 'video'
    ageGroup: string
    durationMinutes: number
    tools?: string[]
    prerequisites?: string[]
    learningObjectives?: string[]
    downloads?: Array<{ label: string; url: string }>
    featured?: boolean
    year: number
    image: string
    body: { code: string }
  }

  export const allEvents: Event[]
  export const allProjects: Project[]
  export const allMaterials: Material[]
}

