import { get, post } from "./client";

export type QuestionType = "MULTIPLE_CHOICE" | "MULTI_SELECT" | "TRUE_FALSE" | "SHORT_ANSWER";

export interface AnswerInput {
  id?: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionInput {
  id?: string;
  text: string;
  type: QuestionType;
  position?: number;
  answers: AnswerInput[];
}

export interface QuizData {
  id?: string;
  title: string;
  passMark?: number;
  timeLimit?: number;
  maxAttempts?: number;
  questions?: QuestionInput[];
}

export interface QuizResponse {
  message?: string;
  data: {
    quiz: QuizData | null;
  };
}

export async function getQuiz(lessonId: string): Promise<QuizResponse> {
  return get<QuizResponse>(`/instructor/lessons/${lessonId}/quiz`);
}

export async function saveQuiz(
  lessonId: string,
  data: QuizData
): Promise<QuizResponse> {
  return post<QuizResponse>(`/instructor/lessons/${lessonId}/quiz`, data);
}
