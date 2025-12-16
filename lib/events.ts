export interface Event {
  id: string
  slug: string
  title: string
  titleHy: string
  description: string
  descriptionHy: string
  year: number
  date: string
  location: string
  locationHy: string
  image: string
  category: "competition" | "workshop" | "camp" | "exhibition"
  summary: string
  summaryHy: string
  challenge: string
  challengeHy: string
  achievements: string[]
  achievementsHy: string[]
  participants: {
    schools: string[]
    schoolsHy: string[]
    numberOfStudents: number
  }
  technologies: string[]
  technologiesHy: string[]
  results: string
  resultsHy: string
  highlights: string[]
  highlightsHy: string[]
  relatedProjects?: string[]
}

export const events: Event[] = [
  {
    id: "armat-2022",
    slug: "armat-armrobotics-2022",
    title: "Armat - ArmRobotics 2022 Smart Farm Robot",
    titleHy: "Արմաթ - ArmRobotics 2022 Խելացի Ագարակ",
    description:
      "A groundbreaking robotics solution for smart farm management featuring AI-powered animal recognition and adaptive line-tracking technology",
    descriptionHy:
      "Խելացի ֆերմայի կառավարման ռոբոտաշինական լուծում՝ ԱԲ-ով աշխատող կենդանիների ճանաչմամբ և գծի հետևման տեխնոլոգիայով",
    year: 2022,
    date: "2022",
    location: "Armenia",
    locationHy: "Հայաստան",
    image: "/armat-smart-farm.jpg",
    category: "competition",
    summary:
      "In 2022, a collaborative team from Gyumri's Family Center, Meghrashen, and Arapi secondary schools participated in the Armat ArmRobotics competition, which focused on smart farm agro-technological solutions. The team developed an innovative system combining computer vision and advanced control algorithms.",
    summaryHy:
      "2022-ին Գյումրու «Ընտանիք» կենտրոնի, Մեղրաշենի և Առափիի միջնակարգ դպրոցների համատեղ թիմը մասնակցեց ArmRobotics մրցույթին, որը կենտրոնացած էր խելացի ագարակի ագրո-տեխնոլոգիական լուծումների վրա: Թիմը մշակեց նորարարական համակարգ, որը համատեղում է ապարատային տեսողությունը և առաջադեմ կառավարման ալգորիթմները:",
    challenge:
      "The competition challenged teams to develop agro-technological solutions for smart farming. The team aimed to create a system that could intelligently manage farm operations through automation and AI, specifically targeting animal monitoring and autonomous navigation.",
    challengeHy:
      "Մրցույթը մարտահրավեր էր նետում թիմերին՝ մշակել ագրո-տեխնոլոգիական լուծումներ խելացի գյուղատնտեսության համար: Թիմը նպատակ ուներ ստեղծել մի համակարգ, որը կարող էր խելացիորեն կառավարել ֆերմայի գործողությունները ավտոմատացման և AI-ի միջոցով՝ հատուկ թիրախավորելով կենդանիների մոնիտորինգը և ինքնավար նավիգացիան:",
    achievements: [
      "Developed AI-powered animal recognition system using embedded smartphone imagery and computer vision",
      "Implemented adaptive PID-based line-tracking algorithm that automatically adjusts to different lighting conditions",
      "Successfully integrated multiple technologies including robotics, AI, and real-time image processing",
    ],
    achievementsHy: [
      "Մշակել է ԱԲ-ով աշխատող կենդանիների ճանաչման համակարգ՝ օգտագործելով սմարթֆոնի տեսախցիկը",
      "Իրականացրել է PID-ի վրա հիմնված գծի հետևման ալգորիթմ, որն ավտոմատ կերպով հարմարվում է լուսավորության տարբեր պայմաններին",
      "Հաջողությամբ ինտեգրել է բազմաթիվ տեխնոլոգիաներ, այդ թվում՝ ռոբոտաշինություն, ԱԲ և իրական ժամանակում պատկերի մշակում",
    ],
    participants: {
      schools: ["Family Center (Gyumri)", "Meghrashen Secondary School", "Arapi Secondary School"],
      schoolsHy: ["«Ընտանիք» կենտրոն (Գյումրի)", "Մեղրաշենի միջնակարգ դպրոց", "Առափիի միջնակարգ դպրոց"],
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
    technologiesHy: [
      "Python",
      "Համակարգչային տեսողություն",
      "PID կառավարման ալգորիթմ",
      "Arduino",
      "Մեքենայական ուսուցում",
      "Սմարթֆոնի ինտեգրում",
      "Ռոբոտաշինություն",
    ],
    results:
      "The team's distinctive approaches to animal recognition and adaptive line tracking demonstrated the application of AI and advanced control systems in agricultural robotics, showcasing how young engineers can create practical solutions for real-world challenges.",
    resultsHy:
      "Թիմի յուրահատուկ մոտեցումները կենդանիների ճանաչման և գծի հետևման հարցում ցույց տվեցին ԱԲ-ի և առաջադեմ կառավարման համակարգերի կիրառումը գյուղատնտեսական ռոբոտաշինության մեջ՝ ցուցադրելով, թե ինչպես երիտասարդ ճարտարագետները կարող են ստեղծել գործնական լուծումներ իրական մարտահրավերների համար:",
    highlights: [
      "First team to implement AI-based animal recognition using smartphone imagery",
      "Innovative PID algorithm that adapts to varying lighting conditions without manual recalibration",
      "Cross-school collaboration demonstrating regional STEM ecosystem strength",
    ],
    highlightsHy: [
      "Առաջին թիմը, որը կիրառեց սմարթֆոնի տեսախցիկով, ԱԲ-ով աշխատող համակարգ՝ կենդանիների ճանաչման համակարգ",
      "Նորարարական PID ալգորիթմ, որը հարմարվում է լուսավորության տարբեր պայմաններին առանց ձեռքով վերակարգավորման",
      "Միջդպրոցական համագործակցություն, որը ցուցադրում է տարածաշրջանային ԲՏՃՄ էկոհամակարգի ուժը",
    ],
    relatedProjects: ["talk-freely"],
  },
  {
    id: "first-robotics-2025",
    slug: "first-robotics-2025",
    title: "FIRST Robotics Competition",
    titleHy: "FIRST Ռոբոտաշինության Մրցույթ",
    description:
      "An international engineering competition where high school students design, build, and program industrial-sized robots to compete in action-packed games",
    descriptionHy:
      "Միջազգային ինժեներական մրցույթ, որտեղ ավագ դպրոցի աշակերտները նախագծում, կառուցում և ծրագրավորում են արդյունաբերական չափսի ռոբոտներ՝ մրցելու համար:",
    year: 2025,
    date: "2025",
    location: "United States / International",
    locationHy: "ԱՄՆ / Միջազգային",
    image: "/first-robotics.jpg",
    category: "competition",
    summary:
      "A team from Arapi Secondary School, including student Narek Saroyan, represented Armenia at the prestigious FIRST Robotics Competition in the United States. The team was selected from 15,000 students from the 'Armath' Engineering Labs, with demonstrated technical excellence and English proficiency. FIRST Robotics is a world-renowned engineering competition where teams design, build, and program full-sized robots to compete in strategic gameplay, combining engineering, mechanics, programming, and teamwork.",
    summaryHy:
      "Արմաթի թիմը, ներառյալ Առափիի Արմաթի աշակերտ Նարեկ Սարոյանը, Հայաստանը ներկայացրեցին ԱՄՆ-ում կայացած հեղինակավոր FIRST Robotics մրցույթում: Թիմը ընտրվել էր «Արմաթ» ճարտարագիտական աշխատանոցների 15,000 ուսանողներից: FIRST Robotics-ը աշխարհահռչակ ինժեներական մրցույթ է, որտեղ թիմերը նախագծում, կառուցում և ծրագրավորում են ռոբոտներ ռազմավարական խաղերում մրցելու համար:",
    challenge:
      "Teams must design and build industrial-sized robots within a specific framework. The challenge involves mechanical engineering, software development, project management, and strategic thinking. Teams must work within constraints on budget, time, and resources while creating robots capable of competing at the highest levels of international engineering competition.",
    challengeHy:
      "Թիմերը պետք է նախագծեն և կառուցեն արդյունաբերական չափսի ռոբոտներ: Մարտահրավերը ներառում է մեխանիկական ինժեներություն, ծրագրային ապահովման մշակում, նախագծերի կառավարում և ռազմավարական մտածողություն:",
    achievements: [
      "Represented Armenia at an international competition",
      "Competed alongside teams from leading STEM programs around the world",
      "Demonstrated mastery of mechanical design, programming, and engineering principles",
    ],
    achievementsHy: [
      "Ներկայացրել է Հայաստանը միջազգային մրցույթում",
      "Մրցել է աշխարհի առաջատար ԲՏՃՄ ծրագրերի թիմերի կողքին",
      "Ցուցադրել է մեխանիկայի, ծրագրավորման և ինժեներական սկզբունքների տիրապետում",
    ],
    participants: {
      schools: ["Arapi Secondary School"],
      schoolsHy: ["Առափիի միջնակարգ դպրոց"],
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
    technologiesHy: [
      "Ռոբոտաշինություն",
      "Մեխանիկական ինժեներություն",
      "Ծրագրավորում",
      "CAD նախագծում",
      "Նախագծերի կառավարում",
      "Ինքնավար համակարգեր",
    ],
    results:
      "Narek's involvement in the team and participation in FIRST Robotics demonstrates the quality of education at Arapi's Armath Engineering Lab and the dedication of its students.",
    resultsHy:
      "Նարեկի ընդգրկվածությունը թիմում և մասնակցությունը FIRST Robotics-ին ցույց է տալիս Առափիի «Արմաթ» ճարտարագիտական աշխատանոցում կրթության որակը և ուսանողների նվիրվածությունը:",
    highlights: [
      "Team selected from 15,000 students - representing the top tier of regional STEM talent",
      "Competed at international FIRST Robotics event in the United States",
      "Represents Armenia's STEM education and engineering capabilities on the world stage",
    ],
    highlightsHy: [
      "Թիմը ընտրվել է 15,000 ուսանողներից՝ ներկայացնելով տարածաշրջանային STEM տաղանդների լավագույն մակարդակը",
      "Մասնակցել է FIRST Robotics միջազգային մրցույթին ԱՄՆ-ում",
      "Ներկայացնում է Հայաստանի STEM կրթությունը և ինժեներական կարողությունները համաշխարհային հարթակում",
    ],
    relatedProjects: ["talk-freely"],
  },
  {
    id: "digicode-2025",
    slug: "digicode-2025",
    title: "DigiCode 2025 Competition",
    titleHy: "DigiCode 2025 Մրցույթ",
    description:
      "A national digital innovation competition showcasing student projects in programming and digital design",
    descriptionHy:
      "Ազգային, թվային նորարարության մրցույթ, որը ներկայացնում է ուսանողական նախագծեր ծրագրավորման և թվային նախագծման ոլորտում",
    year: 2025,
    date: "2025",
    location: "Armenia",
    locationHy: "Հայաստան",
    image: "/digicode-competition.jpg",
    category: "competition",
    summary:
      "DigiCode is a prestigious national digital innovation competition bringing together talented students to showcase their programming and digital design projects. In 2025, Olya Khachatryan from Arapi Secondary School participated with the LogicGateSimulator project and successfully advanced through the republican stage of the competition.",
    summaryHy:
      "DigiCode-ը հեղինակավոր մրցույթ է, որը համախմբում է տաղանդավոր ուսանողներին՝ ներկայացնելու իրենց ծրագրավորման նախագծերը: 2025 թվականին Առափիի միջնակարգ դպրոցի աշակերտուհի Օլյա Խաչատրյանը մասնակցեց LogicGateSimulator նախագծով և հաջողությամբ անցավ մրցույթի հանրապետական փուլ:",
    challenge:
      "DigiCode challenges students to create innovative digital solutions that demonstrate technical skill, creativity, and practical application. Participants develop original projects and compete against talented students from across Armenia, presenting their work to judges and industry experts.",
    challengeHy:
      "DigiCode-ը մարտահրավեր է նետում ուսանողներին՝ ստեղծելու նորարարական թվային լուծումներ, որոնք ցուցադրում են տեխնիկական հմտություններ, ստեղծագործականություն և գործնական կիրառություն:",
    achievements: [
      "Successfully advanced through the republican stage of DigiCode 2025",
      "Created the LogicGateSimulator - an educational tool built entirely in Scratch",
      "Demonstrated how students can transition from learning with tools to creating useful applications",
      "Showcased practical educational value through interactive digital simulations",
    ],
    achievementsHy: [
      "Հաջողությամբ անցել է DigiCode 2025-ի հանրապետական փուլ",
      "Ստեղծել է LogicGateSimulator՝ ուսումնական գործիք, որն ամբողջությամբ կառուցված է Scratch-ով",
      "Ցուցադրել է, թե ինչպես կարող են ուսանողները գործիքներով սովորելուց անցնել օգտակար հավելվածներ ստեղծելուն",
      "Ցուցադրել է գործնական կրթական արժեք ինտերակտիվ թվային սիմուլյացիաների միջոցով",
    ],
    participants: {
      schools: ["Arapi Secondary School"],
      schoolsHy: ["Առափիի միջնակարգ դպրոց"],
      numberOfStudents: 1,
    },
    technologies: [
      "Scratch",
      "Visual Programming",
      "Educational Simulation",
      "Logic Gate Design",
      "User Interface Design",
    ],
    technologiesHy: [
      "Scratch",
      "Վիզուալ ծրագրավորում",
      "Կրթական սիմուլյացիա",
      "Տրամաբանական փականների նախագծում",
      "UI դիզայն",
    ],
    results:
      "Olya's LogicGateSimulator was recognized at DigiCode 2025 as a valuable educational tool. By passing the republican stage, the project demonstrated that students learning Scratch can create real, useful tools - not just practice exercises - providing motivation for other young programmers.",
    resultsHy:
      "Օլյայի LogicGateSimulator-ը ճանաչվել է DigiCode 2025-ում որպես արժեքավոր ուսումնական գործիք: Անցնելով հանրապետական փուլ՝ նախագիծը ցույց տվեց, որ Scratch սովորող ուսանողները կարող են ստեղծել իրական, օգտակար գործիքներ:",
    highlights: [
      "Passed the republican stage of DigiCode 2025",
      "Created a practical tool now used by teachers to explain logic concepts",
      "Proved that student projects can have real educational impact",
      "Inspired other students by showing visual programming can solve real problems",
    ],
    highlightsHy: [
      "Անցել է DigiCode 2025-ի հանրապետական փուլ",
      "Ստեղծել է գործիք, որն այժմ օգտագործվում է ուսուցիչների կողմից",
      "Ապացուցել է, որ ուսանողական նախագծերը կարող են ունենալ իրական կրթական ազդեցություն",
      "Ոգեշնչել է այլ ուսանողների՝ ցույց տալով, որ վիզուալ ծրագրավորումը կարող է լուծել իրական խնդիրներ",
    ],
    relatedProjects: ["logic-gate-simulator"],
  },
  {
    id: "digicamp-2022",
    slug: "digicamp-2022",
    title: "DigiCamp 2022: Mind-Culture-Physical Education Triathlon",
    titleHy: "DigiCamp 2022: Միտք-Մշակույթ-Սպորտ եռամարտ",
    description:
      "An immersive triathlon camp combining digital innovation, cultural exploration, and physical education in the mountains of Dilijan",
    descriptionHy:
      "Եռամարտ ճամբար Դիլիջանի լեռներում, որը համատեղում է թվային նորարարությունը, մշակութային բացահայտումները և սպորտը",
    year: 2022,
    date: "July 2022",
    location: "Dilijan, Armenia",
    locationHy: "Դիլիջան, Հայաստան",
    image: "/digicamp-2022.jpg",
    category: "camp",
    summary:
      "DigiCamp 2022 was an intensive triathlon camp held in July 2022 in Dilijan, Armenia, bringing together 14-17-year-old school children for an immersive experience combining digital innovation, cultural enrichment, and physical education. The camp was implemented by UATE.",
    summaryHy:
      "DigiCamp 2022-ը ինտենսիվ ճամբար էր, որն անցկացվեց 2022 թվականի հուլիսին Դիլիջանում՝ համախմբելով 14-17 տարեկան դպրոցականներին: Ճամբարն իրականացվել է ԱՏՁՄ-ի կողմից:",
    challenge:
      "To create a comprehensive educational experience that goes beyond traditional STEM learning by integrating cultural development and physical wellness, fostering well-rounded student development through diverse learning modalities in a mountain setting.",
    challengeHy:
      "Ստեղծել համապարփակ կրթական փորձ, որը դուրս է գալիս ավանդական ԲՏՃՄ ուսուցման սահմաններից՝ ինտեգրելով մշակութային զարգացումը և ֆիզիկական առողջությունը:",
    achievements: [
      "Successfully brought together students from three different schools in a collaborative learning environment",
      "Integrated digital innovation with cultural studies and physical activities",
      "Created a holistic educational experience combining mind, culture, and physical education",
      "Fostered cross-school partnerships and community building",
    ],
    achievementsHy: [
      "Հաջողությամբ համախմբեց երեք տարբեր դպրոցների ուսանողներին համագործակցային ուսումնական միջավայրում",
      "Ինտեգրեց թվային նորարարությունը մշակութային ուսումնասիրությունների և ֆիզիկական գործունեության հետ",
      "Ստեղծեց ամբողջական կրթական փորձ՝ համատեղելով միտքը, մշակույթը և ֆիզիկական կրթությունը",
      "Խթանեց միջդպրոցական գործընկերությունը",
    ],
    participants: {
      schools: ["Arapi Secondary School", "Vardakar Secondary School", "Lanjik Secondary School"],
      schoolsHy: ["Առափիի միջնակարգ դպրոց", "Վարդաքարի միջնակարգ դպրոց", "Լանջիկի միջնակարգ դպրոց"],
      numberOfStudents: 0,
    },
    technologies: ["STEM", "Digital Innovation", "Engineering", "Robotics"],
    technologiesHy: ["ԲՏՃՄ", "Թվային նորարարություն", "Ինժեներություն", "Ռոբոտաշինություն"],
    results:
      "DigiCamp 2022 successfully created a unique learning environment that combined technical education with cultural exploration and physical activities, demonstrating that comprehensive education extends beyond traditional classroom boundaries.",
    resultsHy:
      "DigiCamp 2022-ը հաջողությամբ ստեղծեց յուրահատուկ ուսումնական միջավայր, որը համատեղում էր տեխնիկական կրթությունը մշակութային բացահայտումների և ֆիզիկական ակտիվության հետ:",
    highlights: [
      "Unique triathlon format combining three educational pillars: mind, culture, and physical education",
      "Collaborative participation from three schools strengthening regional STEM community",
      "Partnership with prestigious institutions (UATE and Goethe Center)",
    ],
    highlightsHy: [
      "Եռամրցաշարի եզակի ձևաչափ, որը համատեղում է երեք կրթական հիմնասյուներ՝ միտք, մշակույթ և սպորտ",
      "Համագործակցային մասնակցություն երեք դպրոցներից",
      "Գործընկերություն հեղինակավոր հաստատությունների հետ",
    ],
  },
]

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((event) => event.slug === slug)
}

export function getEventById(id: string): Event | undefined {
  return events.find((event) => event.id === id)
}
