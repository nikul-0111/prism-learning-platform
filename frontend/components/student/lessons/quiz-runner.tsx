"use client";

import { useState } from "react";
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, Sparkles } from "lucide-react";

export interface AnswerItem {
  id?: string;
  text: string;
  isCorrect?: boolean;
}

export interface DynamicQuizQuestion {
  id: string;
  text?: string;
  question?: string;
  options?: string[];
  answers?: AnswerItem[];
  correctIndex?: number;
}

interface QuizRunnerProps {
  title: string;
  passMark?: number;
  questions?: DynamicQuizQuestion[];
  onComplete?: (score: number) => void;
}

export default function QuizRunner({
  title,
  passMark = 70,
  questions = [],
  onComplete,
}: QuizRunnerProps) {
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  function handleSelectOption(qId: string, optionIdx: number) {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  }

  function handleSubmitQuiz() {
    if (questions.length === 0) return;

    let correctCount = 0;
    questions.forEach((q) => {
      const selectedIdx = userAnswers[q.id];

      if (q.answers && q.answers.length > 0) {
        // If answers array is provided
        if (selectedIdx !== undefined && q.answers[selectedIdx]?.isCorrect) {
          correctCount++;
        }
      } else if (q.correctIndex !== undefined) {
        if (selectedIdx === q.correctIndex) {
          correctCount++;
        }
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
    if (onComplete) onComplete(calculatedScore);
  }

  function handleResetQuiz() {
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
  }

  const passed = score >= passMark;

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      {/* Quiz Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
              <HelpCircle className="h-3.5 w-3.5" /> Interactive Knowledge Quiz
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">{title}</h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="rounded-2xl bg-slate-100 px-3.5 py-2 text-slate-600">
            Pass Mark: <strong className="text-slate-900">{passMark}%</strong>
          </span>
        </div>
      </div>

      {/* Score Summary Box (If Submitted) */}
      {submitted && (
        <div
          className={`rounded-2xl border p-6 text-center space-y-3 ${
            passed
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          }`}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
            {passed ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black">
              {passed ? "Congratulations! Quiz Passed 🎉" : "Keep Practicing! Quiz Failed"}
            </h3>
            <p className="text-xs font-semibold">
              Your Score: <strong className="text-base">{score}%</strong> (Required {passMark}%)
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetQuiz}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Retake Quiz
          </button>
        </div>
      )}

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-6 text-center text-xs text-slate-500 italic border border-slate-200">
          No quiz questions available for this lesson yet.
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, qIdx) => {
            const questionTitle = q.text || q.question || `Question ${qIdx + 1}`;
            const choices = q.answers
              ? q.answers.map((a) => a.text)
              : q.options || [];

            return (
              <div key={q.id || qIdx} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-black shrink-0">
                    {qIdx + 1}
                  </span>
                  <span>{questionTitle}</span>
                </h4>

                {/* Multiple Choice Options */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {choices.map((opt, optIdx) => {
                    const isSelected = userAnswers[q.id] === optIdx;
                    const isCorrect = q.answers
                      ? q.answers[optIdx]?.isCorrect
                      : q.correctIndex === optIdx;

                    let optionStyle = "border-slate-200 bg-white text-slate-700 hover:bg-slate-100";
                    if (isSelected) {
                      optionStyle = "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold";
                    }

                    if (submitted) {
                      if (isCorrect) {
                        optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "border-red-500 bg-red-50 text-red-800 font-bold";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        disabled={submitted}
                        className={`flex items-center justify-between rounded-xl border p-3.5 text-left text-xs transition cursor-pointer ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {submitted && isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        )}
                        {submitted && isSelected && !isCorrect && (
                          <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submit Button */}
      {!submitted && questions.length > 0 && (
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={handleSubmitQuiz}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 hover:bg-amber-700 px-6 py-3 text-xs font-bold text-white shadow-md shadow-amber-600/20 transition cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Submit Quiz Answers</span>
          </button>
        </div>
      )}
    </div>
  );
}
