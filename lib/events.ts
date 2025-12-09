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
    id: "zero-robotics-2018",
    slug: "zero-robotics-2018",
    title: "Zero Robotics Competition 2018",
    description:
      "An international programming competition organized by MIT and NASA where students write code to control robots aboard the International Space Station",
    year: 2018,
    date: "June 2018",
    location: "Shirak Province, Armenia / International Space Station",
    image: "/zero-robotics.jpg",
    category: "competition",
    summary:
      "Zero Robotics is a prestigious high school programming competition organized by the Massachusetts Institute of Technology (MIT) and NASA. In June 2018, the competition was brought to Armenia's Shirak province, coordinated by YES Armenia and World Vision Armenia. Narek Saroyan from Arapi Secondary School participated as part of the Armenian team. Students aged 14-16 wrote code that, if they advanced, would be sent to NASA and tested on SPHERES robots aboard the International Space Station.",
    challenge:
      "Students must program SPHERES (Synchronized Position Hold, Engage, Reorient, Experimental Satellites) - small satellites aboard the ISS. The challenge involves writing algorithms for autonomous decision-making, satellite positioning, collision avoidance, and resource management in a zero-gravity environment. Winning code is actually uploaded and run on the ISS, with students watching the results live.",
    achievements: [
      "Participated in a competition where code is tested on actual robots aboard the International Space Station",
      "Developed programming skills for autonomous systems in space environments",
      "Competed alongside students from around the world in MIT and NASA's flagship educational program",
      "Gained exposure to real-world space technology and satellite programming",
    ],
    participants: {
      schools: ["Arapi Secondary School"],
      numberOfStudents: 1,
    },
    technologies: [
      "SPHERES Programming",
      "Autonomous Systems",
      "Space Robotics",
      "Algorithm Development",
      "Real-time Systems",
      "Zero-gravity Physics Simulation",
    ],
    results:
      "Narek's participation in Zero Robotics demonstrated the caliber of talent developed at Arapi's Armath Engineering Lab, with the opportunity to have code tested on actual hardware aboard the International Space Station - a truly international-level achievement.",
    highlights: [
      "Code tested on actual robots aboard the International Space Station",
      "Competition organized by MIT and NASA - world-leading institutions",
      "Opportunity to watch results live from the ISS",
      "Experience with real space technology and satellite systems",
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
