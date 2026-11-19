const img = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

const yt = (id) => `https://www.youtube.com/watch?v=${id}`;

export const categories = [
  { name: "Development", description: "Web, mobile and software engineering." },
  { name: "Design", description: "UI, UX, graphics and product design." },
  { name: "Data Science", description: "Python, analytics, ML and AI." },
  { name: "Marketing", description: "Digital marketing and growth." },
  { name: "Business", description: "Business skills and productivity." },
  { name: "Photography", description: "Camera, lighting and editing." },
];

const sharedBenefits = [
  "Lifetime access to all lessons",
  "Hands-on projects and exercises",
  "Downloadable resources and notes",
  "Certificate of completion",
];

const sharedPrerequisites = [
  "A computer with an internet connection",
  "No prior experience required",
  "Curiosity and consistency",
];

function course({
  name,
  description,
  category,
  level,
  price,
  estimatedPrice,
  thumbnail,
  tags,
  purchased,
  rating,
  demoUrl,
  benefits = sharedBenefits,
  prerequisites = sharedPrerequisites,
  sections,
}) {
  return {
    course: {
      name,
      description,
      category,
      level,
      price,
      estimatedPrice,
      thumbnail,
      tags,
      purchased,
      rating,
      reviewCount: Math.round(purchased / 12),
      demoUrl,
      benefits: benefits.map((title) => ({ title })),
      prerequisites: prerequisites.map((title) => ({ title })),
      status: "PUBLISHED",
    },
    sections,
  };
}

export const courses = [
  course({
    name: "Complete Web Development Bootcamp",
    description:
      "Go from zero to job-ready developer. Build responsive websites with HTML, CSS, JavaScript, React and Node while shipping real projects.",
    category: "Development",
    level: "Beginner",
    price: 1999,
    estimatedPrice: 6999,
    thumbnail: img("1461749280684-dccba630e2f6"),
    tags: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    purchased: 1240,
    rating: 4.8,
    demoUrl: yt("G3e-cpL7ofc"),
    benefits: [
      "Build 6 portfolio-ready websites",
      "Master React and the component model",
      "Create REST APIs with Node and Express",
      "Deploy projects to production",
    ],
    sections: [
      {
        title: "Web Foundations",
        lectures: [
          ["How the Web Works", "Requests, responses and the browser rendering pipeline.", yt("G3e-cpL7ofc"), 12, true],
          ["HTML Structure and Semantics", "Build accessible, well-structured pages.", yt("qz0aGYrrlhU"), 24],
          ["CSS Layout with Flexbox and Grid", "Modern responsive layout techniques.", yt("1Rs2ND1ryYc"), 31],
        ],
      },
      {
        title: "JavaScript Essentials",
        lectures: [
          ["Variables, Types and Operators", "The building blocks of JavaScript.", yt("W6NZfCO5SIk"), 28],
          ["Functions, Arrays and Objects", "Write reusable, data-driven code.", yt("PkZNo7MFNFg"), 36],
          ["The DOM and Events", "Make pages interactive.", yt("0ik6X4DJKCc"), 29],
        ],
      },
      {
        title: "React and APIs",
        lectures: [
          ["React Components and Props", "Compose interfaces from small pieces.", yt("SqcY0GlETPk"), 33],
          ["State, Effects and Hooks", "Manage data and side effects.", yt("Tn6-PIqc4UM"), 41],
          ["Building a REST API with Express", "Connect your React app to a backend.", yt("fgTGADljAeg"), 37],
        ],
      },
    ],
  }),
  course({
    name: "React for Beginners",
    description:
      "Learn React the practical way: components, hooks, routing, data fetching and deployment, with a complete project at the end.",
    category: "Development",
    level: "Beginner",
    price: 999,
    estimatedPrice: 3999,
    thumbnail: img("1633356122544-f134324a6cee"),
    tags: ["React", "JavaScript", "Hooks", "Frontend"],
    purchased: 890,
    rating: 4.7,
    demoUrl: yt("SqcY0GlETPk"),
    sections: [
      {
        title: "Getting Started with React",
        lectures: [
          ["Why React?", "Understand the component model and virtual DOM.", yt("Tn6-PIqc4UM"), 15, true],
          ["Setting Up with Vite", "Create a modern React project in seconds.", yt("SqcY0GlETPk"), 18],
          ["JSX and Rendering", "Write markup directly in JavaScript.", yt("7fPXI_MnBOY"), 22],
        ],
      },
      {
        title: "Hooks in Practice",
        lectures: [
          ["useState and useEffect", "State and side effects without classes.", yt("Tn6-PIqc4UM"), 34],
          ["Forms and Controlled Inputs", "Build accessible, validated forms.", yt("SdzMBP9n3Dg"), 26],
          ["Custom Hooks", "Share logic across components.", yt("6ThXs-GjmjI"), 24],
        ],
      },
      {
        title: "Routing and Data",
        lectures: [
          ["Client-side Routing", "Navigate a single-page application.", yt("Ul3y1LXxzdU"), 30],
          ["Fetching Data with Axios", "Load remote data safely.", yt("p-S4reHnQ0s"), 27],
          ["Deploying Your App", "Ship your React project to the web.", yt("7x4UaEf5XmQ"), 20],
        ],
      },
    ],
  }),
  course({
    name: "Python & Data Science Fundamentals",
    description:
      "Start your data career with Python, NumPy, pandas and visualisation. Includes guided notebooks and a capstone analysis project.",
    category: "Data Science",
    level: "Beginner",
    price: 1499,
    estimatedPrice: 4999,
    thumbnail: img("1526374965328-7f61d4dc18c5"),
    tags: ["Python", "pandas", "NumPy", "Data Analysis"],
    purchased: 760,
    rating: 4.6,
    demoUrl: yt("rfscVS0vtbw"),
    sections: [
      {
        title: "Python Essentials",
        lectures: [
          ["Installing Python and Jupyter", "Set up your data science workspace.", yt("rfscVS0vtbw"), 16, true],
          ["Data Types and Control Flow", "Write your first Python programs.", yt("kqtD5dpn5PY"), 29],
          ["Functions and Modules", "Organise code like a professional.", yt("9Os0o3wzS_I"), 25],
        ],
      },
      {
        title: "Data Analysis with pandas",
        lectures: [
          ["Series and DataFrames", "The core pandas data structures.", yt("vmEHCJofslg"), 32],
          ["Cleaning Messy Data", "Handle missing values and types.", yt("ZOX9EgeuH7w"), 34],
          ["Grouping and Aggregation", "Summarise large datasets.", yt("txMdrV5oV9g"), 28],
        ],
      },
      {
        title: "Visualisation and Projects",
        lectures: [
          ["Charts with Matplotlib", "Communicate findings visually.", yt("UO98lJQ3QGI"), 26],
          ["Exploratory Data Analysis", "Ask and answer questions with data.", yt("WUeBzT43Oy0"), 38],
          ["Capstone: Sales Insights", "Analyse a real sales dataset.", yt("r-uOLxNrNk8"), 44],
        ],
      },
    ],
  }),
  course({
    name: "UI/UX Design Masterclass",
    description:
      "Design beautiful, usable products. Learn research, wireframing, visual design and Figma from working product designers.",
    category: "Design",
    level: "Intermediate",
    price: 1299,
    estimatedPrice: 4499,
    thumbnail: img("1561070791-2526d30994b5"),
    tags: ["Figma", "UX Research", "Wireframing", "Prototyping"],
    purchased: 540,
    rating: 4.5,
    demoUrl: yt("c9Wg6Cb_YlU"),
    sections: [
      {
        title: "Design Thinking",
        lectures: [
          ["What Makes a Good Interface", "Principles of usable design.", yt("c9Wg6Cb_YlU"), 21, true],
          ["User Research Basics", "Interview users and find real problems.", yt("B0OaVW9gK_Q"), 27],
          ["Mapping User Journeys", "Plan experiences end to end.", yt("3B0KcOQ8u7g"), 23],
        ],
      },
      {
        title: "Figma Deep Dive",
        lectures: [
          ["Frames, Layout and Auto Layout", "Design responsive screens faster.", yt("FTFaQWZBqQ8"), 35],
          ["Components and Variants", "Build a reusable design system.", yt("kS3nSNdC2eY"), 33],
          ["Prototyping Interactions", "Test flows before writing code.", yt("lTIe9DlX4fM"), 30],
        ],
      },
      {
        title: "Visual Design",
        lectures: [
          ["Typography and Colour", "Create hierarchy and contrast.", yt("sByzHoiYFX0"), 28],
          ["Spacing and Grids", "Bring order to your layouts.", yt("M7lrJzZl1Pk"), 24],
          ["Portfolio Case Study", "Present your design process.", yt("A5B4S0Z9YQw"), 26],
        ],
      },
    ],
  }),
  course({
    name: "Digital Marketing 2026",
    description:
      "SEO, paid ads, email and analytics — a modern, practical playbook for growing a business online.",
    category: "Marketing",
    level: "Beginner",
    price: 799,
    estimatedPrice: 2999,
    thumbnail: img("1533750349088-cd871a92f312"),
    tags: ["SEO", "Google Ads", "Email", "Analytics"],
    purchased: 410,
    rating: 4.4,
    demoUrl: yt("nU-IIXBWlS4"),
    sections: [
      {
        title: "Marketing Foundations",
        lectures: [
          ["The Modern Funnel", "Attract, convert and retain customers.", yt("nU-IIXBWlS4"), 18, true],
          ["Audience and Positioning", "Find the people who will buy.", yt("Z4C4k1C5r0Y"), 22],
          ["Content Strategy", "Plan content people actually want.", yt("h_c6bC0xHjA"), 25],
        ],
      },
      {
        title: "Search and Ads",
        lectures: [
          ["SEO Fundamentals", "Rank for the searches that matter.", yt("DvwS7cV9GmQ"), 31],
          ["Running Google Ads", "Set budgets and measure return.", yt("HjKJNfFQ3eI"), 33],
          ["Social Ads That Convert", "Creative, targeting and testing.", yt("Lq6T1tZ2tO8"), 27],
        ],
      },
      {
        title: "Email and Analytics",
        lectures: [
          ["Email Campaigns", "Build lists and write emails that get opened.", yt("J0b5C9w2lVw"), 24],
          ["Google Analytics 4", "Understand what your traffic does.", yt("2O0k5w8sO2E"), 29],
          ["Reporting to Stakeholders", "Turn data into decisions.", yt("UuV3Zz8wV3M"), 20],
        ],
      },
    ],
  }),
  course({
    name: "Advanced JavaScript Patterns",
    description:
      "Closures, prototypes, async patterns, modules and performance. For developers who want to write confident, production-grade JavaScript.",
    category: "Development",
    level: "Advanced",
    price: 1799,
    estimatedPrice: 5999,
    thumbnail: img("1579468118864-1b9ea3c0db4a"),
    tags: ["JavaScript", "Async", "Performance", "Design Patterns"],
    purchased: 320,
    rating: 4.9,
    demoUrl: yt("v2tJ2Y6g6cI"),
    sections: [
      {
        title: "Language Internals",
        lectures: [
          ["Execution Context and Hoisting", "What really happens when code runs.", yt("v2tJ2Y6g6cI"), 26, true],
          ["Closures in Depth", "The pattern behind React hooks.", yt("3a0f1s2d3f4"), 34],
          ["The Prototype Chain", "How objects inherit.", yt("5a1b2c3d4e5"), 30],
        ],
      },
      {
        title: "Async Mastery",
        lectures: [
          ["Promises and Error Handling", "Compose asynchronous operations.", yt("6a1b2c3d4e5"), 32],
          ["Async/Await Patterns", "Write readable async code.", yt("7a1b2c3d4e5"), 29],
          ["Concurrency and Cancellation", "Avoid race conditions.", yt("8a1b2c3d4e5"), 35],
        ],
      },
      {
        title: "Production Patterns",
        lectures: [
          ["Modules and Bundling", "Organise a large codebase.", yt("9a1b2c3d4e5"), 27],
          ["Performance Profiling", "Find and fix slow code.", yt("0a1b2c3d4e5"), 33],
          ["Testing JavaScript", "Unit and integration tests that last.", yt("1a1b2c3d4e5"), 31],
        ],
      },
    ],
  }),
  course({
    name: "Business Analytics with Excel",
    description:
      "Master Excel formulas, pivot tables, dashboards and scenario analysis to make better business decisions.",
    category: "Business",
    level: "Beginner",
    price: 699,
    estimatedPrice: 2499,
    thumbnail: img("1551288049-bebda4e38f71"),
    tags: ["Excel", "Dashboards", "Pivot Tables", "Analysis"],
    purchased: 260,
    rating: 4.3,
    demoUrl: yt("Vl0H-qTclOg"),
    sections: [
      {
        title: "Excel Essentials",
        lectures: [
          ["Spreadsheet Fundamentals", "Navigate and structure workbooks.", yt("Vl0H-qTclOg"), 19, true],
          ["Formulas and Functions", "From SUM to XLOOKUP.", yt("shY7w0pU0dI"), 28],
          ["Data Validation and Tables", "Keep data clean and reliable.", yt("e1c2d3f4g5h"), 22],
        ],
      },
      {
        title: "Analysis Tools",
        lectures: [
          ["Pivot Tables", "Summarise thousands of rows in seconds.", yt("i1c2d3f4g5h"), 34],
          ["Charts and Dashboards", "Build decision-ready visuals.", yt("j1c2d3f4g5h"), 31],
          ["What-if Analysis", "Model different business scenarios.", yt("k1c2d3f4g5h"), 26],
        ],
      },
      {
        title: "Business Reporting",
        lectures: [
          ["Budgeting Models", "Plan and forecast revenue.", yt("l1c2d3f4g5h"), 30],
          ["KPI Tracking", "Measure what matters.", yt("m1c2d3f4g5h"), 25],
          ["Presenting Insights", "Turn spreadsheets into stories.", yt("n1c2d3f4g5h"), 21],
        ],
      },
    ],
  }),
  course({
    name: "Complete Photography Course",
    description:
      "Take control of your camera. Learn exposure, composition, lighting and editing to create photographs you are proud of.",
    category: "Photography",
    level: "Beginner",
    price: 599,
    estimatedPrice: 1999,
    thumbnail: img("1502920917128-1aa500764cbd"),
    tags: ["Camera", "Composition", "Lightroom", "Lighting"],
    purchased: 180,
    rating: 4.2,
    demoUrl: yt("V7z7BAZdt2M"),
    sections: [
      {
        title: "Camera Basics",
        lectures: [
          ["Exposure Triangle", "Aperture, shutter speed and ISO.", yt("V7z7BAZdt2M"), 22, true],
          ["Lenses and Focal Length", "Choose the right lens.", yt("o1c2d3f4g5h"), 18],
          ["Manual Mode Confidence", "Take full creative control.", yt("p1c2d3f4g5h"), 27],
        ],
      },
      {
        title: "Composition",
        lectures: [
          ["Framing and Rule of Thirds", "Guide the viewer's eye.", yt("q1c2d3f4g5h"), 20],
          ["Light and Shadow", "Use natural light beautifully.", yt("r1c2d3f4g5h"), 24],
          ["Telling Stories with Photos", "Create images with meaning.", yt("s1c2d3f4g5h"), 23],
        ],
      },
      {
        title: "Editing Workflow",
        lectures: [
          ["Importing and Organising", "Build a reliable library.", yt("t1c2d3f4g5h"), 17],
          ["Lightroom Develop Module", "Edit colour and tone.", yt("u1c2d3f4g5h"), 32],
          ["Exporting for Print and Web", "Prepare files correctly.", yt("v1c2d3f4g5h"), 19],
        ],
      },
    ],
  }),
  course({
    name: "Machine Learning A-Z",
    description:
      "Understand and build supervised and unsupervised models with scikit-learn, from regression to clustering and model evaluation.",
    category: "Data Science",
    level: "Advanced",
    price: 2499,
    estimatedPrice: 7999,
    thumbnail: img("1555949963-aa79dcee981c"),
    tags: ["Machine Learning", "scikit-learn", "Python", "Statistics"],
    purchased: 690,
    rating: 4.7,
    demoUrl: yt("i_LwzRVP7bg"),
    sections: [
      {
        title: "ML Foundations",
        lectures: [
          ["What Machine Learning Is", "Models, features and labels.", yt("i_LwzRVP7bg"), 24, true],
          ["Training and Testing", "Evaluate models honestly.", yt("w1c2d3f4g5h"), 29],
          ["Feature Engineering", "Prepare data for models.", yt("x1c2d3f4g5h"), 31],
        ],
      },
      {
        title: "Supervised Learning",
        lectures: [
          ["Linear and Logistic Regression", "Predict numbers and classes.", yt("y1c2d3f4g5h"), 35],
          ["Decision Trees and Forests", "Powerful, interpretable models.", yt("z1c2d3f4g5h"), 33],
          ["Support Vector Machines", "Margins and kernels.", yt("a2c2d3f4g5h"), 30],
        ],
      },
      {
        title: "Unsupervised Learning",
        lectures: [
          ["Clustering with K-Means", "Find structure in unlabelled data.", yt("b2c2d3f4g5h"), 28],
          ["Dimensionality Reduction", "PCA and feature compression.", yt("c2c2d3f4g5h"), 26],
          ["End-to-End ML Project", "Ship a complete model pipeline.", yt("d2c2d3f4g5h"), 42],
        ],
      },
    ],
  }),
  course({
    name: "Full Stack MERN Project Bootcamp",
    description:
      "Build and deploy a production-style MERN application: authentication, payments, dashboards and CI-ready workflows.",
    category: "Development",
    level: "Intermediate",
    price: 2199,
    estimatedPrice: 6999,
    thumbnail: img("1517180102446-f3ece451e9d8"),
    tags: ["MongoDB", "Express", "React", "Node.js"],
    purchased: 980,
    rating: 4.8,
    demoUrl: yt("fgTGADljAeg"),
    sections: [
      {
        title: "Project Setup",
        lectures: [
          ["Architecture and Folder Structure", "Plan a scalable full-stack app.", yt("fgTGADljAeg"), 23, true],
          ["Express and MongoDB", "Build the data layer.", yt("Oe421EPjeBE"), 34],
          ["Authentication with JWT", "Secure routes and sessions.", yt("mbsmsm6ppjg"), 37],
        ],
      },
      {
        title: "Building the Client",
        lectures: [
          ["React Router and Layouts", "Structure the frontend.", yt("Ul3y1LXxzdU"), 29],
          ["Data Fetching with React Query", "Server state done right.", yt("novnyCaa7To"), 32],
          ["Forms and Validation", "Reliable user input.", yt("SdzMBP9n3Dg"), 28],
        ],
      },
      {
        title: "Shipping",
        lectures: [
          ["Payments and Orders", "Add a checkout flow.", yt("1r_FP0tE0fM"), 36],
          ["Deploying the API", "Host Node on Render.", yt("2r_FP0tE0fM"), 25],
          ["Deploying the Frontend", "Ship to Vercel.", yt("3r_FP0tE0fM"), 22],
        ],
      },
    ],
  }),
];
