export interface ProjectDetailType {
  id: string
  slug: string
  title: string
  titleHy: string
  description: string
  descriptionHy: string
  shortDescription: string
  shortDescriptionHy: string
  image: string
  category: string
  categoryHy: string
  year: string
  featured: boolean
  tools: string[]
  toolsHy: string[]
  impact: string
  impactHy: string
  challenge: string
  challengeHy: string
  solution: string
  solutionHy: string
  results: string[]
  resultsHy: string[]
  studentName: string
  presentedAt?: string
  technologies: {
    name: string
    description: string
  }[]
}

export const projects: ProjectDetailType[] = [
  {
    id: "1",
    slug: "talk-freely",
    title: "TalkFreely",
    titleHy: "TalkFreely",
    description:
      "An AI-powered natural language interface for controlling physical devices and systems using conversational commands.",
    descriptionHy: "Իսկական բառերով սարքեր վերահսկելու համակարգ՝ GPT-3.5 լեզվական մոդելի հիման վրա",
    shortDescription: "Control devices using natural language and AI",
    shortDescriptionHy: "Սարքերի վերահսկում բնական լեզվի միջոցով",
    image: "/ai-device-control-interface.jpg",
    category: "Artificial Intelligence & IoT",
    categoryHy: "Հարուածական բանականություն և IoT",
    year: "2023",
    featured: true,
    tools: ["GPT-3.5", "Arduino", "Relays", "Python", "Natural Language Processing"],
    toolsHy: ["GPT-3.5", "Arduino", "Relay", "Python", "Natural Language Processing"],
    impact:
      "Demonstrated the practical application of AI in device control, pioneering a new level of human-device interaction through conversational interfaces.",
    impactHy: "Ցույց տվեց AI-ի գործնական կիրառումը սարքերի վերահսկման ժամանակ",
    challenge:
      "Creating a system that understands natural language commands with various phrasings and contexts while reliably controlling physical relay hardware.",
    challengeHy: "Ստեղծել համակարգ, որը հասկանա բազմաթիվ ձևերով արտահայտված հրամանները",
    solution:
      "Integrated GPT-3.5 API with Arduino relay control to create a bidirectional communication system that interprets user commands and executes physical actions.",
    solutionHy: "Ինտեգրեցինք GPT-3.5-ը Arduino relay վերահսկման հետ",
    results: [
      "Successfully controlled 4 relay outputs with natural language commands",
      "System understood context-based commands like 'turn off all' or 'toggle the last connected relay'",
      "Created seamless user dialogue with the system for device management",
      "Presented at DigiCode 2023 to showcase AI capabilities in device automation",
    ],
    resultsHy: [
      "4 relay-ի հաջող վերահսկում բնական լեզվի միջոցով",
      "Համակարգը հասկանում էր համատեքստային հրամանները",
      "Ստեղծվեց անբաժանելի երկխոսություն համակարգի հետ",
      "Ներկայացվել է DigiCode 2023-ում",
    ],
    studentName: "Narek Saroyan",
    presentedAt: "DigiCode 2023",
    technologies: [
      {
        name: "GPT-3.5",
        description: "Large language model for natural language understanding and command interpretation",
      },
      {
        name: "Arduino",
        description: "Microcontroller platform for relay control and hardware interfacing",
      },
      {
        name: "Relay Control",
        description: "4 relays controlled through Arduino digital outputs based on AI-interpreted commands",
      },
      {
        name: "Natural Language Processing",
        description: "Processing user input to extract intent and parameters for device control",
      },
    ],
  },
  {
    id: "2",
    slug: "logic-gate-simulator",
    title: "LogicGateSimulator",
    titleHy: "LogicGateSimulator",
    description:
      "An interactive educational simulation tool for teaching and learning digital logic gates, built entirely in Scratch 3. Features database-like data structures and iterative algorithms for realistic logic simulation.",
    descriptionHy:
      "Ինտերակտիվ ուսումնական նմանակացման գործիք թվային տրամաբանական դարպասներ սովորեցնելու և սովորելու համար, ամբողջությամբ կառուցված Scratch 3-ում:",
    shortDescription: "Interactive logic gate simulation tool built in Scratch",
    shortDescriptionHy: "Տրամաբանական դարպասների ինտերակտիվ նմանակացում",
    image: "/logic-gate-simulator.jpg",
    category: "Programming & Educational Tools",
    categoryHy: "Ծրագրավորում և ուսումնական գործիքներ",
    year: "2025",
    featured: true,
    tools: ["Scratch 3", "Database Design", "Logic Gates", "Simulation Algorithms"],
    toolsHy: ["Scratch 3", "Տվյալների բազայի դիզայն", "Տրամաբանական դարպասներ", "Նմանակացման ալգորիթմներ"],
    impact:
      "Demonstrates the power of transitioning from tool consumer to tool producer. Teachers can use this in classrooms to visually explain logic gates, while students gain confidence that their learning tools can create real, useful applications.",
    impactHy: "Ցույց տալիս է 'սպառող' -ից 'արտադրող' -ի անցման ուժը: Ուսուչներն այն կարող են օգտագործել դասերում:",
    challenge:
      "Creating a complex database-like structure within Scratch's limitations while implementing realistic logic gate simulation with iterative algorithms that handle feedback loops and system stabilization.",
    challengeHy: "Scratch-ի սահմանափակ ներուժի մեջ բարդ տվյալների բազա ստեղծել:",
    solution:
      "Designed a sophisticated data structure using Scratch lists to store logical elements, ports, and connections. Implemented an iterative calculation algorithm that updates output values based on inputs until the system reaches a stable state.",
    solutionHy: "Scratch-ի տիրույթներ օգտագործել տվյալների բազայի նմանակացման համար:",
    results: [
      "Successfully simulates any combination of logic gates with realistic behavior",
      "Handles complex feedback loops and system stabilization iteratively",
      "Open-source project with public code available for remix and learning",
      "Presented at DigiCode 2025 republican stage in virtual laboratory category",
      "Created as educational tool to inspire students that learning tools can become real products",
    ],
    resultsHy: [
      "Հաջողությամբ նմանակում է տրամաբանական դարպասների ցանկացած համակցություն",
      "Կարողանում է աշխատել բարդ հետադարձ կապերի հետ",
      "Բաց կոդ՝ ուսանողների համար ներ վերամիջատվի և սովորելու համար",
      "Ներկայացվել է DigiCode 2025-ում",
      "Ստեղծվել ինչպես ուսումնական գործիք",
    ],
    studentName: "Olya Khachatryan",
    presentedAt: "DigiCode 2025",
    technologies: [
      {
        name: "Scratch 3",
        description: "Visual programming environment used to build the entire simulation system",
      },
      {
        name: "Database Design",
        description: "Data structure modeling with separate lists for elements, ports, inputs, and outputs",
      },
      {
        name: "Logic Gate Simulation",
        description: "Implementation of AND, OR, NOT, and other fundamental logic gates",
      },
      {
        name: "Iterative Algorithms",
        description:
          "Algorithm that calculates values iteratively until the system reaches stable state, handling feedback loops",
      },
    ],
  },
]
