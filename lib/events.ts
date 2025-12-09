export interface Event {
  id: string
  slug: string
  title: string
  description: string
  year: number
  date: string
  location: string
  image: string
  category: "competition" | "workshop" | "camp" | "exhibition"
  summary: string
  challenge: string
  achievements: string[]
  participants: {
    schools: string[]
    numberOfStudents: number
  }
  technologies: string[]
  results: string
  highlights: string[]
  relatedProjects?: string[]
}

export const events: Event[] = [
  {
    id: "armat-2022",
    slug: "armat-armrobotics-2022",
    title: "Armat - ArmRobotics 2022 Smart Farm Robot",
    description:
      "A groundbreaking robotics solution for smart farm management featuring AI-powered animal recognition and adaptive line-tracking technology",
    year: 2022,
    date: "2022",
    location: "Armenia",
    image: "/armat-smart-farm.jpg",
    category: "competition",
    summary:
      "In 2022, a collaborative team from Gyumri's Family Center, Meghrashen, and Arapi secondary schools participated in the Armat ArmRobotics competition, which focused on smart farm agro-technological solutions. The team developed an innovative system combining computer vision and advanced control algorithms.",
    challenge:
      "The competition challenged teams to develop agro-technological solutions for smart farming. The team aimed to create a system that could intelligently manage farm operations through automation and AI, specifically targeting animal monitoring and autonomous navigation in varying environmental conditions.",
    achievements: [
      "Developed AI-powered animal recognition system using embedded smartphone imagery and computer vision",
      "Implemented adaptive PID-based line-tracking algorithm that automatically adjusts to different lighting conditions",
      "Successfully integrated multiple technologies including robotics, AI, and real-time image processing",
      "Demonstrated practical application of advanced control theory in real-world agricultural scenarios",
    ],
    participants: {
      schools: ["Family Center (Gyumri)", "Meghrashen Secondary School", "Arapi Secondary School"],
      numberOfStudents: 0,
    },
    technologies: [
      "Python",
      "Computer Vision",
      "PID Control Algorithm",
      "Arduino",
      "Machine Learning",
      "Smartphone Integration",
      "Robotics",
    ],
    results:
      "The team's distinctive approaches to animal recognition and adaptive line tracking demonstrated the application of AI and advanced control systems in agricultural robotics, showcasing how young engineers can create practical solutions for real-world challenges.",
    highlights: [
      "First team to implement AI-based animal recognition using smartphone imagery",
      "Innovative PID algorithm that adapts to varying lighting conditions without manual recalibration",
      "Practical demonstration of industry-level technologies applied to agricultural challenges",
      "Cross-school collaboration demonstrating regional STEM ecosystem strength",
    ],
    relatedProjects: ["talk-freely"],
  },
  {
    id: "first-robotics-2025",
    slug: "first-robotics-2025",
    title: "FIRST Robotics Competition",
    description:
      "An international engineering competition where high school students design, build, and program industrial-sized robots to compete in action-packed games",
    year: 2025,
    date: "2025",
    location: "United States / International",
    image: "/first-robotics.jpg",
    category: "competition",
    summary:
      "A team from Arapi Secondary School, including student Narek Saroyan, represented Armenia at the prestigious FIRST Robotics Competition in the United States. The team was selected from 15,000 students from the 'Armath' Engineering Labs, with demonstrated technical excellence and English proficiency. FIRST Robotics is a world-renowned engineering competition where teams design, build, and program full-sized robots to compete in strategic gameplay, combining engineering, mechanics, programming, and teamwork.",
    challenge:
      "Teams must design and build industrial-sized robots within a specific framework provided each January. The challenge involves mechanical engineering, software development, project management, and strategic thinking. Teams must work within constraints on budget, time, and resources while creating robots capable of competing at the highest levels of international engineering competition.",
    achievements: [
      "Selected as part of one of the top teams from the Armath Engineering Labs based on technical excellence and English proficiency",
      "Represented Armenia at an international competition at the highest level of high school robotics",
      "Competed alongside teams from leading STEM programs around the world",
      "Demonstrated mastery of mechanical design, programming, and engineering principles",
    ],
    participants: {
      schools: ["Arapi Secondary School"],
      numberOfStudents: 0,
    },
    technologies: [
      "Robotics",
      "Mechanical Engineering",
      "Programming",
      "Computer Aided Design (CAD)",
      "Project Management",
      "Autonomous Systems",
    ],
    results:
      "The team's participation in FIRST Robotics at the international level demonstrates the exceptional quality of education at Arapi's Armath Engineering Lab and the commitment of its students to pursuing engineering excellence on the global stage.",
    highlights: [
      "Team selected from 15,000 students - representing the top tier of regional STEM talent",
      "Competed at international FIRST Robotics event in the United States",
      "English Access program support enabled participation in international opportunities",
      "Represents Armenia's STEM education and engineering capabilities on the world stage",
    ],
    relatedProjects: ["talk-freely"],
  },
  {
    id: "digicode-2025",
    slug: "digicode-2025",
    title: "DigiCode 2025 Competition",
    description:
      "A national digital innovation competition showcasing student projects in programming and digital design",
    year: 2025,
    date: "2025",
    location: "Armenia",
    image: "/digicode-competition.jpg",
    category: "competition",
    summary:
      "DigiCode is a prestigious national digital innovation competition bringing together talented students to showcase their programming and digital design projects. In 2025, Olya Khachatryan from Arapi Secondary School participated with the LogicGateSimulator project and successfully advanced through the republican stage of the competition.",
    challenge:
      "DigiCode challenges students to create innovative digital solutions that demonstrate technical skill, creativity, and practical application. Participants develop original projects and compete against talented students from across Armenia, presenting their work to judges and industry experts.",
    achievements: [
      "Successfully advanced through the republican stage of DigiCode 2025",
      "Created the LogicGateSimulator - an educational tool built entirely in Scratch",
      "Demonstrated how students can transition from learning with tools to creating useful applications",
      "Showcased practical educational value through interactive digital simulations",
    ],
    participants: {
      schools: ["Arapi Secondary School"],
      numberOfStudents: 1,
    },
    technologies: [
      "Scratch",
      "Visual Programming",
      "Educational Simulation",
      "Logic Gate Design",
      "User Interface Design",
    ],
    results:
      "Olya's LogicGateSimulator was recognized at DigiCode 2025 as a valuable educational tool. By passing the republican stage, the project demonstrated that students learning Scratch can create real, useful tools - not just practice exercises - providing motivation for other young programmers.",
    highlights: [
      "Passed the republican stage of DigiCode 2025",
      "Created a practical tool now used by teachers to explain logic concepts",
      "Proved that student projects can have real educational impact",
      "Inspired other students by showing visual programming can solve real problems",
    ],
    relatedProjects: ["logic-gate-simulator"],
  },
  {
    id: "digicamp-2022",
    slug: "digicamp-2022",
    title: "DigiCamp 2022: Mind-Culture-Physical Education Triathlon",
    description:
      "An immersive triathlon camp combining digital innovation, cultural exploration, and physical education in the mountains of Dilijan",
    year: 2022,
    date: "July 2022",
    location: "Dilijan, Armenia",
    image: "/digicamp-2022.jpg",
    category: "camp",
    summary:
      "DigiCamp 2022 was an intensive triathlon camp held in July 2022 in Dilijan, Armenia, bringing together 14-17-year-old school children for an immersive experience combining digital innovation, cultural enrichment, and physical education. The camp was implemented by UATE in cooperation with the Goethe Center.",
    challenge:
      "To create a comprehensive educational experience that goes beyond traditional STEM learning by integrating cultural development and physical wellness, fostering well-rounded student development through diverse learning modalities in a mountain setting.",
    achievements: [
      "Successfully brought together students from three different schools in a collaborative learning environment",
      "Integrated digital innovation with cultural studies and physical activities",
      "Created a holistic educational experience combining mind, culture, and physical education",
      "Fostered cross-school partnerships and community building",
    ],
    participants: {
      schools: ["Arapi Secondary School", "Vardakar Secondary School", "Lanjik Secondary School"],
      numberOfStudents: 0,
    },
    technologies: ["STEM", "Digital Innovation", "Engineering", "Robotics"],
    results:
      "DigiCamp 2022 successfully created a unique learning environment that combined technical education with cultural exploration and physical activities, demonstrating that comprehensive education extends beyond traditional classroom boundaries.",
    highlights: [
      "Unique triathlon format combining three educational pillars: mind, culture, and physical education",
      "Collaborative participation from three schools strengthening regional STEM community",
      "Partnership with prestigious institutions (UATE and Goethe Center)",
      "Mountain setting in Dilijan providing inspiring backdrop for learning",
    ],
  },
]

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((event) => event.slug === slug)
}

export function getEventById(id: string): Event | undefined {
  return events.find((event) => event.id === id)
}
