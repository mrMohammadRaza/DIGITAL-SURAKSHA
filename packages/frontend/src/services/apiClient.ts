import {
  Category,
  Topic,
  Quiz,
  QuizSubmissionRequest,
  QuizResultResponse,
  Scenario,
  FeedbackItem,
  FeedbackSubmission,
} from '@digital-suraksha/shared';

const BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api/v1';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    const errorMsg = json.error?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return json.data;
}

export const api = {
  // Content & Categories
  getCategories: () => fetchJson<Category[]>(`${BASE_URL}/categories`),

  getTopics: (params?: { category?: string; severity?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.severity) query.append('severity', params.severity);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return fetchJson<Topic[]>(`${BASE_URL}/topics${qs}`);
  },

  getTopicBySlug: (slug: string) => fetchJson<Topic>(`${BASE_URL}/topics/${slug}`),

  searchContent: (searchTerm: string, category?: string) => {
    const query = new URLSearchParams();
    if (searchTerm) query.append('q', searchTerm);
    if (category) query.append('category', category);
    return fetchJson<any[]>(`${BASE_URL}/search?${query.toString()}`);
  },

  // Scenarios
  getScenarios: () => fetchJson<Scenario[]>(`${BASE_URL}/scenarios`),

  checkScenario: (scenarioId: string, userChoice: boolean) =>
    fetchJson<{
      scenarioId: string;
      userChoice: boolean;
      actualIsSafe: boolean;
      isCorrect: boolean;
      explanationEn: string;
      explanationHi: string;
      explanationMr: string;
      recommendationEn: string;
      recommendationHi: string;
      recommendationMr: string;
      relatedTopicSlug?: string;
    }>(`${BASE_URL}/scenarios/${scenarioId}/check`, {
      method: 'POST',
      body: JSON.stringify({ userChoice }),
    }),

  // Quizzes
  getQuizzes: () => fetchJson<Quiz[]>(`${BASE_URL}/quizzes`),

  getQuizBySlug: (slug: string) => fetchJson<Quiz>(`${BASE_URL}/quizzes/${slug}`),

  submitQuizAttempt: (slug: string, submission: QuizSubmissionRequest) =>
    fetchJson<QuizResultResponse>(`${BASE_URL}/quizzes/${slug}/attempts`, {
      method: 'POST',
      body: JSON.stringify(submission),
    }),

  getAttemptResults: (attemptId: string) =>
    fetchJson<any>(`${BASE_URL}/attempts/${attemptId}/results`),

  // Feedback
  getFeedback: () => fetchJson<FeedbackItem[]>(`${BASE_URL}/feedback`),

  submitFeedback: (feedback: FeedbackSubmission) =>
    fetchJson<FeedbackItem>(`${BASE_URL}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedback),
    }),

  // Admin
  adminLogin: (credentials: { email: string; password: string }) =>
    fetchJson<{ token: string; user: any }>(`${BASE_URL}/admin/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getAdminDashboard: (token: string) =>
    fetchJson<{
      stats: {
        topicsCount: number;
        categoriesCount: number;
        quizzesCount: number;
        attemptsCount: number;
        feedbackCount: number;
        passRate: number;
      };
      recentAttempts: any[];
      recentLogs: any[];
    }>(`${BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  adminCreateTopic: (token: string, topicData: any) =>
    fetchJson<Topic>(`${BASE_URL}/admin/topics`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(topicData),
    }),

  adminDeleteTopic: (token: string, id: string) =>
    fetchJson<{ message: string }>(`${BASE_URL}/admin/topics/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),

  adminGetFeedback: (token: string) =>
    fetchJson<FeedbackItem[]>(`${BASE_URL}/admin/feedback`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  adminToggleFeedback: (token: string, id: string) =>
    fetchJson<FeedbackItem>(`${BASE_URL}/admin/feedback/${id}/toggle-approval`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    }),
};
