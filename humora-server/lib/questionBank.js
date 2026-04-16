import questionsData from '../data/questions.json' with { type: 'json' };

const questionMap = new Map(
  questionsData.questions.map((question) => [
    question.id,
    {
      id: question.id,
      options: new Map(question.options.map((option) => [option.id, option])),
    },
  ])
);

export function buildValidatedAnswerSet(rawAnswers = []) {
  if (!Array.isArray(rawAnswers) || rawAnswers.length !== 5) {
    return null;
  }

  const seenQuestionIds = new Set();
  const validatedAnswers = [];

  for (const rawAnswer of rawAnswers) {
    const question = questionMap.get(rawAnswer?.questionId);
    if (!question || seenQuestionIds.has(rawAnswer.questionId)) {
      return null;
    }

    const option = question.options.get(rawAnswer.optionId);
    if (!option) {
      return null;
    }

    seenQuestionIds.add(rawAnswer.questionId);
    validatedAnswers.push({
      questionId: rawAnswer.questionId,
      optionId: rawAnswer.optionId,
      humanScore: option.humanScore,
    });
  }

  return validatedAnswers;
}
