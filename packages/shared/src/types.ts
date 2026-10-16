export type Language = 'en' | 'hi' | 'mr';

export type SeverityLevel = 'medium' | 'high' | 'critical';

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameHi: string;
  nameMr: string;
  descriptionEn: string;
  descriptionHi: string;
  descriptionMr: string;
  icon: string;
  order: number;
}

export interface Topic {
  id: string;
  slug: string;
  categoryId: string;
  category?: Category;
  severity: SeverityLevel;
  tags: string[];
  order: number;
  // English
  titleEn: string;
  definitionEn: string;
  howItWorksEn: string;
  fictionalExampleEn: string;
  warningSignsEn: string[];
  safeActionsEn: string[];
  victimGuidanceEn: string[];
  // Hindi
  titleHi: string;
  definitionHi: string;
  howItWorksHi: string;
  fictionalExampleHi: string;
  warningSignsHi: string[];
  safeActionsHi: string[];
  victimGuidanceHi: string[];
  // Marathi
  titleMr: string;
  definitionMr: string;
  howItWorksMr: string;
  fictionalExampleMr: string;
  warningSignsMr: string[];
  safeActionsMr: string[];
  victimGuidanceMr: string[];
  // Metadata
  relatedTopicSlugs?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LocalizedTopic {
  id: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  severity: SeverityLevel;
  tags: string[];
  title: string;
  definition: string;
  howItWorks: string;
  fictionalExample: string;
  warningSigns: string[];
  safeActions: string[];
  victimGuidance: string[];
  relatedTopicSlugs?: string[];
}

export interface QuizOption {
  id: string;
  textEn: string;
  textHi: string;
  textMr: string;
  isCorrect?: boolean; // Hidden on student API, revealed in result
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  order: number;
  questionEn: string;
  questionHi: string;
  questionMr: string;
  explanationEn: string;
  explanationHi: string;
  explanationMr: string;
  difficulty: QuizDifficulty;
  points: number;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  slug: string;
  titleEn: string;
  titleHi: string;
  titleMr: string;
  descriptionEn: string;
  descriptionHi: string;
  descriptionMr: string;
  difficulty: QuizDifficulty;
  categoryId?: string;
  category?: Category;
  questionsCount?: number;
  questions?: QuizQuestion[];
}

export interface QuizAnswerSubmission {
  questionId: string;
  selectedOptionId: string;
}

export interface QuizSubmissionRequest {
  quizId: string;
  userIdentifier?: string; // Optional anonymous session token / identifier
  answers: QuizAnswerSubmission[];
}

export interface QuestionResultDetail {
  questionId: string;
  questionEn?: string;
  questionHi?: string;
  questionMr?: string;
  selectedOptionId: string;
  isCorrect: boolean;
  correctOptionId: string;
  explanationEn: string;
  explanationHi: string;
  explanationMr: string;
}

export interface QuizResultResponse {
  attemptId: string;
  quizId: string;
  totalQuestions: number;
  correctCount: number;
  score: number;
  totalPossibleScore: number;
  percentage: number;
  passed: boolean;
  feedbackEn: string;
  feedbackHi: string;
  feedbackMr: string;
  details: QuestionResultDetail[];
}

export interface Scenario {
  id: string;
  titleEn: string;
  titleHi: string;
  titleMr: string;
  contextEn: string;
  contextHi: string;
  contextMr: string;
  scenarioTextEn: string;
  scenarioTextHi: string;
  scenarioTextMr: string;
  isSafe: boolean; // true = Safe, false = Unsafe (Fraud)
  explanationEn: string;
  explanationHi: string;
  explanationMr: string;
  recommendationEn: string;
  recommendationHi: string;
  recommendationMr: string;
  relatedTopicSlug?: string;
}

export interface FeedbackSubmission {
  name?: string;
  villageOrCity?: string;
  rating: number;
  category: 'general' | 'content_clarity' | 'language_quality' | 'cep_session';
  comment: string;
  language: Language;
}

export interface FeedbackItem extends FeedbackSubmission {
  id: string;
  createdAt: string;
  isApproved?: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator';
}

export interface AuditLogItem {
  id: string;
  action: string;
  performedBy: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
