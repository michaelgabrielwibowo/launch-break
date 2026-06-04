/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TopicTrack, Resource, ActiveCourse } from "./types";

export const INITIAL_RESOURCE_POOL: Resource[] = [
  {
    id: "r1",
    title: "Introduction to Statistical Learning",
    description: "The fundamental textbook for understanding machine learning concepts without heavy math matrices.",
    type: "Book",
    category: "Machine Learning",
    estimatedTime: "15h",
    level: "Intermediate",
    accentColor: "#3b82f6",
    isSaved: true
  },
  {
    id: "r2",
    title: "Attention Is All You Need",
    description: "Vaswani et al. The groundbreaking paper introducing the Transformer architecture, replacing RNNs and CNNs with self-attention.",
    type: "Research Paper",
    category: "Machine Learning",
    estimatedTime: "5h",
    level: "Advanced",
    accentColor: "#8b5cf6",
    isSaved: true
  },
  {
    id: "r3",
    title: "Hands-On Machine Learning with Scikit-Learn and TensorFlow",
    description: "Practical guide to training deep learning networks and building standard operational data pipelines.",
    type: "Book",
    category: "Machine Learning",
    estimatedTime: "45h",
    level: "Intermediate",
    accentColor: "#10b981",
    isSaved: false
  },
  {
    id: "r4",
    title: "Gradient Descent Optimization Algorithms Overview",
    description: "An intuitive explanation of optimizer architectures including Momentum, RMSprop, Adam, and adaptive weight decay.",
    type: "Article",
    category: "Mathematics",
    estimatedTime: "2h",
    level: "Beginner",
    accentColor: "#ef4444",
    isSaved: false
  },
  {
    id: "r5",
    title: "Advanced Data Structures in Python",
    description: "Learn segment trees, tries, disjoint-set unions, and graph representation algorithms for competitive speed.",
    type: "Video Course",
    category: "Python",
    estimatedTime: "8h",
    level: "Intermediate",
    accentColor: "#f59e0b",
    isSaved: true
  },
  {
    id: "r6",
    title: "Stochastic Processes and Queueing Models",
    description: "Markovian queuing, transition matrices, and stochastic state limits in heavy engineering load balancers.",
    type: "Book",
    category: "Mathematics",
    estimatedTime: "30h",
    level: "Advanced",
    accentColor: "#ec4899",
    isSaved: false
  },
  {
    id: "r7",
    title: "Full-Stack Development with React and Fastify",
    description: "Comprehensive blueprint on building robust database adapters, reactive state channels, and server middleware.",
    type: "Video Course",
    category: "Web Development",
    estimatedTime: "20h",
    level: "Intermediate",
    accentColor: "#06b6d4",
    isSaved: true
  },
  {
    id: "r8",
    title: "Generative Adversarial Nets (GANs)",
    description: "Ian Goodfellow's original paper detailing competitive zero-sum training paradigms for high resolution image synthesis.",
    type: "Research Paper",
    category: "Machine Learning",
    estimatedTime: "4h",
    level: "Advanced",
    accentColor: "#f43f5e",
    isSaved: false
  }
];

export const INITIAL_TOPICS: TopicTrack[] = [
  {
    id: "t1",
    title: "Machine Learning",
    description: "A comprehensive guide to understanding algorithms that learn from data. Transition from classical programming to predictive modeling and statistical inference.",
    level: "Intermediate",
    estimatedTime: "40h est. time",
    prerequisites: "Linear Algebra, Calculus, Python",
    rating: 2,
    tasks: [
      { id: "t1_ct1", title: "Linear Regression Basics", completed: true },
      { id: "t1_ct2", title: "Logistic Regression & Classification", completed: false },
      { id: "t1_ct3", title: "Support Vector Machines & Kernel Tricks", completed: false },
      { id: "t1_ct4", title: "Decision Trees & Boosting Ensembles", completed: false },
      { id: "t1_ct5", title: "Gradient Descent Optimization Loops", completed: false }
    ],
    resources: [
      INITIAL_RESOURCE_POOL[0],
      INITIAL_RESOURCE_POOL[1],
      INITIAL_RESOURCE_POOL[2],
      INITIAL_RESOURCE_POOL[7]
    ]
  },
  {
    id: "t2",
    title: "Python Programming",
    description: "Deep-dive into advanced object-oriented paradigms, asynchronous event loops, memory footprints, and heavy list/dictionary optimization structures.",
    level: "Beginner",
    estimatedTime: "24h est. time",
    prerequisites: "Basic computational intuition",
    rating: 4,
    tasks: [
      { id: "t2_ct1", title: "Variables and Control Structures", completed: true },
      { id: "t2_ct2", title: "Iterators, Generators, and List Comprehensions", completed: true },
      { id: "t2_ct3", title: "Asynchronous IO & Multi-Threading Threads", completed: false },
      { id: "t2_ct4", title: "Custom Decorator Functions & Metaclasses", completed: false }
    ],
    resources: [
      INITIAL_RESOURCE_POOL[4],
      INITIAL_RESOURCE_POOL[3]
    ]
  },
  {
    id: "t3",
    title: "Operations Research",
    description: "Leverage linear programming model formulations, integer constraints, simplex iterations, and dual simplex optimization bounds for resource logistics.",
    level: "Advanced",
    estimatedTime: "50h est. time",
    prerequisites: "Linear Algebra, Linear Programming, NumPy",
    rating: 3,
    tasks: [
      { id: "t3_ct1", title: "Simplex Method Optimization Matrix", completed: true },
      { id: "t3_ct2", title: "Duality & Post-Optimality Sensitivity Matrix", completed: false },
      { id: "t3_ct3", title: "Mixed-Integer Linear Programs (MILP)", completed: false },
      { id: "t3_ct4", title: "Bellman's Principle & Dynamic Network Routing", completed: false }
    ],
    resources: [
      INITIAL_RESOURCE_POOL[5]
    ]
  }
];

export const INITIAL_ACTIVE_COURSES: ActiveCourse[] = [
  {
    id: "ac1",
    title: "Advanced Data Structures in Python",
    type: "Video Course",
    level: "Intermediate",
    description: "Deep dive into graphs, trees, and dynamic programming optimization techniques for competitive programming.",
    progressPercent: 45,
    timeRemaining: "2h 15m remaining",
    currentModule: "Module 4 of 8",
    accentColor: "#f59e0b"
  },
  {
    id: "ac2",
    title: "Attention Is All You Need",
    type: "Research Paper",
    level: "Advanced",
    description: "Vaswani et al. The foundational paper introducing the Transformer architecture, dispensing with recurrence and convolutions entirely.",
    progressPercent: 20,
    timeRemaining: "11 pages remaining",
    currentModule: "Page 4 of 15",
    accentColor: "#3b82f6"
  }
];

export const GENERAL_QUIZ_BANK = [
  {
    question: "What is the key benefit of self-attention in Transformer networks compared to RNN cells?",
    options: [
      "It makes the network model run on single-thread CPU structures",
      "It allows O(1) sequential path distance between any distant tokens, enabling full parallel training",
      "It reduces memory consumption to exponential limits",
      "It restricts parameters to lower dimensional grids"
    ],
    answerIndex: 1,
    explanation: "Self-attention enables the model to look at all tokens simultaneously in parallel, avoiding step-by-step sequential processing seen in RNNs. This enables excellent GPU parallelization."
  },
  {
    question: "Which optimizer includes bias correction terms to normalize initial iterations?",
    options: [
      "Stochastic Gradient Descent (SGD)",
      "Standard Momentum Weight decay",
      "Adam (Adaptive Moment Estimation)",
      "Basic Adagrad"
    ],
    answerIndex: 2,
    explanation: "Adam incorporates bias estimation terms for both first and second-moment estimates, correcting their initial drift toward absolute zero."
  },
  {
    question: "In Machine Learning, what is the 'Curse of Dimensionality'?",
    options: [
      "Having too few inputs for target datasets",
      "Data becoming extremely sparse in high-dimensional hyperspace, requiring exponential training samples",
      "The GPU memory collapsing on high dimension inputs",
      "The gradients collapsing during kernel matrix dot products"
    ],
    answerIndex: 1,
    explanation: "As the number of analytical dimensions increases, the volume of space expands exponentially, causing data points to appear highly isolated and sparse. This degrades distance metrics and generalizations."
  }
];
