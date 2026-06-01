export interface GoogleAICourse {
  id: string;
  title: string;
  shortDescription: string;
  modules: string[];
  icon: string;
}

export const GOOGLE_AI_COURSES: GoogleAICourse[] = [
  {
    id: 'ai-professional',
    title: 'Google AI Professional Certificate',
    shortDescription: 'Go beyond the basics with 7 hands-on courses. Build a job-ready portfolio that validates your AI expertise.',
    modules: [
      'AI Fundamentals',
      'AI for Brainstorming & Planning',
      'AI for Research & Insights',
      'AI for Writing & Communicating',
      'AI for Content Creation',
      'AI for Data Analysis',
      'AI for App Building (Capstone)',
    ],
    icon: 'fas fa-robot',
  },
  {
    id: 'ai-essentials',
    title: 'Google AI Essentials',
    shortDescription: 'New to AI? Learn the fundamentals of generative AI with hands-on experience in just a few hours.',
    modules: [
      'Intro to AI',
      'Maximize Productivity With AI Tools',
      'Discover the Art of Prompting',
      'Use AI Responsibly',
      'Stay Ahead of the AI Curve',
    ],
    icon: 'fas fa-lightbulb',
  },
  {
    id: 'agile-essentials',
    title: 'Google Agile Essentials',
    shortDescription: 'Learn Agile project management basics to prioritize tasks, adapt to changes, and structure your projects.',
    modules: [
      'Foundations of Agile Project Management',
      'Implement the Scrum Framework',
      'Organize Projects & Measure Productivity',
    ],
    icon: 'fas fa-tasks',
  },
];
