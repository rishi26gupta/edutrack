import Groq from 'groq-sdk';

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export interface AIResult {
  feedback: string;
  suggestedGrade: number;
  breakdown: string[];
}

export async function getAIFeedback(
  assignmentTitle: string,
  questions: Array<{ question: string; marks: number }>,
  answers: Array<{ answer: string }>,
  maxMarks: number
): Promise<AIResult> {
  const qaPairs = questions
    .map(
      (q, i) =>
        `Q${i + 1} [${q.marks} marks]: ${q.question}\n` +
        `Student Answer: ${answers[i]?.answer?.trim() || '(no answer provided)'}`
    )
    .join('\n\n');

  const systemPrompt = `You are a strict, fair academic evaluator for an education platform.
Evaluate the student's answers and return ONLY a valid JSON object with this exact structure:
{
  "feedback": "2–3 sentence overall assessment of the student's performance",
  "suggestedGrade": <integer between 0 and ${maxMarks}>,
  "breakdown": [
    "Q1 (awarded X out of Y marks): reason — what was correct, what was missing",
    "Q2 (awarded X out of Y marks): reason — what was correct, what was missing"
  ]
}
Rules:
- suggestedGrade must be a whole number between 0 and ${maxMarks}
- breakdown array must have exactly ${questions.length} item(s)
- Be specific about what is right and wrong in each answer
- Return ONLY the JSON object, no extra text`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Assignment: "${assignmentTitle}"\nTotal marks: ${maxMarks}\n\n${qaPairs}`,
        },
      ],
      max_tokens: 600,
    });

    const raw = completion.choices[0].message.content ?? '{}';
    const parsed = JSON.parse(raw);

    return {
      feedback: typeof parsed.feedback === 'string' ? parsed.feedback : 'Evaluation complete.',
      suggestedGrade: Math.min(
        maxMarks,
        Math.max(0, Math.round(Number(parsed.suggestedGrade) || 0))
      ),
      breakdown: Array.isArray(parsed.breakdown) ? parsed.breakdown.map(String) : [],
    };
  } catch (err) {
    console.error('[Groq AI Error]', err);
    return {
      feedback: 'Automated evaluation could not be completed at this time.',
      suggestedGrade: 0,
      breakdown: [],
    };
  }
}
