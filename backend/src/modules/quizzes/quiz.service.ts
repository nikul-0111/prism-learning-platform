import { prisma } from "../../lib/prisma.js";
import { validateCreateQuiz } from "./quiz.validation.js";
import type { CreateQuizInput } from "./quiz.types.js";

export async function getQuizByLesson(lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      quiz: {
        include: {
          questions: {
            orderBy: { position: "asc" },
            include: {
              answers: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    return null;
  }

  // Auto-initialize default quiz structure if quiz data isn't configured yet
  if (!lesson.quiz) {
    const createdQuiz = await prisma.quiz.create({
      data: {
        title: lesson.title,
        passMark: 70,
        timeLimit: 15,
        maxAttempts: 3,
        questions: {
          create: [
            {
              text: `Sample Assessment Question for ${lesson.title}`,
              type: "MULTIPLE_CHOICE",
              position: 0,
              answers: {
                create: [
                  { text: "Option A", isCorrect: true },
                  { text: "Option B", isCorrect: false },
                  { text: "Option C", isCorrect: false },
                  { text: "Option D", isCorrect: false },
                ],
              },
            },
          ],
        },
      },
      include: {
        questions: {
          orderBy: { position: "asc" },
          include: { answers: true },
        },
      },
    });

    await prisma.lesson.update({
      where: { id: lessonId },
      data: { quizId: createdQuiz.id },
    });

    return createdQuiz;
  }

  return lesson.quiz;
}

// PRISM Spec Security Guard: Strip isCorrect from answers for students
export async function getQuizForStudent(quizId: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        orderBy: { position: "asc" },
        include: {
          answers: {
            select: {
              id: true,
              text: true,
              // isCorrect is intentionally EXCLUDED to prevent JSON network leaks
            },
          },
        },
      },
    },
  });

  return quiz;
}

export async function createOrUpdateQuiz(lessonId: string, data: CreateQuizInput) {
  const input = validateCreateQuiz(data);

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
  });

  if (!lesson) {
    throw new Error("Lesson not found.");
  }

  // Atomic database transaction
  return prisma.$transaction(async (tx) => {
    let quizId = lesson.quizId;

    if (quizId) {
      // Delete old questions/answers for clean update
      await tx.question.deleteMany({
        where: { quizId },
      });

      await tx.quiz.update({
        where: { id: quizId },
        data: {
          title: input.title,
          passMark: input.passMark,
          timeLimit: input.timeLimit,
          maxAttempts: input.maxAttempts,
        },
      });
    } else {
      const createdQuiz = await tx.quiz.create({
        data: {
          title: input.title,
          passMark: input.passMark,
          timeLimit: input.timeLimit,
          maxAttempts: input.maxAttempts,
        },
      });
      quizId = createdQuiz.id;

      await tx.lesson.update({
        where: { id: lessonId },
        data: { quizId },
      });
    }

    // Create questions and answers
    if (input.questions && input.questions.length > 0) {
      for (const q of input.questions) {
        await tx.question.create({
          data: {
            quizId: quizId!,
            text: q.text,
            type: q.type as any,
            position: q.position || 0,
            answers: {
              create: q.answers.map((a) => ({
                text: a.text,
                isCorrect: a.isCorrect,
              })),
            },
          },
        });
      }
    }

    return tx.quiz.findUnique({
      where: { id: quizId! },
      include: {
        questions: {
          orderBy: { position: "asc" },
          include: { answers: true },
        },
      },
    });
  });
}
