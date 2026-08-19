import type { CreateQuizInput, QuestionType } from "./quiz.types.js";

const VALID_QUESTION_TYPES: QuestionType[] = [
  "MULTIPLE_CHOICE",
  "MULTI_SELECT",
  "TRUE_FALSE",
  "SHORT_ANSWER",
];

export function validateCreateQuiz(data: CreateQuizInput): CreateQuizInput {
  const title = data.title?.trim() || "Untitled Quiz";

  const passMark =
    typeof data.passMark === "number" && data.passMark > 0 && data.passMark <= 100
      ? data.passMark
      : 70;

  const timeLimit =
    typeof data.timeLimit === "number" && data.timeLimit > 0
      ? data.timeLimit
      : 15;

  const maxAttempts =
    typeof data.maxAttempts === "number" && data.maxAttempts > 0
      ? data.maxAttempts
      : 3;

  const questions = (data.questions || [])
    .filter((q) => q && (q.text?.trim() || (q.answers && q.answers.length > 0)))
    .map((q, idx) => {
      const text = q.text?.trim() || `Question ${idx + 1}`;
      const type = VALID_QUESTION_TYPES.includes(q.type) ? q.type : "MULTIPLE_CHOICE";

      const answers = (q.answers || [])
        .filter((a) => a && a.text !== undefined)
        .map((a, aIdx) => {
          const aText = a.text?.trim() || `Option ${aIdx + 1}`;
          return {
            id: a.id,
            text: aText,
            isCorrect: Boolean(a.isCorrect),
          };
        });

      // Ensure at least 1 answer has isCorrect = true for MCQ / True False
      if (answers.length > 0 && !answers.some((a) => a.isCorrect)) {
        answers[0].isCorrect = true;
      }

      return {
        id: q.id,
        text,
        type,
        position: typeof q.position === "number" ? q.position : idx,
        answers,
      };
    });

  return {
    title,
    passMark,
    timeLimit,
    maxAttempts,
    questions,
  };
}
