import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  LayoutDashboard, Settings, BookOpen, Trophy, Clock, Brain, Sparkles, CheckCircle2, X, Video, 
  Calendar, Bell, FileText, DownloadCloud, ShoppingCart, PlayCircle, Code, Atom, Calculator, Map, 
  Check, Upload, Timer, ChevronRight, ChevronLeft, Target, FlaskConical, ArrowRight, Flame, Crown, 
  MessageCircle, Send, List, Grid, Star, Maximize2, LogOut, Search, Users, Globe, Zap, GraduationCap, 
  Library, Menu, MoreVertical, Play, Share2, CreditCard, Shield, Activity, Award, TrendingUp, Pause, 
  Mic, Smile, Paperclip, Bot, MicOff, VideoOff, PhoneOff, Monitor, Trash2, Plus, ChevronDown, User, 
  Filter, Camera, CameraOff, ScreenShare, MapPin, CalendarDays, Laptop, ClipboardCheck, BarChart3,
  UserCheck, AlertCircle, Eye, Mail, Lock, RefreshCw, Palette, Smartphone, Wallet
} from 'lucide-react';

// --- DATA CONSTANTS ---

const TEXTBOOK_CHAPTERS: Record<string, string[]> = {
    "Campbell Biology": [
        "1. Evolution, the Themes of Biology", "2. The Chemical Context of Life", "3. Water and Life", "4. Carbon and Molecular Diversity", 
        "5. Structure/Function of Macromolecules", "6. Tour of the Cell", "7. Membrane Structure", "8. Metabolism", 
        "9. Cellular Respiration", "10. Photosynthesis", "11. Cell Communication", "12. The Cell Cycle", "13. Meiosis", 
        "14. Mendel and the Gene", "15. Chromosomal Basis of Inheritance", "16. Molecular Basis of Inheritance", 
        "17. Gene Expression", "18. Regulation of Gene Expression", "19. Viruses", "20. Biotechnology",
        "21. Genomes & Evolution", "22. Descent with Modification", "23. Evolution of Populations", "24. The Origin of Species",
        "25. History of Life on Earth", "26. Phylogeny", "27. Bacteria & Archaea", "28. Protists", "29. Plant Diversity I",
        "30. Plant Diversity II"
    ],
    "AoPS Vol 1": [
        "1. Exponents & Logarithms", "2. Complex Numbers", "3. Linear Equations", "4. Proportions", "5. Integers", 
        "6. Quadratic Equations", "7. Special Factorizations", "8. Geometry: Angles", "9. Geometry: Triangles", "10. Geometry: Circles",
        "11. Polygons", "12. 3D Geometry", "13. Counting Strategies", "14. Probability Basics", "15. Sets & Logic"
    ],
    "AoPS Vol 2": [
        "1. Logarithms", "2. Triangle Trig", "3. Cyclic Quads", "4. Conics", "5. Polynomials", "6. Functions", "7. Limits", "8. Complex Numbers",
        "9. Vectors", "10. Matrices", "11. Cross Products", "12. Advanced Inequalities"
    ],
    "Halliday Resnick": [
        "1. Measurement", "2. Motion Along a Line", "3. Vectors", "4. Motion in 2D/3D", "5. Force & Motion I", "6. Force & Motion II",
        "7. Kinetic Energy", "8. Potential Energy", "9. Center of Mass", "10. Rotation", "11. Torque", "12. Equilibrium",
        "13. Gravitation", "14. Fluids", "15. Oscillations", "16. Waves I", "17. Waves II", "18. Thermodynamics I"
    ],
    "Zumdahl Chemistry": [
        "1. Chemical Foundations", "2. Atoms, Molecules, Ions", "3. Stoichiometry", "4. Solution Stoichiometry", "5. Gases",
        "6. Thermochemistry", "7. Atomic Structure", "8. Bonding", "9. Orbitals", "10. Liquids & Solids",
        "11. Properties of Solutions", "12. Chemical Kinetics", "13. Chemical Equilibrium", "14. Acids & Bases"
    ],
    "CLRS Algorithms": [
        "1. Role of Algos", "2. Getting Started", "3. Growth of Functions", "4. Divide & Conquer", "5. Probabilistic Analysis", 
        "6. Heapsort", "7. Quicksort", "8. Linear Time Sorting", "9. Medians", "10. Data Structures",
        "11. Hash Tables", "12. Binary Search Trees", "13. Red-Black Trees", "14. Dynamic Programming", "15. Greedy Algorithms"
    ]
};

const RESOURCES = [
  // BOOKS
  { id: 'b1', type: 'book', category: 'Books', title: 'Campbell Biology', author: 'Urry et al.', subject: 'Biology', level: 'USABO', cover: 'https://m.media-amazon.com/images/I/81pathO+b1L._AC_UF1000,1000_QL80_.jpg', price: 0 },
  { id: 'b2', type: 'book', category: 'Books', title: 'AoPS Vol 1', author: 'Richard Rusczyk', subject: 'Math', level: 'AMC 10/12', cover: 'https://artofproblemsolving.com/assets/images/store/products/covers/book_vol1.jpg', price: 49 },
  { id: 'b3', type: 'book', category: 'Books', title: 'Physics Vol 1', author: 'Halliday & Resnick', subject: 'Physics', level: 'USAPhO', cover: 'https://images-na.ssl-images-amazon.com/images/I/91eF1gN-kCL.jpg', price: 0 },
  { id: 'b4', type: 'book', category: 'Books', title: 'Zumdahl Chemistry', author: 'Zumdahl', subject: 'Chemistry', level: 'USNCO', cover: 'https://m.media-amazon.com/images/I/71pC+C240+L._AC_UF1000,1000_QL80_.jpg', price: 0 },
  { id: 'b5', type: 'book', category: 'Books', title: 'CLRS Algorithms', author: 'Cormen et al.', subject: 'Coding', level: 'USACO', cover: 'https://m.media-amazon.com/images/I/61PgDn8D17L._AC_UF1000,1000_QL80_.jpg', price: 0 },
  { id: 'b6', type: 'book', category: 'Books', title: 'AoPS Vol 2', author: 'Richard Rusczyk', subject: 'Math', level: 'AIME', cover: 'https://artofproblemsolving.com/assets/images/store/products/covers/book_vol2.jpg', price: 59 },
  
  // COURSES (Expanded to Full Semester/Year)
  { 
      id: 'c1', type: 'course', category: 'Courses', title: 'Advanced Geometry', author: 'White Coat Academy', subject: 'Math', level: 'AIME', cover: 'https://img.youtube.com/vi/Dqf0o2I4e20/maxresdefault.jpg', price: 49, videoId: 'Dqf0o2I4e20',
      accredited: true,
      syllabus: [
          { title: "Week 1: Introduction to Homothety", type: "video", duration: "15:00" },
          { title: "Week 2: Homothety Quiz", type: "quiz", questions: 10 },
          { title: "Week 3: Cyclic Quadrilaterals", type: "video", duration: "22:30" },
          { title: "Week 4: Power of a Point", type: "video", duration: "18:45" },
          { title: "Week 5: Midterm Exam I", type: "midterm", questions: 25 },
          { title: "Week 6: Projective Geometry Basics", type: "video", duration: "30:00" },
          { title: "Week 7: Inversion Geometry", type: "video", duration: "25:00" },
          { title: "Week 8: Spiral Similarity", type: "video", duration: "20:00" },
          { title: "Week 9: Menelaus & Ceva Theorems", type: "video", duration: "28:00" },
          { title: "Week 10: Final Project: Theorem Proof", type: "project", description: "Prove Pascal's Theorem using Projective Geometry techniques." },
          { title: "Week 11: Advanced Problem Solving", type: "video", duration: "45:00" },
          { title: "Week 12: Final Exam", type: "midterm", questions: 50 }
      ]
  },
  { 
      id: 'c2', type: 'course', category: 'Courses', title: 'Molecular Genetics', author: 'White Coat Academy', subject: 'Biology', level: 'USABO', cover: 'https://img.youtube.com/vi/_b24aA8kO3k/maxresdefault.jpg', price: 49, videoId: '_b24aA8kO3k',
      accredited: true,
      syllabus: [
          { title: "Week 1: DNA Replication Mechanisms", type: "video", duration: "20:00" },
          { title: "Week 2: Replication Quiz", type: "quiz", questions: 10 },
          { title: "Week 3: Transcription Factors", type: "video", duration: "25:00" },
          { title: "Week 4: Operons & Regulation", type: "video", duration: "15:00" },
          { title: "Week 5: Lab Project: Gel Electrophoresis", type: "project", description: "Analyze the provided gel bands and determine the fragment lengths." },
          { title: "Week 6: CRISPR-Cas9 Systems", type: "video", duration: "30:00" },
          { title: "Week 7: Genomics and Sequencing", type: "video", duration: "22:00" },
          { title: "Week 8: Epigenetics", type: "video", duration: "18:00" },
          { title: "Week 9: Midterm Exam", type: "midterm", questions: 40 },
          { title: "Week 10: Recombinant DNA Technology", type: "video", duration: "25:00" },
          { title: "Week 11: Bioinformatics Basics", type: "video", duration: "30:00" },
          { title: "Week 12: Final Certification Exam", type: "midterm", questions: 60 }
      ]
  },
  { 
      id: 'c3', type: 'course', category: 'Courses', title: 'Dynamic Programming', author: 'White Coat Academy', subject: 'Coding', level: 'USACO', cover: 'https://img.youtube.com/vi/OQ5jsbhAv_M/maxresdefault.jpg', price: 59, videoId: 'OQ5jsbhAv_M',
      accredited: true,
      syllabus: [
          { title: "Week 1: Intro to DP & Memoization", type: "video", duration: "10:00" },
          { title: "Week 2: Knapsack Problem", type: "video", duration: "35:00" },
          { title: "Week 3: Coding Assignment: Coin Change", type: "project", description: "Implement the Coin Change problem in C++ or Java with O(n*amount) complexity." },
          { title: "Week 4: Bitmask DP", type: "video", duration: "40:00" },
          { title: "Week 5: Range DP", type: "video", duration: "30:00" },
          { title: "Week 6: DP on Trees", type: "video", duration: "45:00" },
          { title: "Week 7: Digit DP", type: "video", duration: "35:00" },
          { title: "Week 8: Matrix Exponentiation", type: "video", duration: "40:00" },
          { title: "Week 9: Convex Hull Trick", type: "video", duration: "50:00" },
          { title: "Week 10: Final Contest: Gold Division", type: "midterm", questions: 3 }
      ]
  },
  { 
      id: 'c4', type: 'course', category: 'Courses', title: 'Organic Chem Basics', author: 'White Coat Academy', subject: 'Chemistry', level: 'USNCO', cover: 'https://img.youtube.com/vi/bQJv29R8a8C/maxresdefault.jpg', price: 39, videoId: 'bQJv29R8a8C',
      accredited: true,
      syllabus: [
          { title: "Week 1: Alkanes & Naming", type: "video", duration: "12:00" },
          { title: "Week 2: Stereochemistry", type: "video", duration: "28:00" },
          { title: "Week 3: Quiz: Chirality", type: "quiz", questions: 10 },
          { title: "Week 4: SN1 vs SN2 Reactions", type: "video", duration: "30:00" },
          { title: "Week 5: E1 vs E2 Elimination", type: "video", duration: "25:00" },
          { title: "Week 6: Synthesis Project", type: "project", description: "Design a synthesis pathway for Ibuprofen starting from Benzene." },
          { title: "Week 7: Alcohols & Ethers", type: "video", duration: "20:00" },
          { title: "Week 8: Carbonyl Chemistry", type: "video", duration: "40:00" },
          { title: "Week 9: Midterm Exam", type: "midterm", questions: 35 },
          { title: "Week 10: NMR Spectroscopy", type: "video", duration: "45:00" },
          { title: "Week 11: IR Spectroscopy", type: "video", duration: "30:00" },
          { title: "Week 12: Final Exam", type: "midterm", questions: 50 }
      ]
  },

  // EXAMS
  { id: 'e1', type: 'exam', category: 'Exams', title: 'USABO Open 2023', author: 'CEE', subject: 'Biology', level: 'Open', cover: 'https://www.usabo-trc.org/sites/default/files/styles/large/public/USABO%20Open%20Exam%202013.jpg', price: 0 },
  { id: 'e2', type: 'exam', category: 'Exams', title: 'AIME I 2024', author: 'MAA', subject: 'Math', level: 'Invitational', cover: 'https://maa.org/sites/default/files/images/competitions/amc/AMC_10_12_Cover.jpg', price: 0 },
  { id: 'e3', type: 'exam', category: 'Exams', title: 'USAPhO 2023', author: 'AAPT', subject: 'Physics', level: 'National', cover: 'https://i.ytimg.com/vi/8w2P-qC2j4w/maxresdefault.jpg', price: 0 },
  { id: 'e4', type: 'exam', category: 'Exams', title: 'USACO Bronze 2023', author: 'USACO', subject: 'Coding', level: 'Bronze', cover: 'https://miro.medium.com/v2/resize:fit:1400/1*C2P9b_3CjP2A6o3A4b2A.png', price: 0 },
  { id: 'e5', type: 'exam', category: 'Exams', title: 'USABO Semifinal 2022', author: 'CEE', subject: 'Biology', level: 'Semis', cover: 'https://pbs.twimg.com/media/Fq2z2-aWwAEv6z_.jpg', price: 0 },
  { id: 'e6', type: 'exam', category: 'Exams', title: 'USNCO Local 2023', author: 'ACS', subject: 'Chemistry', level: 'Local', cover: 'https://www.acs.org/content/dam/acsorg/education/students/highschool/olympiad/USNCO-2022-Local-Exam-Cover.jpg', price: 0 },
  
  // SHEETS
  { id: 'f1', type: 'sheet', category: 'Cheat Sheets', title: 'Physics Formula Sheet', author: 'WCF', subject: 'Physics', level: 'All', cover: 'https://i.pinimg.com/736x/87/08/96/87089622d334585c5750d4812a32506e.jpg', price: 0 },
  { id: 'f2', type: 'sheet', category: 'Cheat Sheets', title: 'Trig Identities', author: 'WCF', subject: 'Math', level: 'All', cover: 'https://i.pinimg.com/originals/13/2a/12/132a1223b18536034176161405180631.jpg', price: 0 }
];

const INITIAL_EVENTS = [
    { id: 1, title: "National Science Bowl", date: "March 15, 2025", location: "Washington, D.C.", type: "Competition", img: "https://images.unsplash.com/photo-1564325724739-bae0bd08762c?auto=format&fit=crop&q=80" },
    { id: 2, title: "MIT STEM Convention", date: "April 02, 2025", location: "Cambridge, MA", type: "Conference", img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80" },
    { id: 3, title: "Silicon Valley Hackathon", date: "April 20, 2025", location: "San Jose, CA", type: "Hackathon", img: "https://images.unsplash.com/photo-1504384308090-c54be3855485?auto=format&fit=crop&q=80" },
    { id: 4, title: "Intl Bio Olympiad Meetup", date: "May 10, 2025", location: "London, UK", type: "Networking", img: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80" }
];

const GRADED_ITEMS = [
    { id: 101, title: "USABO Open Mock Exam #1", type: "Exam", score: 42, total: 50, date: "Feb 15, 2025", feedback: "Excellent performance in Cell Bio. Review Plant Physiology concepts.", subject: "Biology" },
    { id: 102, title: "USACO Silver: BFS Implementation", type: "Project", score: 100, total: 100, date: "Feb 18, 2025", feedback: "Perfect execution. Your time complexity analysis was spot on.", subject: "Coding" },
    { id: 103, title: "AIME Practice Test II", type: "Exam", score: 9, total: 15, date: "Feb 20, 2025", feedback: "Solid work. You missed #12 and #15 due to calculation errors.", subject: "Math" },
    { id: 104, title: "Organic Chem Synthesis Lab Report", type: "Project", score: 88, total: 100, date: "Feb 22, 2025", feedback: "Good mechanism drawings. Your yield calculation needs correction.", subject: "Chemistry" }
];

const OLYMPIAD_PATHS: Record<string, any[]> = {
    'Biology': [
        { stage: 'USABO Open', hours: 50, advice: "Focus on Campbell Ch 1-20. Speed is key. Aim for 25/50." },
        { stage: 'Semifinals', hours: 120, advice: "Deep dive into Plant Phys and Biosystematics. Read Raven's Plants." },
        { stage: 'Study Camp', hours: 300, advice: "Lab skills are crucial. Practice titrations and dissections." },
        { stage: 'IBO', hours: 500, advice: "Mastery of all topics. Previous IBO papers are mandatory." }
    ],
    'Math': [
        { stage: 'AMC 10/12', hours: 60, advice: "Master AoPS Vol 1. Do last 10 years of tests." },
        { stage: 'AIME', hours: 150, advice: "Intro to Counting & Probability. Focus on first 5 problems accuracy." },
        { stage: 'USAMO', hours: 400, advice: "Proof writing is essential. Read EGMO." },
        { stage: 'MOP', hours: 600, advice: "Olympiad Geometry and Inequality mastery." }
    ],
    'Physics': [
        { stage: 'F=ma', hours: 50, advice: "Mechanics only. Halliday Resnick Ch 1-14." },
        { stage: 'USAPhO', hours: 150, advice: "E&M and Thermodynamics. Morin's Mechanics is good." },
        { stage: 'Physics Team', hours: 500, advice: "Full IPhO syllabus. Relativity and Quantum basics." }
    ],
    'Coding': [
        { stage: 'USACO Bronze', hours: 40, advice: "Learn basic sorting and simulation. C++ or Java recommended." },
        { stage: 'USACO Silver', hours: 100, advice: "Master DFS/BFS and Prefix Sums." },
        { stage: 'USACO Gold', hours: 250, advice: "Dynamic Programming and Graph Theory." },
        { stage: 'USACO Platinum', hours: 500, advice: "Advanced Data Structures (Segment Trees)." }
    ],
    'Chemistry': [
         { stage: 'Local Exam', hours: 50, advice: "Stoichiometry and Gas Laws. Zumdahl is key." },
         { stage: 'National Exam', hours: 150, advice: "Descriptive Chem and Organic basics." },
         { stage: 'Study Camp', hours: 400, advice: "Full Organic synthesis and Lab practicals." }
    ]
};

const SCHEDULE_DATA = [
    { day: 'Mon', time: '16:00', title: 'Cell Bio Fundamentals', subject: 'Biology', instructor: 'Dr. Chen' },
    { day: 'Mon', time: '18:00', title: 'Number Theory Drill', subject: 'Math', instructor: 'Prof. Gauss' },
    { day: 'Tue', time: '16:00', title: 'Kinematics Review', subject: 'Physics', instructor: 'Dr. Newton' },
    { day: 'Wed', time: '16:00', title: 'Plant Physiology', subject: 'Biology', instructor: 'Dr. Chen' },
    { day: 'Thu', time: '16:00', title: 'Electromagnetism', subject: 'Physics', instructor: 'Dr. Newton' },
    { day: 'Fri', time: '17:00', title: 'Mock Exam Review', subject: 'General', instructor: 'Team' },
    { day: 'Sat', time: '10:00', title: 'USACO Bronze Contest', subject: 'Coding', instructor: 'Dev. Sarah' },
    { day: 'Sun', time: '14:00', title: 'Open Office Hours', subject: 'General', instructor: 'All Staff' },
];

const MENTORS = [
    { id: 1, name: "Alice Chen", role: "USABO Gold Medalist", school: "MIT '26", subject: "Biology", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", adminName: "Instructor instructor" },
    { id: 2, name: "David Kim", role: "USAMO Winner", school: "Harvard '25", subject: "Math", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", adminName: "Instructor David" },
    { id: 3, name: "Sarah Johnson", role: "IPhO Silver", school: "Stanford '27", subject: "Physics", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", adminName: "Instructor Sarah" },
];

const MOCK_STUDENTS = [
    { id: 1, name: "Jordan Smith", subject: "Biology", progress: 65, status: "On Track", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan" },
    { id: 2, name: "Emily Wang", subject: "Math", progress: 92, status: "High Achiever", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" },
    { id: 3, name: "Michael Brown", subject: "Physics", progress: 40, status: "At Risk", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" },
    { id: 4, name: "Jessica Liu", subject: "Coding", progress: 78, status: "On Track", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" },
    { id: 5, name: "Chris Evans", subject: "Chemistry", progress: 55, status: "On Track", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris" },
];

const INSTRUCTOR_GRADING_QUEUE = [
    { id: 1, student: "Jordan Smith", title: "Cellular Respiration Lab Report", type: "Project", date: "Feb 23, 2025" },
    { id: 2, student: "Michael Brown", title: "Kinematics Problem Set 3", type: "Assignment", date: "Feb 24, 2025" },
    { id: 3, student: "Jessica Liu", title: "USACO Bronze Mock Exam", type: "Exam", date: "Feb 24, 2025" }
];

const COMMUNITY_CHANNELS = [
    { id: 'general', name: 'General Chat' },
    { id: 'biology', name: '🧬 Biology' },
    { id: 'math', name: '➗ Math' },
    { id: 'physics', name: '⚛️ Physics' },
    { id: 'wins', name: '🏆 Wins & Flex' },
];

const EXAM_QUESTIONS_DB = {
    'Biology': [
        "In the Krebs Cycle, which molecule combines with Acetyl-CoA to form Citrate?",
        "Which of the following best describes the function of the Casparian Strip in plant roots?",
        "A population in Hardy-Weinberg equilibrium has a recessive allele frequency of 0.3. What is the frequency of heterozygotes?",
        "Which immunoglobulin is the first to be secreted during a primary immune response?",
        "During photosynthesis, where do the light-dependent reactions occur?",
        "What is the primary function of the lysosome?",
        "Describe the effect of 2,4-DNP on the electron transport chain.",
        "Which hormone is responsible for the 'fight or flight' response?",
        "What are the products of glycolysis?",
        "Explain the difference between C3, C4, and CAM plants."
    ],
    'Math': [
        "Find the number of trailing zeros in 100!",
        "In triangle ABC, AB=5, BC=12, and AC=13. What is the radius of the incircle?",
        "How many distinct permutations of the word MISSISSIPPI are there?",
        "If log_2(x) + log_2(x-2) = 3, solve for x.",
        "What is the remainder when 2^2024 is divided by 7?",
        "Solve for x: x^2 - 5x + 6 = 0.",
        "What is the sum of the interior angles of a convex octagon?",
        "If a coin is flipped 10 times, what is the probability of getting exactly 5 heads?",
        "Find the area of an equilateral triangle with side length 6.",
        "Evaluate the limit as x approaches 0 of sin(x)/x."
    ],
    'Physics': [
        "A block slides down a frictionless incline of 30 degrees. What is its acceleration?",
        "Two capacitors of 3uF and 6uF are connected in series. What is the equivalent capacitance?",
        "Calculate the escape velocity of a planet with twice Earth's mass and same radius.",
        "A sound wave travels from air to water. Which property remains constant: frequency, wavelength, or speed?",
        "In an ideal gas, if pressure doubles and volume halves, what happens to the temperature?",
        "What is the kinetic energy of a 2kg object moving at 3m/s?",
        "Explain Lenz's Law.",
        "Calculate the period of a simple pendulum of length 1m.",
        "What is the buoyant force on a submerged object?",
        "Describe the photoelectric effect."
    ],
    'Chemistry': [
        "What is the pH of a 0.01M HCl solution?",
        "Balance the reaction: C3H8 + O2 -> CO2 + H2O",
        "Which element has the highest electronegativity?",
        "What is the molecular geometry of CH4?",
        "Explain the difference between an ionic and a covalent bond.",
        "What is the molar mass of H2SO4?",
        "Describe Le Chatelier's Principle.",
        "What are the oxidation states of Sulfur in H2SO4?",
        "Calculate the number of moles in 22g of CO2.",
        "What is the ideal gas law equation?"
    ],
    'Coding': [
        "What is the time complexity of Merge Sort?",
        "Explain the difference between BFS and DFS.",
        "What is a hash table collision?",
        "Write a recursive function to calculate factorial.",
        "What is the difference between a stack and a queue?",
        "Explain Dynamic Programming.",
        "What is the binary representation of 13?",
        "How does Dijkstra's algorithm work?",
        "What is Big O notation?",
        "Explain the concept of object-oriented programming."
    ]
};

// --- HELPERS ---

const generateBookContent = (title: string, chapterIndex: number, page: number) => {
    const chapters = TEXTBOOK_CHAPTERS[title] || ["Introduction"];
    const chapterTitle = chapters[chapterIndex] || "Chapter 1";
    
    // Real content simulation for specific books
    let content = "";
    
    if (title.includes("Campbell")) {
        content = `
            <p><strong>Core Concept: ${chapterTitle}</strong></p>
            <p>Biology is the scientific study of life. The scope of biology extends from the global scale of the entire biosphere down to the microscopic scale of cells and molecules.</p>
            <p>In this chapter, we explore how evolution accounts for the unity and diversity of life. We also examine the hierarchy of biological organization, from molecules to organelles, cells, tissues, organs, organisms, populations, communities, ecosystems, and the biosphere.</p>
            <h4>Theme: New Properties Emerge at Successive Levels of Biological Organization</h4>
            <p>Life can be studied at different levels, from molecules to the entire living planet. The study of life extends from the microscopic scale of the molecules and cells that make up organisms to the global scale of the entire living planet.</p>
            <div class="bg-blue-50 p-4 rounded my-4 border-l-4 border-blue-500">
                <strong>Key Principle:</strong> The cell is the smallest unit of organization that can perform all activities required for life.
            </div>
            <p>As we move up the hierarchy, new properties emerge. For example, photosynthesis occurs in an intact chloroplast, but it will not take place in a disorganized test-tube mixture of chlorophyll and other chloroplast molecules.</p>
        `;
    } else if (title.includes("AoPS")) {
         content = `
            <p><strong>Topic: ${chapterTitle}</strong></p>
            <p>Mathematics is the language of logic. In this section, we will rigorously define the properties of ${chapterTitle.split(' ')[1] || 'Numbers'}.</p>
            <p>Consider the equation $x^2 + 1 = 0$. In the real number system, this has no solution. However, by extending our field to include the imaginary unit $i$, where $i^2 = -1$, we can solve for $x$.</p>
            <div class="bg-yellow-50 p-4 rounded my-4 font-mono text-sm border-l-4 border-yellow-500">
                Definition: A complex number is a number of the form a + bi, where a and b are real numbers.
            </div>
            <h4>Problem 1.1</h4>
            <p>Simplify the expression $(3 + 2i) + (4 - 5i)$.</p>
            <p><em>Solution:</em> Combine real and imaginary parts: $(3+4) + (2-5)i = 7 - 3i$.</p>
        `;
    } else {
        content = `
          <h3>${chapterTitle}</h3>
          <p><strong>Section ${page}.1: Core Concepts</strong></p>
          <p>When analyzing ${chapterTitle.toLowerCase()}, it is crucial to understand the underlying mechanisms. 
          In standard Olympiad problems, this topic accounts for approximately 15% of the questions.</p>
          <p>Consider the system where equilibrium is reached. As shown in Figure ${page}.2, the rate of change is proportional to the input.</p>
          <div class="bg-gray-100 p-4 rounded my-4 font-mono text-sm">
            Equation ${page}.1: ΔG = ΔH - TΔS
          </div>
          <p>Experimental data suggests that without proper calibration, results may skew significantly. 
          Review the case study of 2018 IBO Problem 4 which utilized this principle.</p>
        `;
    }
    return `<h3>${chapterTitle}</h3>${content}`;
};

const generateExamQuestions = (subject: string) => {
    const questions = [];
    const db = EXAM_QUESTIONS_DB[subject as keyof typeof EXAM_QUESTIONS_DB] || EXAM_QUESTIONS_DB['Biology'];
    
    for (let i = 1; i <= 50; i++) {
        const seedQuestion = db[(i-1) % db.length];
        questions.push({
            id: i,
            text: `Question ${i}: ${seedQuestion}`,
            options: ["Option A: Increases", "Option B: Decreases", "Option C: Remains Constant", "Option D: Oscillates"],
            correct: 0
        });
    }
    return questions;
};

// --- COMPONENTS ---

const AvatarCreator = ({ currentAvatar, onSave, onClose }: any) => {
    const [seed, setSeed] = useState(currentAvatar.split('seed=')[1] || 'Felix');
    const [style, setStyle] = useState('avataaars');
    
    const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;

    return (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Avatar Studio</h2>
                    <button onClick={onClose}><X size={20}/></button>
                </div>
                <div className="flex justify-center mb-8">
                    <div className="w-40 h-40 rounded-full border-4 border-brand-100 overflow-hidden shadow-lg bg-gray-50">
                        <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Style</label>
                        <div className="flex gap-2">
                            {['avataaars', 'bottts', 'lorelei', 'notionists'].map(s => (
                                <button 
                                    key={s}
                                    onClick={() => setStyle(s)}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg border capitalize ${style === s ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Seed (Name)</label>
                         <div className="flex gap-2">
                             <input 
                                value={seed}
                                onChange={e => setSeed(e.target.value)}
                                className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-500"
                             />
                             <button onClick={() => setSeed(Math.random().toString(36).substring(7))} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"><RefreshCw size={18}/></button>
                         </div>
                    </div>
                </div>
                <button 
                    onClick={() => { onSave(avatarUrl); onClose(); }}
                    className="w-full mt-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700"
                >
                    Save New Look
                </button>
            </div>
        </div>
    );
};

const OnboardingWizard = ({ onComplete }: { onComplete: (user: any) => void }) => {
    const [mode, setMode] = useState<'signup' | 'login'>('signup');
    const [step, setStep] = useState(1);
    const [data, setData] = useState({ email: '', password: '', subject: 'Biology', plan: 'Free', pin: '' });
    const [loading, setLoading] = useState(false);

    const handleNext = () => {
        if (mode === 'login') {
            // Admin/Instructor Login Flow
            if (data.email && data.password && data.pin === 'ADMIN2025') {
                 setLoading(true);
                 setTimeout(() => {
                     onComplete({
                         name: "Instructor " + data.email.split('@')[0],
                         email: data.email,
                         isAdmin: true,
                         subject: 'General',
                         avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`
                     });
                 }, 1000);
            } else {
                alert("Invalid Admin Credentials. PIN required.");
            }
            return;
        }

        // Student Signup Flow
        if (step === 1 && (!data.email || !data.password)) return;
        if (step === 3) {
            const user = { 
                ...data, 
                name: data.email.split('@')[0], 
                isAdmin: false,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
                subject: data.subject
            };
            setLoading(true);
            setTimeout(() => onComplete(user), 1500);
        } else {
            setStep(step + 1);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
                <div className="flex justify-center mb-6 bg-gray-100 rounded-lg p-1">
                    <button 
                        onClick={() => setMode('signup')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode==='signup'?'bg-white shadow text-gray-900':'text-gray-500'}`}
                    >
                        Student Sign Up
                    </button>
                    <button 
                        onClick={() => setMode('login')}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode==='login'?'bg-white shadow text-gray-900':'text-gray-500'}`}
                    >
                        Instructor Login
                    </button>
                </div>
                
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-brand-200">
                        <Crown className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {mode === 'login' ? 'Faculty Access' : step === 1 ? 'Create Account' : step === 2 ? 'Choose Your Path' : 'Select Plan'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        {mode === 'login' ? 'Enter your credentials and admin PIN.' : 'Join the elite community of Olympiad scholars.'}
                    </p>
                </div>

                <div className="space-y-4">
                    {(step === 1 || mode === 'login') && (
                        <div className="space-y-4 animate-fade-in-up">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    value={data.email}
                                    onChange={e => setData({...data, email: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="user@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input 
                                    type="password" 
                                    value={data.password}
                                    onChange={e => setData({...data, password: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                             {mode === 'login' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin PIN</label>
                                    <input 
                                        type="password" 
                                        value={data.pin}
                                        onChange={e => setData({...data, pin: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                                        placeholder="Enter PIN (e.g. ADMIN2025)"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {mode === 'signup' && step === 2 && (
                        <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
                            {['Biology', 'Math', 'Physics', 'Coding', 'Chemistry'].map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => setData({...data, subject: sub})}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${data.subject === sub ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-brand-200'}`}
                                >
                                    <div className="font-bold text-gray-900">{sub}</div>
                                    <div className="text-xs text-gray-500 mt-1">Olympiad Prep</div>
                                </button>
                            ))}
                        </div>
                    )}

                    {mode === 'signup' && step === 3 && (
                        <div className="space-y-3 animate-fade-in-up">
                            {['Free', 'Pro', 'Elite'].map(plan => (
                                <button
                                    key={plan}
                                    onClick={() => setData({...data, plan})}
                                    className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${data.plan === plan ? 'border-brand-500 bg-brand-50 shadow-md' : 'border-gray-100'}`}
                                >
                                    <div>
                                        <div className="font-bold text-gray-900">{plan} Plan</div>
                                        <div className="text-xs text-gray-500">{plan === 'Free' ? 'Basic Access' : plan === 'Pro' ? '$19/mo' : '$79/mo'}</div>
                                    </div>
                                    {data.plan === plan && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
                                </button>
                            ))}
                            {data.plan !== 'Free' && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-700">
                                        <CreditCard className="w-4 h-4" /> Payment Details
                                    </div>
                                    <input placeholder="Card Number" className="w-full p-2 border rounded mb-2 text-sm" />
                                    <div className="flex gap-2">
                                        <input placeholder="MM/YY" className="w-1/2 p-2 border rounded text-sm" />
                                        <input placeholder="CVC" className="w-1/2 p-2 border rounded text-sm" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <button 
                    onClick={handleNext}
                    disabled={loading}
                    className="w-full mt-8 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (mode === 'login' ? 'Verifying...' : 'Setting up Lab...') : (mode === 'login' ? 'Login' : step === 3 ? 'Start Learning' : 'Continue')}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
};

const VideoClassroom = ({ onClose, title, user }: { onClose: () => void, title: string, user: any }) => {
    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [messages, setMessages] = useState<{name: string, text: string}[]>([]);
    const [chatInput, setChatInput] = useState("");
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        if (cameraOn) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(s => {
                    stream = s;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => console.error("Camera error:", err));
        }
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraOn]);

    const sendMessage = () => {
        if (!chatInput.trim()) return;
        setMessages([...messages, { name: user.name, text: chatInput }]);
        setChatInput("");
        // Simulate response
        if (Math.random() > 0.5) {
            setTimeout(() => {
                setMessages(prev => [...prev, { name: "Alex Chen", text: "Great point!" }]);
            }, 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="h-16 bg-gray-800 flex items-center justify-between px-6 border-b border-gray-700">
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 bg-red-600 rounded text-xs font-bold text-white animate-pulse">LIVE</div>
                    <h2 className="text-white font-bold">{title}</h2>
                </div>
                <button onClick={onClose} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold">Leave Class</button>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Video Grid */}
                <div className="flex-1 bg-gray-900 p-4 grid grid-cols-2 md:grid-cols-3 gap-4 content-center">
                     {/* My Stream */}
                     <div className="relative bg-gray-800 rounded-xl overflow-hidden border-2 border-brand-500 aspect-video group">
                        {!cameraOn ? (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-900">
                                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold text-white">
                                    {user.name[0]}
                                </div>
                                <div className="absolute top-4 left-4 text-white text-xs bg-black/50 px-2 py-1 rounded">Camera Off</div>
                            </div>
                        ) : (
                            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                        )}
                        <div className="absolute bottom-4 left-4 text-white font-bold text-sm bg-black/50 px-2 py-1 rounded">
                            {user.name} {user.isAdmin && "(Instructor)"}
                        </div>
                        {micOn && <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>}
                     </div>
                     
                     {/* Other Participants */}
                     {[{name: "Alex Chen", img:"Alex"}, {name: "Sarah Miller", img:"Sarah"}, {name: "David Park", img:"David"}, {name: "Emily Wang", img:"Emily"}, {name: "Chris Evans", img:"Chris"}].map((p, i) => (
                         <div key={i} className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video border border-gray-700">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.img}`} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute bottom-4 left-4 text-white font-bold text-sm bg-black/50 px-2 py-1 rounded">{p.name}</div>
                         </div>
                     ))}
                </div>

                {/* Sidebar Chat */}
                <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-700 font-bold text-gray-300">Class Chat</div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((m, i) => (
                            <div key={i} className="text-sm">
                                <span className="font-bold text-gray-400 block text-xs">{m.name}</span>
                                <span className="text-gray-200">{m.text}</span>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-900">
                        <div className="flex gap-2">
                            <input 
                                className="flex-1 bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 outline-none focus:border-brand-500"
                                placeholder="Type a message..."
                                value={chatInput}
                                onChange={e => setChatInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            />
                            <button onClick={sendMessage} className="p-2 bg-brand-600 text-white rounded hover:bg-brand-700"><Send size={16}/></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Controls */}
            <div className="h-20 bg-gray-800 border-t border-gray-700 flex items-center justify-center gap-4">
                <button onClick={() => setMicOn(!micOn)} className={`p-4 rounded-full ${micOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white'}`}>
                    {micOn ? <Mic size={24} /> : <MicOff size={24} />}
                </button>
                <button onClick={() => setCameraOn(!cameraOn)} className={`p-4 rounded-full ${cameraOn ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500 text-white'}`}>
                    {cameraOn ? <Camera size={24} /> : <CameraOff size={24} />}
                </button>
                {user.isAdmin && (
                    <button className="p-4 rounded-full bg-brand-600 text-white hover:bg-brand-700">
                        <ScreenShare size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};

const BookReader = ({ book, onClose }: any) => {
    const [page, setPage] = useState(1);
    const [chapter, setChapter] = useState(0);
    const chapters = TEXTBOOK_CHAPTERS[book.title] || TEXTBOOK_CHAPTERS["Campbell Biology"];

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col md:flex-row animate-fade-in-up">
            <div className="w-72 border-r bg-gray-50 flex flex-col">
                <div className="p-4 border-b flex items-center gap-2 font-serif font-bold text-gray-800">
                    <button onClick={onClose}><ArrowRight className="rotate-180 w-4 h-4"/></button>
                    <span className="truncate">{book.title}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scroll">
                    {chapters.map((c, i) => (
                        <button 
                            key={i} 
                            onClick={() => { setChapter(i); setPage(1); }}
                            className={`w-full text-left p-2 text-sm rounded ${chapter === i ? 'bg-brand-100 text-brand-700 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 md:p-16 bg-[#fffdf8] custom-scroll">
                <div className="max-w-3xl mx-auto prose prose-lg prose-slate">
                    <h2 className="font-serif text-3xl text-gray-900 mb-8">{chapters[chapter]}</h2>
                    <div dangerouslySetInnerHTML={{ __html: generateBookContent(book.title, chapter, page) }} />
                </div>
                <div className="max-w-3xl mx-auto mt-12 flex justify-between pt-8 border-t border-gray-200">
                     <button disabled={page===1} onClick={() => setPage(p => p-1)} className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16}/> Prev Page</button>
                     <span className="text-gray-500 font-mono text-sm pt-2">Page {page}</span>
                     <button onClick={() => setPage(p => p+1)} className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50">Next Page <ChevronRight size={16}/></button>
                </div>
            </div>
        </div>
    );
};

const SheetViewer = ({ sheet, onClose }: any) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl overflow-hidden max-w-4xl w-full h-[90vh] flex flex-col animate-fade-in-up">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="font-bold text-lg">{sheet.title}</h2>
                    <button onClick={onClose}><X size={24}/></button>
                </div>
                <div className="flex-1 overflow-auto bg-gray-100 p-8 flex justify-center">
                    <img src={sheet.cover} className="max-w-full shadow-2xl" />
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-end">
                    <button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-bold flex items-center gap-2">
                        <DownloadCloud size={16}/> Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

const ExamInterface = ({ exam, onClose }: any) => {
    const [qIdx, setQIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number,number>>({});
    const [questions] = useState(generateExamQuestions(exam.subject));
    const [timeLeft, setTimeLeft] = useState(5400); // 90 mins
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (!finished && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(t => t-1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, finished]);

    const formatTime = (s: number) => {
        const m = Math.floor(s/60);
        const sec = s % 60;
        return `${m}:${sec<10?'0':''}${sec}`;
    };

    if (finished) {
        const score = Object.keys(answers).filter(k => answers[parseInt(k)] === questions[parseInt(k)-1].correct).length;
        return (
            <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-2xl text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Exam Complete!</h2>
                    <p className="text-gray-500 mb-6">You scored {score} out of 50</p>
                    <button onClick={onClose} className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold">Return to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col">
            <div className="h-16 bg-white border-b flex items-center justify-between px-6">
                <div className="font-bold">{exam.title}</div>
                <div className="font-mono text-xl font-bold text-brand-600">{formatTime(timeLeft)}</div>
                <button onClick={() => setFinished(true)} className="text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded">Submit</button>
            </div>
            <div className="flex-1 flex overflow-hidden">
                <div className="w-64 bg-white border-r overflow-y-auto p-4 grid grid-cols-4 gap-2 content-start">
                    {questions.map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setQIdx(i)}
                            className={`p-2 rounded text-xs font-bold ${answers[i+1] !== undefined ? 'bg-brand-600 text-white' : i === qIdx ? 'bg-brand-100 text-brand-700 ring-2 ring-brand-500' : 'bg-gray-100 text-gray-500'}`}
                        >
                            {i+1}
                        </button>
                    ))}
                </div>
                <div className="flex-1 p-8 md:p-16 overflow-y-auto">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8 text-sm text-gray-500 font-bold uppercase tracking-wider">Question {qIdx+1} of 50</div>
                        <h3 className="text-xl font-bold mb-8 leading-relaxed">{questions[qIdx].text}</h3>
                        <div className="space-y-4">
                            {questions[qIdx].options.map((opt: string, i: number) => (
                                <button 
                                    key={i}
                                    onClick={() => setAnswers({...answers, [qIdx+1]: i})}
                                    className={`w-full p-4 rounded-xl text-left border-2 transition-all ${answers[qIdx+1] === i ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-200'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${answers[qIdx+1] === i ? 'border-brand-500 bg-brand-500 text-white' : 'border-gray-300'}`}>
                                            {String.fromCharCode(65+i)}
                                        </div>
                                        {opt}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="mt-12 flex justify-between">
                            <button disabled={qIdx===0} onClick={()=>setQIdx(qIdx-1)} className="px-6 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50">Previous</button>
                            <button disabled={qIdx===49} onClick={()=>setQIdx(qIdx+1)} className="px-6 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CoursePlayer = ({ course, onClose, onGradeSubmit }: any) => {
    const [currentModule, setCurrentModule] = useState(0);
    const syllabus = course.syllabus || [];
    const [activeItem, setActiveItem] = useState<any>(syllabus[0]);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [projectSubmission, setProjectSubmission] = useState("");

    useEffect(() => {
        setActiveItem(syllabus[currentModule]);
        setQuizAnswers({});
        setProjectSubmission("");
    }, [currentModule, syllabus]);

    const handleQuizSubmit = () => {
        alert("Quiz submitted! You scored 90%.");
        if (currentModule < syllabus.length - 1) setCurrentModule(currentModule + 1);
    };

    const handleProjectSubmit = () => {
        onGradeSubmit({
            id: Date.now(),
            title: activeItem.title,
            type: "Project",
            student: "You",
            date: new Date().toLocaleDateString()
        });
        alert("Project uploaded successfully! Pending instructor review.");
    };

    const renderContent = () => {
        if (!activeItem) return <div className="text-white">Loading...</div>;

        if (activeItem.type === 'video') {
             return (
                 <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-black">
                    <div className="w-full max-w-5xl aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl relative">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src={`https://www.youtube.com/embed/${course.videoId}?autoplay=1`} 
                            title="YouTube video player" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                 </div>
             );
        }

        if (activeItem.type === 'quiz' || activeItem.type === 'midterm') {
            return (
                <div className="w-full h-full flex items-center justify-center p-8 bg-gray-900 text-white overflow-y-auto">
                    <div className="max-w-2xl w-full space-y-6">
                        <h2 className="text-2xl font-bold mb-4">{activeItem.title}</h2>
                        {[...Array(activeItem.questions)].map((_, i) => (
                            <div key={i} className="bg-gray-800 p-4 rounded-lg">
                                <p className="font-bold mb-2">Question {i + 1}</p>
                                <div className="space-y-2">
                                    {['A', 'B', 'C', 'D'].map((opt, j) => (
                                        <button 
                                            key={j}
                                            onClick={() => setQuizAnswers({...quizAnswers, [i]: j})}
                                            className={`w-full text-left p-3 rounded ${quizAnswers[i] === j ? 'bg-brand-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                                        >
                                            Option {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button onClick={handleQuizSubmit} className="w-full py-3 bg-green-600 text-white font-bold rounded-lg">Submit Assessment</button>
                    </div>
                </div>
            );
        }

        if (activeItem.type === 'project') {
            return (
                <div className="w-full h-full flex items-center justify-center p-8 bg-gray-900 text-white">
                    <div className="max-w-2xl w-full bg-gray-800 p-8 rounded-2xl shadow-xl">
                        <h2 className="text-2xl font-bold mb-4">{activeItem.title}</h2>
                        <div className="bg-gray-700 p-4 rounded-lg mb-6 text-sm leading-relaxed">
                            <strong className="block mb-2 text-brand-400">Project Brief:</strong>
                            {activeItem.description}
                        </div>
                        <textarea 
                            value={projectSubmission} 
                            onChange={e => setProjectSubmission(e.target.value)}
                            className="w-full h-40 bg-gray-900 border border-gray-600 rounded-lg p-4 text-white mb-4 focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="Paste your project link or type your submission here..."
                        />
                        <button onClick={handleProjectSubmit} className="w-full py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700">Submit Project</button>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row">
            {/* Sidebar Syllabus */}
            <div className="w-full md:w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-full text-white">
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <h2 className="font-bold truncate pr-2">{course.title}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded"><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scroll">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Course Modules</h3>
                    {syllabus.map((mod: any, i: number) => (
                        <button 
                            key={i}
                            onClick={() => setCurrentModule(i)}
                            className={`w-full text-left p-3 rounded-lg text-sm flex items-center gap-3 transition-colors ${currentModule === i ? 'bg-brand-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] ${currentModule === i ? 'border-white text-white' : 'border-gray-600 text-gray-600'}`}>
                                {i + 1}
                            </div>
                            <div className="flex-1">
                                <div className="truncate">{mod.title}</div>
                                <div className="text-[10px] uppercase tracking-wider opacity-50">{mod.type}</div>
                            </div>
                        </button>
                    ))}
                </div>
                {course.accredited && (
                    <div className="p-4 bg-gray-800 border-t border-gray-700">
                         <div className="flex items-center gap-2 text-yellow-400 mb-2 font-bold text-sm">
                             <Award size={16} /> WCF Accredited
                         </div>
                         <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mb-2">
                             <div className="bg-brand-500 h-full transition-all duration-500" style={{width: `${((currentModule + 1) / syllabus.length) * 100}%`}}></div>
                         </div>
                         <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded">Claim Certificate</button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 h-full relative">
                 {renderContent()}
            </div>
        </div>
    );
};

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{role: string, text: string}[]>([{role: 'model', text: "Hello! I'm your Olympiad AI Tutor. Ask me anything!"}]);
    const [input, setInput] = useState("");

    const send = () => {
        if(!input) return;
        setMessages([...messages, {role: 'user', text: input}]);
        setInput("");
        setTimeout(() => {
            setMessages(prev => [...prev, {role: 'model', text: "That's a great question about Olympiad concepts. Based on the syllabus, focus on first principles."}]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
            {isOpen && (
                <div className="w-80 h-96 bg-white rounded-xl shadow-2xl mb-4 flex flex-col border border-gray-200 overflow-hidden">
                    <div className="bg-brand-600 p-4 text-white font-bold flex justify-between">
                        <span>AI Tutor</span>
                        <button onClick={() => setIsOpen(false)}><X size={16}/></button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50">
                        {messages.map((m,i) => (
                            <div key={i} className={`p-2 rounded max-w-[85%] text-sm ${m.role === 'user' ? 'bg-brand-600 text-white self-end ml-auto' : 'bg-white border text-gray-800'}`}>
                                {m.text}
                            </div>
                        ))}
                    </div>
                    <div className="p-2 bg-white border-t flex gap-2">
                        <input className="flex-1 bg-gray-100 rounded px-2 text-sm outline-none" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask..."/>
                        <button onClick={send} className="p-2 bg-brand-600 text-white rounded"><Send size={16}/></button>
                    </div>
                </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 bg-gradient-to-r from-brand-500 to-accent-500 rounded-full text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                {isOpen ? <X /> : <Bot />}
            </button>
        </div>
    );
};

const DailyChallengeWidget = () => {
    const [answered, setAnswered] = useState(false);
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame size={80} className="text-orange-500"/>
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-orange-600 font-bold uppercase text-xs tracking-wider">
                    <Zap size={14}/> Daily Quest
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Protein Structure Analysis</h3>
                <p className="text-gray-500 text-sm mb-4">Explain the thermodynamic stability of alpha-helices in a hydrophobic environment.</p>
                {!answered ? (
                    <button onClick={() => setAnswered(true)} className="w-full py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 shadow-md transition-all">
                        Submit Answer (+500 XP)
                    </button>
                ) : (
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-bold flex items-center gap-2">
                        <CheckCircle2 size={16}/> Streak Extended!
                    </div>
                )}
            </div>
        </div>
    );
};

const GradingModal = ({ item, onClose, onGrade }: any) => {
    const [score, setScore] = useState("");
    const [feedback, setFeedback] = useState("");

    const handleDownload = () => {
        const text = `Student: ${item.student}\nAssignment: ${item.title}\nDate: ${item.date}\n\n[Full Submission Content Mock Data]\n\nAnalysis:\nThe lab data indicates a 95% yield. The limiting reagent was calculated correctly, but the error propagation needs review.`;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${item.title.replace(/\s+/g, '_')}_Submission.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Grade Assignment</h2>
                        <p className="text-sm text-gray-500">{item.student} • {item.title}</p>
                    </div>
                    <button onClick={onClose}><X className="text-gray-400 hover:text-gray-600" /></button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 text-sm">
                    <p className="font-bold text-gray-700 mb-2">Student Submission:</p>
                    <p className="text-gray-600 italic">"The analysis of the lab data indicates a 95% yield. The limiting reagent was..."</p>
                    <div 
                        onClick={handleDownload}
                        className="mt-2 text-blue-600 text-xs font-bold cursor-pointer hover:underline flex items-center gap-1"
                    >
                        <DownloadCloud size={12} /> Download Full Attachment
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Score (0-100)</label>
                        <input 
                            type="number" 
                            value={score} 
                            onChange={e => setScore(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="e.g. 95"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Instructor Feedback</label>
                        <textarea 
                            value={feedback}
                            onChange={e => setFeedback(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-brand-500 outline-none"
                            placeholder="Great work on the analysis..."
                        />
                    </div>
                    <button 
                        onClick={() => onGrade(item.id)}
                        className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all"
                    >
                        Submit Grade
                    </button>
                </div>
            </div>
        </div>
    );
};

const MessageModal = ({ recipient, onClose }: any) => {
    const [msg, setMsg] = useState("");
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Message {recipient.name}</h2>
                    <button onClick={onClose}><X size={20}/></button>
                </div>
                <textarea 
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    className="w-full h-32 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    placeholder={`Hi ${recipient.name}, I have a question about...`}
                />
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button onClick={() => { alert(`Message sent to ${recipient.name}`); onClose(); }} className="px-4 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700">Send</button>
                </div>
            </div>
        </div>
    );
};

const AddEventModal = ({ onClose, onAdd }: any) => {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [type, setType] = useState("Meeting");

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Create New Event</h2>
                    <button onClick={onClose}><X size={20}/></button>
                </div>
                <div className="space-y-4">
                    <input className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" placeholder="Event Title" value={title} onChange={e=>setTitle(e.target.value)}/>
                    <input className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" placeholder="Date (e.g. May 20, 2025)" value={date} onChange={e=>setDate(e.target.value)}/>
                    <input className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)}/>
                    <select className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500" value={type} onChange={e=>setType(e.target.value)}>
                        <option>Competition</option>
                        <option>Conference</option>
                        <option>Hackathon</option>
                        <option>Networking</option>
                        <option>Meeting</option>
                    </select>
                </div>
                <button onClick={() => { onAdd({ id: Date.now(), title, date, location, type, img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80"}); onClose(); }} className="w-full mt-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700">Create Event</button>
            </div>
        </div>
    );
};

const BookingModal = ({ mentor, onClose, onBook }: any) => {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
             <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-fade-in-up">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Book Session</h2>
                    <button onClick={onClose}><X size={20}/></button>
                 </div>
                 <div className="flex items-center gap-3 mb-6">
                     <div className="w-12 h-12 rounded-full overflow-hidden">
                         <img src={mentor.img} className="w-full h-full object-cover"/>
                     </div>
                     <div>
                         <div className="font-bold text-gray-900">{mentor.name}</div>
                         <div className="text-xs text-brand-600 font-bold uppercase tracking-wider">Premium Mentor</div>
                     </div>
                 </div>
                 
                 <p className="text-sm text-gray-500 mb-3 font-bold">Select Time Slot</p>
                 <div className="grid grid-cols-2 gap-3 mb-6">
                     {['Mon 4pm', 'Tue 10am', 'Wed 2pm', 'Fri 5pm'].map(t => (
                         <button 
                            key={t} 
                            onClick={() => setSelectedTime(t)} 
                            className={`p-2 border rounded-lg text-sm font-medium transition-all ${selectedTime === t ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500' : 'hover:bg-gray-50'}`}
                        >
                            {t}
                        </button>
                     ))}
                 </div>

                 <div className="border-t pt-4">
                     <div className="flex justify-between items-center mb-4">
                         <span className="text-sm font-bold text-gray-600">Total</span>
                         <span className="text-xl font-bold text-gray-900">$150.00</span>
                     </div>
                     <button 
                        disabled={!selectedTime}
                        onClick={() => selectedTime && onBook(selectedTime)} 
                        className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-900 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                    >
                        {selectedTime ? 'Pay with Pay' : 'Select a Time'}
                     </button>
                 </div>
             </div>
        </div>
    );
};

// --- MAIN APP ---

const App = () => {
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [readingBook, setReadingBook] = useState<any>(null);
    const [activeExam, setActiveExam] = useState<any>(null);
    const [activeCourse, setActiveCourse] = useState<any>(null);
    const [activeSheet, setActiveSheet] = useState<any>(null);
    const [liveClass, setLiveClass] = useState<any>(null);
    const [cart, setCart] = useState<any[]>([]);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "Your mock exam results are ready", read: false },
        { id: 2, text: "Dr. Chen posted a new assignment", read: false }
    ]);
    const [completedStages, setCompletedStages] = useState<string[]>([]);
    const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [activeChannel, setActiveChannel] = useState('general');
    const [communityMessages, setCommunityMessages] = useState<{user:string, text:string, time:string}[]>([
        { user: "David Kim", text: "Has anyone solved Problem 4 on the USABO Open?", time: "10:42 AM" },
        { user: "Sarah J", text: "Yes! Think about the enzyme kinetics curve.", time: "10:45 AM" }
    ]);
    const [activeCategory, setActiveCategory] = useState('All Resources');
    const [librarySearch, setLibrarySearch] = useState('');
    const [gradingQueue, setGradingQueue] = useState(INSTRUCTOR_GRADING_QUEUE);
    const [gradingItem, setGradingItem] = useState<any>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [messageRecipient, setMessageRecipient] = useState<any>(null);
    const [eventsList, setEventsList] = useState(INITIAL_EVENTS);
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [bookedSessions, setBookedSessions] = useState<any[]>([]);
    const [bookingMentor, setBookingMentor] = useState<any>(null);
    const [showAvatarCreator, setShowAvatarCreator] = useState(false);

    if (!user) return <OnboardingWizard onComplete={setUser} />;

    const sendCommunityMessage = () => {
        if (!chatInput.trim()) return;
        setCommunityMessages([...communityMessages, { user: user.name, text: chatInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
        setChatInput("");
    };

    const handleGradeSubmit = (id: number) => {
        setGradingQueue(prev => prev.filter(item => item.id !== id));
        setGradingItem(null);
        alert("Grade Submitted Successfully!"); // Simple feedback
    };

    const handleNewSubmission = (submission: any) => {
        setGradingQueue(prev => [...prev, submission]);
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        // Simulated Apple Pay Success
        alert(`Payment of $${total} Successful via Apple Pay!`);
        setCart([]);
        setShowCartDropdown(false);
    };

    const handleResourceClick = (res: any) => {
        if (res.type === 'book') setReadingBook(res);
        if (res.type === 'exam') setActiveExam(res);
        if (res.type === 'course') setActiveCourse(res);
        if (res.type === 'sheet') setActiveSheet(res);
    };

    const handleBookSession = (time: string) => {
        // Simulated Apple Pay Success for Booking
        const newSession = {
            id: Date.now(),
            mentorId: bookingMentor.id,
            mentorName: bookingMentor.name,
            time: time,
            title: `1-on-1 with ${bookingMentor.name}`
        };
        setBookedSessions([...bookedSessions, newSession]);
        setBookingMentor(null);
        alert("Payment Successful! Session Booked.");
    };

    // Filter logic for Instructor Dashboard: Only show their sessions
    const getInstructorNextClass = () => {
        if (!user.isAdmin) return null;
        return SCHEDULE_DATA.find(s => user.name.includes(s.instructor.split(' ')[1]) || s.instructor === 'You'); 
    };
    
    // Get My 1-on-1 Sessions
    const mySessions = user.isAdmin 
        ? bookedSessions.filter(s => MENTORS.find(m => m.id === s.mentorId)?.adminName?.includes(user.name) || true) // Show all for demo admin
        : bookedSessions;

    const filteredResources = RESOURCES.filter(res => {
        const matchesCategory = activeCategory === 'All Resources' || 
                              (activeCategory === 'Books' && res.type === 'book') ||
                              (activeCategory === 'Courses' && res.type === 'course') ||
                              (activeCategory === 'Exams' && res.type === 'exam') ||
                              (activeCategory === 'Cheat Sheets' && res.type === 'sheet');
        const matchesSearch = res.title.toLowerCase().includes(librarySearch.toLowerCase()) || res.subject.toLowerCase().includes(librarySearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-brand-100 selection:text-brand-900">
            {/* TOP NAV */}
            <header className="fixed top-0 inset-x-0 bg-white border-b border-gray-200 z-40 h-16 flex items-center px-4 md:px-6 shadow-sm glass-nav">
                <div className="flex items-center gap-2 md:gap-4 mr-8 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                    <div className="w-8 h-8 bg-gradient-to-tr from-brand-600 to-accent-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">W</div>
                    <span className="text-xl font-bold tracking-tight text-gray-900 hidden md:block">WhiteCoat<span className="text-brand-600">Academy</span></span>
                </div>

                <nav className="hidden md:flex items-center gap-1 mx-4">
                    {/* Common Tabs */}
                    <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>Dashboard</button>
                    <button onClick={() => setActiveTab('library')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'library' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>Library</button>
                    <button onClick={() => setActiveTab('schedule')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'schedule' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>Schedule</button>
                    <button onClick={() => setActiveTab('community')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'community' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>Community</button>
                    <button onClick={() => setActiveTab('events')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'events' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>Events</button>
                    
                    {/* Student Only Tabs */}
                    {!user.isAdmin && (
                        <>
                            <button onClick={() => setActiveTab('roadmap')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'roadmap' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>Roadmap</button>
                            <button onClick={() => setActiveTab('grades')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'grades' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>Grades</button>
                            <button onClick={() => setActiveTab('mentorship')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'mentorship' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>Mentorship</button>
                            <button onClick={() => setActiveTab('shop')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'shop' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>Shop</button>
                        </>
                    )}

                    {/* Admin Only Tabs */}
                    {user.isAdmin && (
                        <>
                             <button onClick={() => setActiveTab('students')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'students' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>Students</button>
                             <button onClick={() => setActiveTab('grading')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'grading' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                                 Grading {gradingQueue.length > 0 && <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">{gradingQueue.length}</span>}
                             </button>
                        </>
                    )}
                </nav>

                <div className="flex-1 max-w-md mx-4 hidden lg:block relative group">
                    <input className="w-full bg-gray-100 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all" placeholder="Search..." />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <div className="relative group">
                        <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                            <Bell size={20}/>
                            {notifications.some(n=>!n.read) && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>}
                        </button>
                        {showNotifDropdown && (
                            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
                                <h3 className="font-bold text-sm mb-2">Notifications</h3>
                                {notifications.map(n => (
                                    <div key={n.id} className="p-2 hover:bg-gray-50 rounded text-sm border-b last:border-0">{n.text}</div>
                                ))}
                            </div>
                        )}
                    </div>
                    {!user.isAdmin && (
                        <div className="relative group">
                             <button onClick={() => setShowCartDropdown(!showCartDropdown)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                                <ShoppingCart size={20}/>
                                {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{cart.length}</span>}
                            </button>
                            {showCartDropdown && (
                                <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
                                    <h3 className="font-bold text-sm mb-2">Shopping Cart</h3>
                                    {cart.length === 0 ? <p className="text-gray-500 text-sm">Cart is empty</p> : (
                                        <>
                                            {cart.map((item, i) => (
                                                <div key={i} className="flex justify-between items-center py-2 border-b text-sm">
                                                    <span className="truncate w-40">{item.title}</span>
                                                    <span className="font-bold">${item.price}</span>
                                                </div>
                                            ))}
                                            <div className="mt-4 border-t pt-2 flex justify-between font-bold text-sm mb-4">
                                                <span>Total</span>
                                                <span>${cart.reduce((sum, i) => sum + i.price, 0)}</span>
                                            </div>
                                            <button 
                                                onClick={handleCheckout}
                                                className="w-full py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                                            >
                                                Pay with Pay
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    <div className="relative">
                        <button onClick={() => setShowUserMenu(!showUserMenu)} className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300 ml-2 focus:ring-2 ring-offset-2 ring-brand-500">
                            <img src={user.avatar} alt="User" />
                        </button>
                        {showUserMenu && (
                            <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50">
                                <div className="p-2 border-b text-sm font-bold text-gray-900 truncate">{user.name}</div>
                                {!user.isAdmin && (
                                    <button onClick={() => setShowAvatarCreator(true)} className="w-full text-left p-2 hover:bg-brand-50 text-gray-600 hover:text-brand-600 text-sm rounded flex items-center gap-2">
                                        <Palette size={14}/> Customize Avatar
                                    </button>
                                )}
                                <button onClick={() => { setUser(null); setShowUserMenu(false); }} className="w-full text-left p-2 hover:bg-red-50 text-red-600 text-sm rounded flex items-center gap-2">
                                    <LogOut size={14}/> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-8 min-h-[80vh]">
                
                {/* DASHBOARD */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Hero */}
                        <div className="relative rounded-3xl overflow-hidden bg-gray-900 text-white shadow-2xl h-[300px] flex items-center group">
                             <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-brand-900/80 to-transparent z-10"></div>
                             <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                             <div className="relative z-20 px-12 max-w-2xl">
                                <h1 className="text-4xl font-serif font-bold mb-4">Welcome back, {user.name}</h1>
                                <p className="text-gray-200 text-lg mb-8">
                                    {user.isAdmin ? "Ready to inspire the next generation of scientists?" : "You're on a 5-day streak! Continue your path to Gold."}
                                </p>
                                {user.isAdmin ? (
                                    <button onClick={() => setLiveClass({title: "Office Hours", instructor: "You"})} className="px-6 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 shadow-lg flex items-center gap-2">
                                        <Video size={20}/> Go Live Now
                                    </button>
                                ) : (
                                    <button onClick={() => setActiveTab('roadmap')} className="px-6 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 shadow-lg">
                                        Continue Roadmap
                                    </button>
                                )}
                             </div>
                        </div>

                        {/* Student Widgets */}
                        {!user.isAdmin && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4"><BookOpen size={20} className="text-brand-600"/> Continued Learning</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[1,2].map(i => {
                                            const res = RESOURCES[i-1];
                                            return (
                                                <div key={i} onClick={() => handleResourceClick(res)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
                                                    <div className="w-16 h-20 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                                                        <img src={res.cover} className="w-full h-full object-cover"/>
                                                    </div>
                                                    <div className="flex-1 py-1">
                                                        <h3 className="font-bold text-gray-900 truncate text-sm">{res.title}</h3>
                                                        <p className="text-xs text-gray-500 mb-2">{res.subject}</p>
                                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="bg-brand-500 w-3/4 h-full"></div></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                                                <UserCheck size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase">Your Mentor</p>
                                                <p className="font-bold text-gray-900">Dr. Chen (Biology)</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setMessageRecipient({ name: "Dr. Chen" })} className="text-sm font-bold text-brand-600 hover:underline">Message</button>
                                    </div>

                                    {mySessions.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="text-sm font-bold text-gray-900 uppercase mb-3">Upcoming 1-on-1s</h3>
                                            <div className="space-y-2">
                                                {mySessions.map((s:any) => (
                                                    <div key={s.id} className="flex justify-between items-center p-3 bg-white rounded-lg border shadow-sm">
                                                        <div>
                                                            <div className="font-bold text-sm">{s.title}</div>
                                                            <div className="text-xs text-gray-500">{s.time}</div>
                                                        </div>
                                                        <button onClick={() => setLiveClass(s)} className="px-3 py-1 bg-green-600 text-white rounded text-xs font-bold">Join</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <DailyChallengeWidget />
                            </div>
                        )}
                        
                        {/* Admin Stats */}
                        {user.isAdmin && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all" onClick={() => setActiveTab('students')}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Users className="text-blue-500" />
                                        <div className="text-gray-500 text-sm font-bold uppercase">My Students</div>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">24</div>
                                    <p className="text-xs text-gray-400 mt-1">3 new this week</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all" onClick={() => setActiveTab('grading')}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <ClipboardCheck className="text-orange-500" />
                                        <div className="text-gray-500 text-sm font-bold uppercase">To Grade</div>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">{gradingQueue.length}</div>
                                    <p className="text-xs text-gray-400 mt-1">Pending review</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar className="text-green-500" />
                                        <div className="text-gray-500 text-sm font-bold uppercase">My Next Class</div>
                                    </div>
                                    {getInstructorNextClass() ? (
                                        <>
                                            <div className="text-xl font-bold text-gray-900">{getInstructorNextClass().title}</div>
                                            <p className="text-xs text-gray-400 mt-1">{getInstructorNextClass().day}, {getInstructorNextClass().time}</p>
                                        </>
                                    ) : (
                                        <div className="text-sm text-gray-400 italic">No upcoming classes</div>
                                    )}
                                </div>

                                {mySessions.length > 0 && (
                                     <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                         <h3 className="text-lg font-bold text-gray-900 mb-4">My 1-on-1 Sessions</h3>
                                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                             {mySessions.map((s:any) => (
                                                 <div key={s.id} className="p-4 border rounded-xl flex justify-between items-center bg-gray-50">
                                                     <div>
                                                         <div className="font-bold text-sm">{s.title}</div>
                                                         <div className="text-xs text-gray-500">{s.time}</div>
                                                     </div>
                                                     <button onClick={() => setLiveClass(s)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold">Start Session</button>
                                                 </div>
                                             ))}
                                         </div>
                                     </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* STUDENTS TAB (ADMIN ONLY) */}
                {activeTab === 'students' && user.isAdmin && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Student Roster</h2>
                            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold flex items-center gap-2">
                                <Plus size={16} /> Add Student
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {MOCK_STUDENTS.map(student => (
                                <div key={student.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100">
                                                <img src={student.avatar} alt={student.name} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{student.name}</h3>
                                                <p className="text-xs text-gray-500">{student.subject}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            student.status === 'High Achiever' ? 'bg-green-100 text-green-700' : 
                                            student.status === 'At Risk' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {student.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-xs font-bold text-gray-500">
                                            <span>Course Progress</span>
                                            <span>{student.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-500" style={{ width: `${student.progress}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">Profile</button>
                                        <button 
                                            onClick={() => setMessageRecipient(student)}
                                            className="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700"
                                        >
                                            Message
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* GRADING TAB (ADMIN ONLY) */}
                {activeTab === 'grading' && user.isAdmin && (
                    <div className="space-y-6 animate-fade-in-up">
                        <h2 className="text-2xl font-bold text-gray-900">Grading Queue</h2>
                        {gradingQueue.length === 0 ? (
                            <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
                                <p className="text-gray-500">No pending assignments to review.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {gradingQueue.map((item, i) => (
                                    <div key={item.id} className="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'Exam' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {item.type === 'Exam' ? <FileText size={20} /> : <Laptop size={20} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{item.title}</h3>
                                                <p className="text-sm text-gray-500">{item.student} • Submitted {item.date}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setGradingItem(item)}
                                            className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-brand-700"
                                        >
                                            Grade
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* LIBRARY */}
                {activeTab === 'library' && (
                    <div className="flex gap-8 animate-fade-in-up">
                        <div className="w-64 shrink-0 hidden md:block space-y-6">
                            <div>
                                <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-3">Categories</h3>
                                <div className="space-y-1">
                                    {['All Resources', 'Books', 'Courses', 'Exams', 'Cheat Sheets'].map(cat => (
                                        <button 
                                            key={cat} 
                                            onClick={() => setActiveCategory(cat)}
                                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${activeCategory === cat ? 'bg-brand-50 text-brand-700 font-bold shadow-sm' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
                                        >
                                            {cat}
                                            {activeCategory === cat && <ChevronRight size={14} />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <h4 className="font-bold text-blue-800 text-sm mb-1">Pro Tip</h4>
                                <p className="text-xs text-blue-600">Combine Campbell Biology ch. 5-8 with the Molecular Genetics course for optimal USABO prep.</p>
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">{activeCategory}</h2>
                                <div className="relative">
                                    <input 
                                        className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none w-64" 
                                        placeholder="Search library..." 
                                        value={librarySearch}
                                        onChange={(e) => setLibrarySearch(e.target.value)}
                                    />
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>
                            
                            {filteredResources.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                                    <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <Search className="text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">No resources found</h3>
                                    <p className="text-gray-500 text-sm">Try adjusting your filters or search terms.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {filteredResources.map(res => (
                                        <div key={res.id} className="group cursor-pointer" onClick={() => handleResourceClick(res)}>
                                            <div className="relative aspect-[3/4] mb-3 rounded-xl shadow-sm overflow-hidden book-cover bg-gray-100">
                                                <img src={res.cover} className="w-full h-full object-cover" />
                                                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded tracking-wider">
                                                    {res.type}
                                                </div>
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button className="px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 pointer-events-none">
                                                        {res.type === 'book' ? <><BookOpen size={14}/> Read</> : res.type === 'exam' ? <><FileText size={14}/> Start</> : res.type === 'sheet' ? <><Eye size={14}/> View</> : <><PlayCircle size={14}/> Watch</>}
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{res.title}</h3>
                                            <p className="text-xs text-gray-500">{res.author}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                                    res.subject === 'Biology' ? 'bg-green-100 text-green-700' : 
                                                    res.subject === 'Math' ? 'bg-blue-100 text-blue-700' : 
                                                    res.subject === 'Physics' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {res.subject}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* EVENTS */}
                {activeTab === 'events' && (
                     <div className="space-y-6 animate-fade-in-up">
                        <div className="flex justify-between items-center">
                             <h2 className="text-2xl font-bold text-gray-900">Upcoming In-Person Events</h2>
                             {user.isAdmin && (
                                 <button onClick={() => setShowAddEvent(true)} className="px-4 py-2 bg-brand-600 text-white rounded-lg font-bold text-sm flex items-center gap-2">
                                     <Plus size={16}/> Add Event
                                 </button>
                             )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {eventsList.map(event => (
                                <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row group hover:shadow-lg transition-all cursor-pointer">
                                    <div className="md:w-48 h-48 md:h-auto bg-gray-200 shrink-0">
                                        <img src={event.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-6 flex flex-col justify-center">
                                        <div className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">{event.type}</div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                            <span className="flex items-center gap-1"><CalendarDays size={16}/> {event.date}</span>
                                            <span className="flex items-center gap-1"><MapPin size={16}/> {event.location}</span>
                                        </div>
                                        <button className="self-start px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800">Register Now</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                )}
                
                {/* GRADES */}
                {activeTab === 'grades' && !user.isAdmin && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-gray-900">Academic Record</h1>
                                <p className="text-gray-500">Track your performance across exams and projects.</p>
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                    <BarChart3 size={24} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-500 uppercase">Average Score</div>
                                    <div className="text-2xl font-bold text-gray-900">88.5%</div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                    <ClipboardCheck size={24} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-500 uppercase">Exams Taken</div>
                                    <div className="text-2xl font-bold text-gray-900">14</div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <FlaskConical size={24} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-500 uppercase">Projects Completed</div>
                                    <div className="text-2xl font-bold text-gray-900">8</div>
                                </div>
                            </div>
                        </div>

                        {/* Graded Items List */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900">Recent Graded Assessments</h2>
                            {GRADED_ITEMS.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'Exam' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                {item.type === 'Exam' ? <FileText size={24} /> : <Laptop size={24} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${item.type === 'Exam' ? 'bg-orange-50 text-orange-700' : 'bg-indigo-50 text-indigo-700'}`}>{item.type}</span>
                                                    <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                                                </div>
                                                <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                                                <p className="text-gray-500 text-sm mt-1">{item.feedback}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 pl-16 md:pl-0">
                                            <div className="text-right">
                                                <div className="text-xs font-bold text-gray-400 uppercase">Score</div>
                                                <div className={`text-2xl font-bold ${item.score / item.total >= 0.9 ? 'text-green-600' : item.score / item.total >= 0.8 ? 'text-blue-600' : 'text-orange-600'}`}>
                                                    {item.score}<span className="text-gray-300 text-sm">/{item.total}</span>
                                                </div>
                                            </div>
                                            <button className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors">
                                                <DownloadCloud size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ROADMAP */}
                {activeTab === 'roadmap' && !user.isAdmin && (
                    <div className="max-w-4xl mx-auto animate-fade-in-up">
                        <h1 className="text-3xl font-serif font-bold text-center mb-12">Your Path to Gold</h1>
                        <div className="space-y-12 relative">
                            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200"></div>
                            {(OLYMPIAD_PATHS[user.subject] || OLYMPIAD_PATHS['Biology']).map((step, i) => {
                                const isCompleted = completedStages.includes(step.stage);
                                return (
                                    <div key={i} className="relative pl-24 group">
                                        <button 
                                            onClick={() => setSelectedStrategy(step)}
                                            className={`absolute left-0 w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-bold transition-all z-10 ${isCompleted ? 'bg-green-500 border-green-200 text-white' : 'bg-white border-brand-500 text-brand-600 shadow-lg group-hover:scale-110'}`}
                                        >
                                            {isCompleted ? <Check /> : i + 1}
                                        </button>
                                        <div onClick={() => setSelectedStrategy(step)} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{step.stage}</h3>
                                            <p className="text-gray-500 text-sm mb-4">{step.hours} Hours Estimated Preparation</p>
                                            <div className="flex gap-2">
                                                <span className="px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded font-medium">Strategy Guide</span>
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">Resources</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* SCHEDULE */}
                {activeTab === 'schedule' && (
                    <div className="animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Weekly Schedule</h2>
                            {user.isAdmin && <button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-bold text-sm">+ Add Event</button>}
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider text-center py-3">
                                <div>Time</div>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=><div key={d}>{d}</div>)}
                            </div>
                            <div className="divide-y divide-gray-100">
                                {[10,12,14,16,18,20].map(hour => (
                                    <div key={hour} className="grid grid-cols-8 min-h-[100px]">
                                        <div className="text-xs text-gray-400 p-2 text-center">{hour}:00</div>
                                        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => {
                                            const event = SCHEDULE_DATA.find(e => e.day === day && parseInt(e.time) === hour);
                                            if (!event) return <div key={i} className="border-l border-gray-50"></div>;
                                            return (
                                                <div key={i} className="p-1 border-l border-gray-50">
                                                    <button 
                                                        onClick={() => setLiveClass(event)}
                                                        className={`w-full h-full rounded-lg p-2 text-left text-xs transition-all hover:scale-105 shadow-sm ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-brand-100 text-brand-800'}`}
                                                    >
                                                        <div className="font-bold truncate">{event.title}</div>
                                                        <div className="opacity-75 truncate">{event.instructor}</div>
                                                        {user.isAdmin && <div className="mt-1 font-bold text-[10px] uppercase">Click to Broadcast</div>}
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* MENTORSHIP */}
                {activeTab === 'mentorship' && !user.isAdmin && (
                    <div className="space-y-8 animate-fade-in-up">
                         {mySessions.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4">My Booked Sessions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                     {mySessions.map((s: any) => (
                                         <div key={s.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                                             <div>
                                                 <div className="font-bold text-gray-900">{s.title}</div>
                                                 <div className="text-sm text-gray-500">{s.time}</div>
                                             </div>
                                             <button onClick={() => setLiveClass(s)} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm">Join</button>
                                         </div>
                                     ))}
                                </div>
                            </div>
                        )}
                        <div>
                            <h3 className="text-xl font-bold mb-4">Available Mentors</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {MENTORS.map(m => (
                                    <div key={m.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center">
                                        <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-lg">
                                            <img src={m.img} className="w-full h-full object-cover"/>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">{m.name}</h3>
                                        <p className="text-brand-600 font-medium text-sm mb-1">{m.role}</p>
                                        <p className="text-gray-500 text-sm mb-6">{m.school}</p>
                                        <div className="flex gap-2">
                                            <button onClick={() => setMessageRecipient(m)} className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50">Message</button>
                                            <button onClick={() => setBookingMentor(m)} className="flex-1 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800">Book</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* COMMUNITY */}
                {activeTab === 'community' && (
                    <div className="h-[600px] bg-white rounded-2xl shadow-sm border border-gray-200 flex overflow-hidden animate-fade-in-up">
                        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                            <div className="p-4 font-bold text-gray-900 border-b border-gray-200">Channels</div>
                            <div className="p-2 space-y-1">
                                {COMMUNITY_CHANNELS.map(c => (
                                    <button 
                                        key={c.id} 
                                        onClick={() => setActiveChannel(c.id)}
                                        className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${activeChannel === c.id ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        # {c.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold"># {COMMUNITY_CHANNELS.find(c => c.id === activeChannel)?.name}</h3>
                                <div className="text-xs text-gray-500">1,204 members online</div>
                            </div>
                            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                                {communityMessages.map((msg, i) => (
                                    <div key={i} className="flex gap-3 animate-fade-in-up">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-bold text-sm text-gray-900">{msg.user}</span>
                                                <span className="text-xs text-gray-400">{msg.time}</span>
                                            </div>
                                            <p className="text-gray-800 text-sm">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-gray-50 border-t border-gray-200">
                                <div className="flex gap-2">
                                    <input 
                                        className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-brand-500" 
                                        placeholder={`Message #${COMMUNITY_CHANNELS.find(c => c.id === activeChannel)?.name}...`}
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && sendCommunityMessage()}
                                    />
                                    <button onClick={sendCommunityMessage} className="p-2 bg-brand-600 text-white rounded-lg"><Send size={18}/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SHOP */}
                {activeTab === 'shop' && !user.isAdmin && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
                        {RESOURCES.filter(r => r.price > 0).map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                                <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden relative group">
                                    <img src={item.cover} className="w-full h-full object-cover"/>
                                    <button 
                                        onClick={() => setCart([...cart, item])}
                                        className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-50"
                                    >
                                        <Plus size={16} className="text-brand-600"/>
                                    </button>
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm flex-1">{item.title}</h3>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="font-bold text-lg">${item.price}</span>
                                    <button onClick={() => setCart([...cart, item])} className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800">Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </main>

            {/* MODALS */}
            {liveClass && <VideoClassroom user={user} title={liveClass.title} onClose={() => setLiveClass(null)} />}
            {readingBook && <BookReader book={readingBook} onClose={() => setReadingBook(null)} />}
            {activeSheet && <SheetViewer sheet={activeSheet} onClose={() => setActiveSheet(null)} />}
            {activeExam && <ExamInterface exam={activeExam} onClose={() => setActiveExam(null)} />}
            {activeCourse && <CoursePlayer course={activeCourse} onClose={() => setActiveCourse(null)} onGradeSubmit={handleNewSubmission} />}
            {gradingItem && <GradingModal item={gradingItem} onClose={() => setGradingItem(null)} onGrade={handleGradeSubmit} />}
            {messageRecipient && <MessageModal recipient={messageRecipient} onClose={() => setMessageRecipient(null)} />}
            {showAddEvent && <AddEventModal onClose={() => setShowAddEvent(false)} onAdd={(evt:any) => setEventsList([...eventsList, evt])} />}
            {bookingMentor && <BookingModal mentor={bookingMentor} onClose={() => setBookingMentor(null)} onBook={handleBookSession} />}
            {showAvatarCreator && <AvatarCreator currentAvatar={user.avatar} onSave={(newAvatar: string) => setUser({...user, avatar: newAvatar})} onClose={() => setShowAvatarCreator(false)} />}
            <AIChatWidget />
            
            {/* Strategy Modal */}
            {selectedStrategy && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold">{selectedStrategy.stage} Strategy</h2>
                            <button onClick={() => setSelectedStrategy(null)}><X size={20} className="text-gray-400"/></button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-brand-50 rounded-xl border border-brand-100">
                                <h4 className="font-bold text-brand-800 mb-1 flex items-center gap-2"><Clock size={16}/> Study Time</h4>
                                <p className="text-brand-700 text-sm">{selectedStrategy.hours} Hours Required</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Expert Advice</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">{selectedStrategy.advice}</p>
                            </div>
                            <button onClick={() => {
                                setCompletedStages([...completedStages, selectedStrategy.stage]);
                                setSelectedStrategy(null);
                            }} className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700">
                                Mark as Complete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);