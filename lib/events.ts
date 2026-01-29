import type { Language } from "./translations"

export interface Event {
  id: string
  slug: string
  title: string
  year: number
  date: string
  category: "competition" | "workshop" | "camp" | "exhibition"
  image: string
  location: string
  technologies: string[]
  participants?: {
    schools: string[]
    numberOfStudents: number
  }
  highlights?: string[]
  relatedProjects?: string[]
  language: Language
  content: string
}

const eventsData: Event[] = [
  // FIRST Robotics - English
  {
    id: "first-robotics-2025",
    slug: "first-robotics-2025",
    title: "FIRST Robotics Competition",
    year: 2024,
    date: "2024-03-03",
    category: "competition",
    image: "/events/first-robotics.jpg",
    location: "Ventura, California / Houston, Texas, USA",
    technologies: ["Robotics", "Mechanics", "Electronics", "Team Strategy"],
    participants: {
      schools: [
        "Arapi Secondary School",
        "Ijevan 'Real School'",
        "Gyumri School No. 8",
        "Monte Melkonian Military College",
        "Aygehovit Secondary School",
      ],
      numberOfStudents: 15,
    },
    highlights: [
      "Armenia participated in FIRST Robotics for the first time, achieving 4th place among 53 teams",
      "'Rookie All Star' award and qualification for the finals in Texas",
      "The team ranked among the top 8 rookie teams out of 601 global teams at the US finals",
    ],
    language: "en",
    content:
      'From March 3-12, under the initiative and coordination of the Union of Advanced Technology Enterprises (UATE), the Armath "Armathronics 15" team represented Armenia at the "FIRST Robotics" competition in the USA. This was a historic event, as it was Armenia\'s first participation in this world-renowned competition. The first stage of the competition took place in Ventura, California, with 53 teams participating. Our robot successfully passed the qualification. The team participated in 6 matches on March 8, winning 5 of them. On March 9, 3 matches were held, and the team won all 3. As a result, our team secured 4th place in the overall ranking. Due to the exceptional results and team spirit demonstrated at the Ventura competition, "Armathronics 15" was awarded the special "Rookie All Star" (Best Beginner Team) award.',
  },
  // FIRST Robotics - Armenian
  {
    id: "first-robotics-2025",
    slug: "first-robotics-2025",
    title: "FIRST Robotics \u0574\u0580\u0581\u0578\u0582\u0575\u0569",
    year: 2024,
    date: "2024-03-03",
    category: "competition",
    image: "/events/first-robotics.jpg",
    location:
      "\u054E\u0565\u0576\u057F\u0578\u0582\u0580\u0561, \u053F\u0561\u056C\u056B\u0586\u0578\u057C\u0576\u056B\u0561 / \u0540\u0575\u0578\u0582\u057D\u0569\u0578\u0576, \u054F\u0565\u056D\u0561\u057D, \u0531\u0544\u0546",
    technologies: [
      "\u054C\u0578\u0562\u0578\u057F\u0561\u0577\u056B\u0576\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
      "\u0544\u0565\u056D\u0561\u0576\u056B\u056F\u0561",
      "\u0537\u056C\u0565\u056F\u057F\u0580\u0578\u0576\u056B\u056F\u0561",
      "\u0539\u056B\u0574\u0561\u0575\u056B\u0576 \u057C\u0561\u0566\u0574\u0561\u057E\u0561\u0580\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
    ],
    participants: {
      schools: [
        "\u0531\u057C\u0561\u0583\u056B\u056B \u0574\u056B\u057B\u0576\u0561\u056F\u0561\u0580\u0563 \u0564\u057A\u0580\u0578\u0581",
        "\u053B\u057B\u0587\u0561\u0576\u056B \u00AB\u053B\u0580\u0561\u056F\u0561\u0576 \u0564\u057A\u0580\u0578\u0581\u00BB",
        "\u0533\u0575\u0578\u0582\u0574\u0580\u056B\u0578\u0582 \u0569\u056B\u057E 8 \u0574\u056B\u057B\u0576. \u0564\u057A\u0580\u0578\u0581",
        "\u0544\u0578\u0576\u0569\u0565 \u0544\u0565\u056C\u0584\u0578\u0576\u0575\u0561\u0576\u056B \u0561\u0576\u057E\u0561\u0576 \u057E\u0561\u0580\u056A\u0561\u0580\u0561\u0576",
        "\u0531\u0575\u0563\u0578\u0582\u057F\u056B \u0574\u056B\u057B\u0576\u0561\u056F\u0561\u0580\u0564 \u0564\u057A\u0580\u0578\u0581",
      ],
      numberOfStudents: 15,
    },
    highlights: [
      "\u0531\u057C\u0561\u057B\u056B\u0576 \u0561\u0576\u0563\u0561\u0574 \u0540\u0561\u0575\u0561\u057D\u057F\u0561\u0576\u0568 \u0574\u0561\u057D\u0576\u0561\u056F\u0581\u0565\u0581 FIRST Robotics \u0574\u0580\u0581\u0578\u0582\u0575\u0569\u056B\u0576\u055D \u0566\u0562\u0561\u0572\u0565\u0581\u0576\u0565\u056C\u0578\u057E 4-\u0580\u0564 \u0570\u0578\u0580\u056B\u0566\u0578\u0576\u0561\u056F\u0561\u0576\u0568 53 \u0569\u056B\u0574\u0565\u0580\u056B \u0577\u0561\u0580\u0584\u0578\u0582\u0574",
      "\u00AB Rookie All Star\u00BB \u0574\u0580\u0581\u0561\u0576\u0561\u056F \u0587 \u0578\u0582\u0572\u0565\u0563\u056B\u0580 \u0564\u0565\u057A\u056B \u0565\u0566\u0580\u0561\u0586\u0561\u056F\u056B\u0579 \u0583\u0578\u0582\u056C \u054F\u0565\u056D\u0561\u057D\u0578\u0582\u0574",
      "\u0539\u056B\u0574\u0568 \u0570\u0561\u0574\u0561\u056C\u0580\u0565\u0581 \u056C\u0561\u057E\u0561\u0563\u0578\u0582\u0575\u0576 \u057D\u056F\u057D\u0576\u0561\u056F\u0576\u0565\u0580\u056B 8-\u0576\u0575\u0561\u056F\u0568 \u0561\u0577\u056D\u0561\u0580\u0570\u056B 601 \u0569\u056B\u0574\u0565\u0580\u056B \u0574\u056B\u057B\u0587 \u0531\u0544\u0546 \u0565\u0566\u0580\u0561\u0583\u0561\u056F\u0579\u0578\u0582\u0574",
    ],
    language: "hy",
    content:
      '\u0544\u0561\u0580\u057F\u056B 3-12-\u0568 \u0531\u057C\u0561\u057B\u0561\u057F\u0561\u0580 \u057F\u0565\u056D\u0576\u0578\u056C\u0578\u0563\u056B\u0561\u0576\u0565\u0580\u056B \u0571\u0565\u057C\u0576\u0561\u0580\u056F\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580\u056B \u0574\u056B\u0578\u0582\u0569\u0575\u0561\u0576 (UATE) \u0576\u0561\u056D\u0561\u0571\u0565\u057C\u0576\u0578\u0582\u0569\u0575\u0561\u0574\u0562 \u0587 \u0570\u0561\u0574\u0561\u056F\u0561\u0580\u0563\u0574\u0561\u0574\u0562 \u0561\u0580\u0574\u0561\u0569\u0581\u056B\u0576\u0565\u0580\u056B \u00ABArmath ronics 15\u00BB \u0569\u056B\u0574\u0568 \u0576\u0565\u0580\u056F\u0561\u0575\u0561\u0581\u0580\u0565\u0581 \u0540\u0561\u0575\u0561\u057D\u057F\u0561\u0576\u0568 \u00ABFIRST Robotics\u00BB \u0574\u0580\u0581\u0578\u0582\u0575\u0569\u056B\u0576 \u0531\u0544\u0546-\u0578\u0582\u0574\u0589 \u054D\u0561 \u057A\u0561\u057F\u0574\u0561\u056F\u0561\u0576 \u056B\u0580\u0561\u0564\u0561\u0580\u0571\u0578\u0582\u0569\u0575\u0578\u0582\u0576 \u0567\u0580, \u0584\u0561\u0576\u056B \u0578\u0580 \u0540\u0561\u0575\u0561\u057D\u057F\u0561\u0576\u0568 \u0561\u057C\u0561\u057B\u056B\u0576 \u0561\u0576\u0563\u0561\u0574 \u0567\u0580 \u0574\u0561\u057D\u0576\u0561\u056F\u0581\u0578\u0582\u0574 \u0561\u0577\u056D\u0561\u0580\u0570\u0561\u057C\u0579\u0561\u056F \u0561\u0575\u057D \u0574\u0580\u0581\u0578\u0582\u0575\u0569\u056B\u0576\u0589',
  },
  // DigiCode 2025 - English
  {
    id: "digicode-2025",
    slug: "digicode-2025",
    title: "DigiCode 2025 Competition",
    year: 2025,
    date: "2025",
    category: "competition",
    image: "/digicode-competition.jpg",
    location: "Armenia",
    technologies: [
      "Scratch",
      "Visual Programming",
      "Educational Simulation",
      "Logic Gate Design",
      "User Interface Design",
    ],
    participants: {
      schools: ["Arapi Secondary School"],
      numberOfStudents: 1,
    },
    highlights: [
      "Passed the republican stage of DigiCode 2025",
      "Created a practical tool now used by teachers to explain logic concepts",
      "Proved that student projects can have real educational impact",
      "Inspired other students by showing visual programming can solve real problems",
    ],
    relatedProjects: ["logic-gate-simulator"],
    language: "en",
    content:
      "DigiCode is a prestigious national digital innovation competition bringing together talented students to showcase their programming and digital design projects. In 2025, Olya Khachatryan from Arapi Secondary School participated with the LogicGateSimulator project and successfully advanced through the republican stage of the competition. DigiCode challenges students to create innovative digital solutions that demonstrate technical skill, creativity, and practical application.",
  },
  // DigiCode 2025 - Armenian
  {
    id: "digicode-2025",
    slug: "digicode-2025",
    title: "DigiCode 2025 \u0544\u0580\u0581\u0578\u0582\u0575\u0569",
    year: 2025,
    date: "2025",
    category: "competition",
    image: "/digicode-competition.jpg",
    location: "\u0540\u0561\u0575\u0561\u057D\u057F\u0561\u0576",
    technologies: [
      "Scratch",
      "\u054E\u056B\u0566\u0578\u0582\u0561\u056C \u056E\u0580\u0561\u0563\u0580\u0561\u057E\u0578\u0580\u0578\u0582\u0574",
      "\u053F\u0580\u0569\u0561\u056F\u0561\u0576 \u057D\u056B\u0574\u0578\u0582\u056C\u0575\u0561\u0581\u056B\u0561",
      "\u054F\u0580\u0561\u0574\u0561\u0562\u0561\u0576\u0561\u056F\u0561\u0576 \u0583\u0561\u056F\u0561\u0576\u0576\u0565\u0580\u056B \u0576\u0561\u056D\u0561\u0563\u056E\u0578\u0582\u0574",
      "UI \u0564\u056B\u0566\u0561\u0575\u0576",
    ],
    participants: {
      schools: [
        "\u0531\u057C\u0561\u0583\u056B\u056B \u0574\u056B\u057B\u0576\u0561\u056F\u0561\u0580\u0563 \u0564\u057A\u0580\u0578\u0581",
      ],
      numberOfStudents: 1,
    },
    highlights: [
      "\u0531\u0576\u0581\u0565\u056C \u0567 DigiCode 2025-\u056B \u0570\u0561\u0576\u0580\u0561\u057A\u0565\u057F\u0561\u056F\u0561\u0576 \u0583\u0578\u0582\u056C",
      "\u054D\u057F\u0565\u0572\u056E\u0565\u056C \u0567 \u0563\u0578\u0580\u056E\u056B\u0584, \u0578\u0580\u0576 \u0561\u0575\u056A\u0574 \u0585\u0563\u057F\u0561\u0563\u0578\u0580\u056E\u057E\u0578\u0582\u0574 \u0567 \u0578\u0582\u057D\u0578\u0582\u0581\u056B\u0579\u0576\u0565\u0580\u056B \u056F\u0578\u0572\u0574\u056B\u0581",
      "\u0531\u057A\u0561\u0581\u0578\u0582\u0581\u0565\u056C \u0567, \u0578\u0580 \u0578\u0582\u057D\u0561\u0576\u0578\u0572\u0561\u056F\u0561\u0576 \u0576\u0561\u056D\u0561\u0563\u056E\u0565\u0580\u0568 \u056F\u0561\u0580\u0578\u0572 \u0565\u0576 \u0578\u0582\u0576\u0565\u0576\u0561\u056C \u056B\u0580\u0561\u056F\u0561\u0576 \u056F\u0580\u0569\u0561\u056F\u0561\u0576 \u0561\u0566\u0564\u0565\u0581\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
      "\u0548\u0563\u0565\u0577\u0576\u0579\u0565\u056C \u0567 \u0561\u0575\u056C \u0578\u0582\u057D\u0561\u0576\u0578\u0572\u0576\u0565\u0580\u056B\u0576\u055D \u0581\u0578\u0582\u0575\u0581 \u057F\u0561\u056C\u0578\u057E, \u0578\u0580 \u057E\u056B\u0566\u0578\u0582\u0561\u056C \u056E\u0580\u0561\u0563\u0580\u0561\u057E\u0578\u0580\u0578\u0582\u0574\u0568 \u056F\u0561\u0580\u0578\u0572 \u0567 \u056C\u0578\u0582\u056E\u0565\u056C \u056B\u0580\u0561\u056F\u0561\u0576 \u056D\u0576\u0564\u056B\u0580\u0576\u0565\u0580",
    ],
    relatedProjects: ["logic-gate-simulator"],
    language: "hy",
    content:
      "DigiCode-\u0568 \u0570\u0565\u0572\u056B\u0576\u0561\u056F\u0561\u057E\u0578\u0580 \u0574\u0580\u0581\u0578\u0582\u0575\u0569 \u0567, \u0578\u0580\u0568 \u0570\u0561\u0574\u0561\u056D\u0574\u0562\u0578\u0582\u0574 \u0567 \u057F\u0561\u0572\u0561\u0576\u0564\u0561\u057E\u0578\u0580 \u0578\u0582\u057D\u0561\u0576\u0578\u0572\u0576\u0565\u0580\u056B\u0576\u055D \u0576\u0565\u0580\u056F\u0561\u0575\u0561\u0581\u0576\u0565\u056C\u0578\u0582 \u056B\u0580\u0565\u0576\u0581 \u056E\u0580\u0561\u0563\u0580\u0561\u057E\u0578\u0580\u0574\u0561\u0576 \u0576\u0561\u056D\u0561\u0563\u056E\u0565\u0580\u0568: 2025 \u0569\u057E\u0561\u056F\u0561\u0576\u056B\u0576 \u0531\u057C\u0561\u0583\u056B\u056B \u0574\u056B\u057B\u0576\u0561\u056F\u0561\u0580\u0563 \u0564\u057A\u0580\u0578\u0581\u056B \u0561\u0577\u0561\u056F\u0565\u0580\u057F\u0578\u0582\u0570\u056B \u0555\u056C\u0575\u0561 \u053D\u0561\u0579\u0561\u057F\u0580\u0575\u0561\u0576\u0568 \u0574\u0561\u057D\u0576\u0561\u056F\u0581\u0565\u0581 LogicGateSimulator \u0576\u0561\u056D\u0561\u0563\u056E\u0578\u057E \u0587 \u0570\u0561\u057B\u0578\u0572\u0578\u0582\u0569\u0575\u0561\u0574\u0562 \u0561\u0576\u0581\u0561\u057E \u0574\u0580\u0581\u0578\u0582\u0575\u0569\u056B \u0570\u0561\u0576\u0580\u0561\u057A\u0565\u057F\u0561\u056F\u0561\u0576 \u0583\u0578\u0582\u056C:",
  },
  // DigiCamp 2022 - English
  {
    id: "digicamp-2022",
    slug: "digicamp-2022",
    title: "DigiCamp 2022: Triathlon Camp",
    year: 2022,
    date: "July 2022",
    category: "camp",
    image: "/events/digicamp-2022.jpg",
    location: "Dilijan, Armenia",
    technologies: ["STEM", "Startup", "Teamwork", "Chatrak"],
    participants: {
      schools: ["Arapi Secondary School", "Vardakar Secondary School", "Lanjik Secondary School"],
      numberOfStudents: 6,
    },
    highlights: [
      "Unified team formed through collaboration of three laboratories",
      "Participation in DigiCamp triathlon (Mind, Culture, Physical Education)",
      "Presentation of 'Chatrak' startup idea",
    ],
    language: "en",
    content:
      "In the summer of 2022, students from the Armath engineering makerspaces of Arapi, Vardakar, and Lanjik formed a unified team and traveled to Dilijan with great enthusiasm to participate in the DigiCamp 2022 technological camp. We were among the first in the Shirak region to practically demonstrate the importance of a collaborative culture. DigiCamp was held in a triathlon format, based on three important pillars: Mind, Culture, and Physical Education.",
  },
  // DigiCamp 2022 - Armenian
  {
    id: "digicamp-2022",
    slug: "digicamp-2022",
    title:
      "DigiCamp 2022 \u0565\u057C\u0561\u0574\u0580\u0581\u0561\u0577\u0561\u0580-\u0573\u0561\u0574\u0562\u0561\u0580",
    year: 2022,
    date: "\u0540\u0578\u0582\u056C\u056B\u057D 2022",
    category: "camp",
    image: "/events/digicamp-2022.jpg",
    location:
      "\u0534\u056B\u056C\u056B\u057B\u0561\u0576, \u0540\u0561\u0575\u0561\u057D\u057F\u0561\u0576",
    technologies: [
      "\u0532\u054F\u0543\u0544",
      "\u054D\u057F\u0561\u0580\u057F\u0561\u0583",
      "\u0539\u056B\u0574\u0561\u0575\u056B\u0576 \u0561\u0577\u056D\u0561\u057F\u0561\u0576\u0584",
      "Smart Chess",
    ],
    participants: {
      schools: [
        "\u0531\u057C\u0561\u0583\u056B\u056B \u0574\u056B\u057B\u0576\u0561\u056F\u0561\u0580\u0563 \u0564\u057A\u0580\u0578\u0581",
        "\u054E\u0561\u0580\u0564\u0561\u0584\u0561\u0580\u056B \u0574\u056B\u057B\u0576\u0561\u056F\u0561\u0580\u0563 \u0564\u057A\u0580\u0578\u0581",
        "\u053C\u0561\u0576\u057B\u056B\u056F\u056B \u0574\u056B\u057B\u0576\u0561\u056F\u0561\u0580\u0563 \u0564\u057A\u0580\u0578\u0581",
      ],
      numberOfStudents: 6,
    },
    highlights: [
      "\u0535\u0580\u0565\u0584 \u0561\u0577\u056D\u0561\u057F\u0561\u0576\u0578\u0581\u0576\u0565\u0580\u056B \u0570\u0561\u0574\u0561\u0563\u0578\u0580\u056E\u0561\u056F\u0581\u0578\u0582\u0569\u0575\u0561\u0576 \u0561\u0580\u0564\u0575\u0578\u0582\u0576\u0584\u0578\u0582\u0574 \u0571\u0587\u0561\u057E\u0578\u0580\u057E\u0561\u056E \u0574\u056B\u0561\u057D\u0576\u0561\u056F\u0561\u0576 \u0569\u056B\u0574",
      "\u0544\u0561\u057D\u0576\u0561\u056F\u0581\u0578\u0582\u0569\u0575\u0578\u0582\u0576 DigiCamp \u0565\u057C\u0561\u0574\u0580\u0581\u0561\u0577\u0561\u0580\u056B\u0576 (\u0544\u056B\u057F\u0584, \u0544\u0577\u0561\u056F\u0578\u0582\u0575\u0569, \u0544\u0561\u0580\u0574\u0576\u0561\u056F\u0580\u0569\u0578\u0582\u0569\u0575\u0578\u0582\u0576)",
      "\u00AB\u0543\u0561\u057F\u0580\u0561\u056F\u00BB \u057D\u057F\u0561\u0580\u057F\u0561\u0583 \u0563\u0561\u0572\u0561\u0583\u0561\u0580\u056B \u0576\u0565\u0580\u056F\u0561\u0575\u0561\u0581\u0578\u0582\u0574",
    ],
    language: "hy",
    content:
      "2022 \u0569\u057E\u0561\u056F\u0561\u0576\u056B \u0561\u0574\u057C\u0561\u0576\u0568 \u0531\u057C\u0561\u0583\u056B\u056B, \u054E\u0561\u0580\u0564\u0561\u0584\u0561\u0580\u056B \u0587 \u053C\u0561\u0576\u057B\u056B\u056F\u056B \u0531\u0580\u0574\u0561\u0569 \u056B\u0576\u056A\u0565\u0576\u0565\u0580\u0561\u056F\u0561\u0576 \u0561\u0577\u056D\u0561\u057F\u0561\u0576\u0578\u0581\u0576\u0565\u0580\u056B \u057D\u0561\u0576\u0565\u0580\u0578\u057E \u0571\u0587\u0561\u057E\u0578\u0580\u0565\u0581\u056B\u0576\u0584 \u0574\u056B\u0561\u057D\u0576\u0561\u056F\u0561\u0576 \u0569\u056B\u0574 \u0587 \u0574\u0565\u056E \u0578\u0563\u0587\u0578\u0580\u0578\u0582\u0569\u0575\u0561\u0574\u0562 \u0574\u0565\u056F\u0576\u0565\u0581\u056B\u0576\u0584 \u0534\u056B\u056C\u056B\u057B\u0561\u0576\u055D \u0574\u0561\u057D\u0576\u0561\u056F\u0581\u0565\u056C\u0578\u0582 DigiCamp 2022 \u057F\u0565\u056D\u0576\u0578\u056C\u0578\u0563\u056B\u0561\u056F\u0561\u0576 \u0573\u0561\u0574\u0562\u0561\u0580\u056B\u0576\u0589",
  },
  // ArmRobotics 2022 - English
  {
    id: "armrobotics-2022",
    slug: "armrobotics-2022",
    title: "ArmRobotics 2022. Autonomous Robots in a Smart Farm",
    year: 2022,
    date: "2022-12-11",
    category: "competition",
    image: "/events/armrobotics-smart-farm.jpg",
    location: "Dilijan, Armenia",
    technologies: [
      "Python",
      "Computer Vision",
      "PID Control Algorithm",
      "Arduino",
      "Machine Learning",
      "Smartphone Integration",
      "Robotics",
    ],
    participants: {
      schools: ["Family Center (Gyumri)", "Meghrashen Secondary School", "Arapi Secondary School"],
      numberOfStudents: 0,
    },
    highlights: [
      "First team to implement AI-based animal recognition using smartphone imagery",
      "Innovative PID algorithm that adapts to varying lighting conditions without manual recalibration",
      "Cross-school collaboration demonstrating regional STEM ecosystem strength",
    ],
    language: "en",
    content:
      'On December 11, 2022, the 14th Armenian Robotics Championship, "ArmRobotics", took place at the Dilijan Central School. Students from the "Family" Center in Gyumri, and the "Armath" laboratories of Meghrashen and Arapi participated as a united team. The theme of the competition was "Smart Farm". Our team was tasked with designing and building an autonomous robot that would solve farm agro-problems using pre-programmed automated solutions.',
  },
  // ArmRobotics 2022 - Armenian
  {
    id: "armrobotics-2022",
    slug: "armrobotics-2022",
    title:
      "ArmRobotics 2022. \u053B\u0576\u0584\u0576\u0561\u056F\u0561\u057C\u0561\u057E\u0561\u0580\u057E\u0578\u0572 \u057C\u0578\u0562\u0578\u057F\u0576\u0565\u0580\u0568 \u056D\u0565\u056C\u0561\u0581\u056B \u0561\u0563\u0561\u0580\u0561\u056F\u0578\u0582\u0574",
    year: 2022,
    date: "2022-12-11",
    category: "competition",
    image: "/events/armrobotics-smart-farm.jpg",
    location:
      "\u0534\u056B\u056C\u056B\u057B\u0561\u0576, \u0540\u0561\u0575\u0561\u057D\u057F\u0561\u0576",
    technologies: [
      "Python",
      "\u0540\u0561\u0574\u0561\u056F\u0561\u0580\u0563\u0579\u0561\u0575\u056B\u0576 \u057F\u0565\u057D\u0578\u0572\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
      "PID \u056F\u0561\u057C\u0561\u057E\u0561\u0580\u0574\u0561\u0576 \u0561\u056C\u0563\u0578\u0580\u056B\u0569\u0574",
      "Arduino",
      "\u0544\u0565\u0584\u0565\u0576\u0561\u0575\u0561\u056F\u0561\u0576 \u0578\u0582\u057D\u0578\u0582\u0581\u0578\u0582\u0574",
      "\u054D\u0574\u0561\u0580\u0569\u0586\u0578\u0576\u056B \u056B\u0576\u057F\u0565\u0563\u0580\u0578\u0582\u0574",
      "\u054C\u0578\u0562\u0578\u057F\u0561\u0577\u056B\u0576\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
    ],
    participants: {
      schools: [
        "\u00AB\u0538\u0576\u057F\u0561\u0576\u056B\u0584\u00BB \u056F\u0565\u0576\u057F\u0580\u0578\u0576 (\u0533\u0575\u0578\u0582\u0574\u0580\u056B)",
        "\u0544\u0565\u0572\u0580\u0561\u0577\u0565\u0576\u056B \u0574\u056B\u057B\u0576\u0561\u056F\u0561\u0580\u0563 \u0564\u057A\u0580\u0578\u0581",
        "\u0531\u057C\u0561\u0583\u056B\u056B \u0574\u056B\u057B\u0576\u0561\u056F\u0561\u0580\u0563 \u0564\u057A\u0580\u0578\u0581",
      ],
      numberOfStudents: 0,
    },
    highlights: [
      "\u0531\u057C\u0561\u057B\u056B\u0576 \u0569\u056B\u0574\u0568, \u0578\u0580\u0568 \u056F\u056B\u0580\u0561\u057C\u0565\u0581 \u057D\u0574\u0561\u0580\u0569\u0586\u0578\u0576\u056B \u057F\u0565\u057D\u0561\u056D\u0581\u056B\u056F\u0578\u057E \u0531\u0532 \u0570\u0561\u0574\u0561\u056F\u0561\u0580\u0563\u055D \u056F\u0565\u0576\u0564\u0561\u0576\u056B\u0576\u0565\u0580\u056B \u0573\u0561\u0576\u0561\u0579\u0574\u0561\u0576 \u0570\u0561\u0574\u0561\u0580",
      "\u0546\u0578\u0580\u0561\u0580\u0561\u0580\u0561\u056F\u0561\u0576 PID \u0561\u056C\u0563\u0578\u0580\u056B\u0569\u0574, \u0578\u0580\u0568 \u0561\u057E\u057F\u0578\u0574\u0561\u057F \u056F\u0565\u0580\u057A\u0578\u057E \u0570\u0561\u0580\u0574\u0561\u0580\u057E\u0578\u0582\u0574 \u0567 \u056C\u0578\u0582\u057D\u0561\u057E\u0578\u0580\u0578\u0582\u0569\u0575\u0561\u0576 \u057F\u0561\u0580\u0562\u0565\u0580 \u057A\u0561\u0575\u0574\u0561\u0576\u0576\u0565\u0580\u056B\u0576",
      "\u0544\u056B\u057B\u0564\u057A\u0580\u0578\u0581\u0561\u056F\u0561\u0576 \u0570\u0561\u0574\u0561\u0563\u0578\u0580\u056E\u0561\u056F\u0581\u0578\u0582\u0569\u0575\u0578\u0582\u0576, \u0578\u0580\u0568 \u0581\u0578\u0582\u0581\u0561\u0564\u0580\u0578\u0582\u0574 \u0567 \u057F\u0561\u0580\u0561\u056E\u0561\u0577\u0580\u057B\u0561\u0576\u0561\u0575\u056B\u0576 \u0531\u0580\u0574\u0561\u0569\u0561\u056F\u0561\u0576 \u0567\u056F\u0578\u0570\u0561\u0574\u0561\u056F\u0561\u0580\u0563\u056B \u0578\u0582\u056A\u0568",
    ],
    language: "hy",
    content:
      "2022 \u0569\u057E\u0561\u056F\u0561\u0576\u056B \u0564\u0565\u056F\u057F\u0565\u0574\u0562\u0565\u0580\u056B 11-\u056B\u0576 \u0534\u056B\u056C\u056B\u057B\u0561\u0576\u056B \u056F\u0565\u0576\u057F\u0580\u0578\u0576\u0561\u056F\u0561\u0576 \u0564\u057A\u0580\u0578\u0581\u0578\u0582\u0574 \u056F\u0561\u0575\u0561\u0581\u0561\u057E \u057C\u0578\u0562\u0578\u057F\u0561\u0577\u056B\u0576\u0578\u0582\u0569\u0575\u0561\u0576 \u0540\u0561\u0575\u0561\u057D\u057F\u0561\u0576\u056B 14-\u0580\u0564 \u0561\u057C\u0561\u057B\u0576\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568\u055D \u00ABArmRobotics\u00BB-\u0568: \u0544\u0580\u0581\u0578\u0582\u0575\u0569\u056B \u0569\u0565\u0574\u0561\u0576 \u00AB\u053D\u0565\u056C\u0561\u0581\u056B \u0561\u0563\u0561\u0580\u0561\u056F\u0576\u00BB \u0567\u0580\u0589 \u0544\u0565\u0580 \u0569\u056B\u0574\u056B \u0561\u057C\u057B\u0587 \u0564\u0580\u057E\u0561\u056E \u0567\u0580 \u056D\u0576\u0564\u056B\u0580\u055D \u0576\u0561\u056D\u0561\u0563\u056E\u0565\u056C \u0587 \u057A\u0561\u057F\u0580\u0561\u057D\u057F\u0565\u056C \u056B\u0576\u0584\u0576\u0561\u056F\u0561\u057C\u0561\u057E\u0561\u0580\u057E\u0578\u0572 \u057C\u0578\u0562\u0578\u057F, \u0578\u0580\u0568 \u056F\u056C\u0578\u0582\u056E\u0565\u0580 \u0561\u0563\u0561\u0580\u0561\u056F\u056B \u0561\u0563\u0580\u0578\u056D\u0576\u0564\u056B\u0580\u0576\u0565\u0580\u0568:",
  },
]

export function getEventBySlug(slug: string, lang: Language): Event | undefined {
  return eventsData.find((event) => event.slug === slug && event.language === lang)
}

export function getEventsSortedByYear(lang: Language): Event[] {
  return eventsData.filter((event) => event.language === lang).sort((a, b) => b.year - a.year)
}

export function getAllEventSlugs(): string[] {
  const slugs = new Set<string>()
  eventsData.forEach((event) => slugs.add(event.slug))
  return Array.from(slugs)
}
