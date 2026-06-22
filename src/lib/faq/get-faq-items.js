const DEFAULT_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'];

export function getFaqItemsFromTranslations(t, prefix, keys = DEFAULT_KEYS) {
  return keys
    .map((key) => {
      const questionKey = `${prefix}.questions.${key}.question`;
      const answerKey = `${prefix}.questions.${key}.answer`;
      const question = t(questionKey);
      const answer = t(answerKey);

      if (!question || question === questionKey || !answer || answer === answerKey) {
        return null;
      }

      return { id: key, question, answer };
    })
    .filter(Boolean);
}
