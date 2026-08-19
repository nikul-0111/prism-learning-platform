"use client";

import { useState } from "react";
import { Plus, Trash2, HelpCircle, CheckCircle2, ListChecks, FileText, ToggleLeft } from "lucide-react";
import { QuestionInput, QuestionType, AnswerInput } from "@/lib/api/instructor-quiz.api";

interface QuestionBuilderProps {
  questions: QuestionInput[];
  onChange: (questions: QuestionInput[]) => void;
}

export default function QuestionBuilder({ questions, onChange }: QuestionBuilderProps) {
  function addQuestion(type: QuestionType) {
    let initialAnswers: AnswerInput[] = [];

    if (type === "TRUE_FALSE") {
      initialAnswers = [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false },
      ];
    } else if (type === "SHORT_ANSWER") {
      initialAnswers = [{ text: "Correct keyword/phrase", isCorrect: true }];
    } else {
      initialAnswers = [
        { text: "Option 1", isCorrect: true },
        { text: "Option 2", isCorrect: false },
        { text: "Option 3", isCorrect: false },
        { text: "Option 4", isCorrect: false },
      ];
    }

    const newQuestion: QuestionInput = {
      id: crypto.randomUUID(),
      text: "",
      type,
      position: questions.length,
      answers: initialAnswers,
    };

    onChange([...questions, newQuestion]);
  }

  function updateQuestionText(qIdx: number, text: string) {
    const updated = [...questions];
    updated[qIdx] = { ...updated[qIdx], text };
    onChange(updated);
  }

  function updateQuestionType(qIdx: number, type: QuestionType) {
    const updated = [...questions];
    let initialAnswers: AnswerInput[] = [];

    if (type === "TRUE_FALSE") {
      initialAnswers = [
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false },
      ];
    } else if (type === "SHORT_ANSWER") {
      initialAnswers = [{ text: "Correct keyword/phrase", isCorrect: true }];
    } else {
      initialAnswers = [
        { text: "Option 1", isCorrect: true },
        { text: "Option 2", isCorrect: false },
        { text: "Option 3", isCorrect: false },
        { text: "Option 4", isCorrect: false },
      ];
    }

    updated[qIdx] = { ...updated[qIdx], type, answers: initialAnswers };
    onChange(updated);
  }

  function deleteQuestion(qIdx: number) {
    onChange(questions.filter((_, idx) => idx !== qIdx));
  }

  function updateAnswerText(qIdx: number, aIdx: number, text: string) {
    const updated = [...questions];
    const q = { ...updated[qIdx] };
    const answers = [...q.answers];
    answers[aIdx] = { ...answers[aIdx], text };
    q.answers = answers;
    updated[qIdx] = q;
    onChange(updated);
  }

  function setCorrectAnswer(qIdx: number, aIdx: number) {
    const updated = [...questions];
    const q = { ...updated[qIdx] };

    if (q.type === "MULTIPLE_CHOICE" || q.type === "TRUE_FALSE") {
      // Single correct answer
      q.answers = q.answers.map((a, idx) => ({
        ...a,
        isCorrect: idx === aIdx,
      }));
    } else if (q.type === "MULTI_SELECT") {
      // Multiple correct answers allowed
      q.answers = q.answers.map((a, idx) =>
        idx === aIdx ? { ...a, isCorrect: !a.isCorrect } : a
      );
    }

    updated[qIdx] = q;
    onChange(updated);
  }

  function addAnswerChoice(qIdx: number) {
    const updated = [...questions];
    const q = { ...updated[qIdx] };
    q.answers = [
      ...q.answers,
      { text: `Option ${q.answers.length + 1}`, isCorrect: false },
    ];
    updated[qIdx] = q;
    onChange(updated);
  }

  function deleteAnswerChoice(qIdx: number, aIdx: number) {
    const updated = [...questions];
    const q = { ...updated[qIdx] };
    if (q.answers.length <= 2) return; // Keep at least 2 choices
    q.answers = q.answers.filter((_, idx) => idx !== aIdx);
    updated[qIdx] = q;
    onChange(updated);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4 text-indigo-600" />
          <span>Question Authoring List ({questions.length})</span>
        </h4>
      </div>

      {/* Questions list */}
      {questions.map((q, qIdx) => (
        <div
          key={q.id || qIdx}
          className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm transition hover:border-indigo-200"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">
              Q{qIdx + 1}
            </span>

            {/* Select Question Type */}
            <select
              value={q.type}
              onChange={(e) => updateQuestionType(qIdx, e.target.value as QuestionType)}
              className="rounded-xl border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="MULTIPLE_CHOICE">Multiple Choice (MCQ)</option>
              <option value="MULTI_SELECT">Multi-Select</option>
              <option value="TRUE_FALSE">True / False</option>
              <option value="SHORT_ANSWER">Short Answer</option>
            </select>

            <button
              type="button"
              onClick={() => deleteQuestion(qIdx)}
              className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
              title="Delete question"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Question Text */}
          <input
            type="text"
            value={q.text}
            onChange={(e) => updateQuestionText(qIdx, e.target.value)}
            placeholder={`Enter Question ${qIdx + 1} text or prompt...`}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-medium text-slate-800"
            required
          />

          {/* Options / Choices per Question Type */}
          <div className="space-y-2 pt-1">
            <p className="text-[11px] font-semibold text-slate-500">
              {q.type === "MULTIPLE_CHOICE" && "Select radio for the 1 correct answer:"}
              {q.type === "MULTI_SELECT" && "Check boxes for all correct answers:"}
              {q.type === "TRUE_FALSE" && "Select correct answer:"}
              {q.type === "SHORT_ANSWER" && "Expected answer keyword/phrase:"}
            </p>

            {q.answers.map((a, aIdx) => (
              <div key={aIdx} className="flex items-center gap-2">
                {/* Radio / Checkbox for correct answer toggle */}
                {q.type === "SHORT_ANSWER" ? null : q.type === "MULTI_SELECT" ? (
                  <input
                    type="checkbox"
                    checked={a.isCorrect}
                    onChange={() => setCorrectAnswer(qIdx, aIdx)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                ) : (
                  <input
                    type="radio"
                    name={`q-${qIdx}-correct`}
                    checked={a.isCorrect}
                    onChange={() => setCorrectAnswer(qIdx, aIdx)}
                    className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                )}

                <input
                  type="text"
                  value={a.text}
                  onChange={(e) => updateAnswerText(qIdx, aIdx, e.target.value)}
                  disabled={q.type === "TRUE_FALSE"}
                  placeholder={`Choice ${aIdx + 1}`}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs outline-none focus:border-indigo-500"
                />

                {(q.type === "MULTIPLE_CHOICE" || q.type === "MULTI_SELECT") && (
                  <button
                    type="button"
                    onClick={() => deleteAnswerChoice(qIdx, aIdx)}
                    className="text-slate-400 hover:text-red-500 p-1"
                    title="Remove choice"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}

            {(q.type === "MULTIPLE_CHOICE" || q.type === "MULTI_SELECT") && (
              <button
                type="button"
                onClick={() => addAnswerChoice(qIdx)}
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline"
              >
                <Plus className="h-3 w-3" />
                Add Choice
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Add Question Toolbar */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/30 p-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 mr-1">
          + Add Question Type:
        </span>

        <button
          type="button"
          onClick={() => addQuestion("MULTIPLE_CHOICE")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
        >
          <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />
          <span>+ MCQ</span>
        </button>

        <button
          type="button"
          onClick={() => addQuestion("MULTI_SELECT")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
        >
          <ListChecks className="h-3.5 w-3.5 text-emerald-600" />
          <span>+ Multi-Select</span>
        </button>

        <button
          type="button"
          onClick={() => addQuestion("TRUE_FALSE")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-bold text-amber-700 shadow-sm transition hover:bg-amber-50"
        >
          <ToggleLeft className="h-3.5 w-3.5 text-amber-600" />
          <span>+ True/False</span>
        </button>

        <button
          type="button"
          onClick={() => addQuestion("SHORT_ANSWER")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
        >
          <FileText className="h-3.5 w-3.5 text-blue-600" />
          <span>+ Short Answer</span>
        </button>
      </div>
    </div>
  );
}
