export interface LessonStep {
  id: string;
  title: string;
  content: string;
  interactiveType?: 'multiple-choice' | 'text-input' | 'video' | 'case-study' | 'guide' | 'flashcard' | 'simulator' | 'none';
  question?: string;
  options?: string[];
  correctAnswer?: string;
  flashcards?: { front: string; back: string }[];
  videoUrl?: string; // Legacy YouTube URL support
  guideUrl?: string; // Link to the original guide/blog
  readingReferences?: { title: string; url: string }[];
  caseStudy?: {
    context: string;
    challenge: string;
    solution: string;
    results: string;
  };
  simulatorConfig?: {
    type: 'rag-conflict' | 'token-cost' | 'latency-tradeoff' | 'eval-thresholds' | 'mcp-security' | 'agent-loops';
    data: any;
  };
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  points: number;
  steps: LessonStep[];
  thumbnail?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  userId?: string;
  createdAt?: string;
  isCustom?: boolean;
}

export interface UserProfile {
  name: string;
  role: string;
  careerGoal?: string;
  avatar?: string;
}

export interface UserProgress {
  points: number;
  completedLessons: string[];
  currentGoal: number;
  profile?: UserProfile;
  customCourses: Course[];
  pendingTasks?: string[];
}
