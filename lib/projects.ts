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
    descriptionHy: string
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
    descriptionHy: "Բնական խոսքով սարքեր կառավարելու համակարգ՝ GPT-3.5 լեզվական մոդելի հիման վրա",
    shortDescription: "Control devices using natural language and AI",
    shortDescriptionHy: "Սարքերի կառավարում բնական լեզվի միջոցով",
    image: "/ai-device-control-interface.jpg",
    category: "Artificial Intelligence & IoT",
    categoryHy: "Արհեստական բանականություն և իրերի համացանց",
    year: "2023",
    featured: true,
    tools: ["GPT-3.5", "Arduino", "Relays", "Python", "Natural Language Processing"],
    toolsHy: ["GPT-3.5", "Arduino", "Ռելե", "Python", "Բնական լեզվի մշակում"],
    impact:
      "Demonstrated the practical application of AI in device control, pioneering a new level of human-device interaction through conversational interfaces.",
    impactHy: "Ցույց տվեց ԱԲ-ի գործնական կիրառումը սարքերի կառավարման գործում",
    challenge:
      "Creating a system that understands natural language commands with various phrasings and contexts while reliably controlling physical relay hardware.",
    challengeHy: "Ստեղծել համակարգ, որը կհասկանա բազմաթիվ ձևերով արտահայտված հրամանները",
    solution:
      "Integrated GPT-3.5 API with Arduino relay control to create a bidirectional communication system that interprets user commands and executes physical actions.",
    solutionHy: "Ինտեգրեցինք GPT-3.5-ը Arduino ռելեների կառավարման հետ",
    results: [
      "Successfully controlled 4 relay outputs with natural language commands",
      "System understood context-based commands like 'turn off all' or 'toggle the last connected relay'",
      "Created seamless user dialogue with the system for device management",
      "Presented at DigiCode 2023 to showcase AI capabilities in device automation",
    ],
    resultsHy: [
      "4 ռելեների հաջող կառավարում բնական լեզվի միջոցով",
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
        descriptionHy: "Բնական լեզվի և հրամանների ընկալման մեծ լեզվական մոդել",
      },
      {
        name: "Arduino",
        description: "Microcontroller platform for relay control and hardware interfacing",
        descriptionHy: "Միկրոկոնտրոլերային հարթակ ռելեների կառավարման և սարքերի փոխազդեցության համար",
      },
      {
        name: "Relay Control",
        description: "4 relays controlled through Arduino digital outputs based on AI-interpreted commands",
        descriptionHy: "4 ռելեներ, որոնք կառավարվում են Arduino թվային ելքերով՝ ԱԲ-ի կողմից ընկալված հրամանների հիման վրա",
      },
      {
        name: "Natural Language Processing",
        description: "Processing user input to extract intent and parameters for device control",
        descriptionHy: "Օգտատիրոջ մուտքային տվյալների մշակում՝ տեքստի իմաստի ու պարամետրերի դուրսբերման համար՝ սարքի կառավարման նպատակով",
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
    impactHy: "Ցույց է տալիս «սպառողից դեպի ստեղծող» անցման ուժը: Ուսուցիչներն այն կարող են օգտագործել դասերում տրամաբանական փականները վիզուալ բացատրելու համար, իսկ ուսանողները վստահություն են ձեռք բերում, որ իրենց ուսումնական գործիքները կարող են իրական, օգտակար կիրառություններ ստեղծել:",
    challenge:
      "Creating a complex database-like structure within Scratch's limitations while implementing realistic logic gate simulation with iterative algorithms that handle feedback loops and system stabilization.",
    challengeHy: "Scratch-ի սահմանափակ հնարավորությունների սահմաններում ստեղծել բարդ կառուցվածքով տվյալների բազա՝ իրականացնելով տրամաբանական փականների ռեալիստիկ սիմուլյացիա՝ իտերատիվ ալգորիթմներով, որոնք կառավարում են հետադարձ կապերը և համակարգի կայունացումը:",
    solution:
      "Designed a sophisticated data structure using Scratch lists to store logical elements, ports, and connections. Implemented an iterative calculation algorithm that updates output values based on inputs until the system reaches a stable state.",
    solutionHy: "Օգտագործելով Scratch ցուցակները տրամաբանական տարրերի, պորտերի և կապերի պահպանման համար, ստեղծել է բարդ տվյալների կառուցվածք: Իրականացվել է հաշվարկման իտերատիվ ալգորիթմ, որը թարմացնում է ելքային արժեքները՝ հիմնվելով մուտքերի վրա, մինչև համակարգը հասնի կայուն վիճակի:",
    results: [
      "Successfully simulates any combination of logic gates with realistic behavior",
      "Handles complex feedback loops and system stabilization iteratively",
      "Open-source project with public code available for remix and learning",
      "Presented at DigiCode 2025 republican stage in virtual laboratory category",
      "Created as educational tool to inspire students that learning tools can become real products",
    ],
    resultsHy: [
      "Հաջողությամբ նմանակում է տրամաբանական փականների ցանկացած համակցություն",
      "Կարողանում է աշխատել բարդ հետադարձ կապերի դեպքում",
      "Բաց կոդով նախագիծ՝ հասանելի վերամշակման և ուսուցման համար",
      "Ներկայացվել է DigiCode 2025-ի հանրապետական փուլում՝ «Վիրտուալ լաբորատորիա» անվանակարգում",
      "Ստեղծվել է որպես ուսումնական գործիք՝ ոգեշնչելու ուսանողներին, որ ուսումնական գործիքները կարող են դառնալ իրական պրոդուկտներ",
    ],
    studentName: "Olya Khachatryan",
    presentedAt: "DigiCode 2025",
    technologies: [
      {
        name: "Scratch 3",
        description: "Visual programming environment used to build the entire simulation system",
        descriptionHy: "Վիզուալ ծրագրավորման միջավայր՝ ամբողջ նմանակման համակարգը կառուցելու համար",
      },
      {
        name: "Database Design",
        description: "Data structure modeling with separate lists for elements, ports, inputs, and outputs",
        descriptionHy: "Տվյալների կառուցվածքի մոդելավորում՝ առանձին ցուցակներով տարրերի, պորտերի, մուտքերի և ելքերի համար",
      },
      {
        name: "Logic Gate Simulation",
        description: "Implementation of AND, OR, NOT, and other fundamental logic gates",
        descriptionHy: "ԵՎ, ԿԱՄ, ՈՉ և այլ հիմնարար տրամաբանական փականների իրականացում",
      },
      {
        name: "Iterative Algorithms",
        description:
          "Algorithm that calculates values iteratively until the system reaches stable state, handling feedback loops",
        descriptionHy: "Ալգորիթմ, որը հաշվարկում է արժեքները իտերատիվ եղանակով՝ մինչև համակարգը հասնի կայուն վիճակի, կառավարելով հետադարձ կապերը",
      },
    ],
  },
]
