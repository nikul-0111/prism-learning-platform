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

export interface CreateQuizInput {
  title: string;
  passMark?: number;
  timeLimit?: number;
  maxAttempts?: number;
  questions?: QuestionInput[];
}
