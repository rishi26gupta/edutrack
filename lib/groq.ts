import Groq from 'groq-sdk';

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

export async function getAIFeedback(assignmentTitle: string, content: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful teaching assistant. Review this student submission and give constructive feedback in exactly 3 bullet points covering: 1) Clarity and structure, 2) Completeness and accuracy, 3) One specific improvement. Keep it concise, helpful, and encouraging.'
      },
      {
        role: 'user',
        content: `Assignment Title: "${assignmentTitle}"\n\nStudent's Submission Content:\n${content}`
      }
    ],
    max_tokens: 300,
  });
  return completion.choices[0].message.content || 'No feedback generated';
}
