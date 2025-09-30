import axios from "axios";
import { BACKEND_URL } from "./helper";

export async function evaluateInterview(answers) {
  const prompt = `
    You are an interviewer AI. Evaluate the candidate's performance.

    Questions & Answers:
    ${answers
      .map(
        (a, i) =>
          `Q${i + 1}:${a.question}\nA${i + 1}:${a.answer} || "(no answer)"}`
      )
      .join("\n\n")}
    
    Instructions:
- Give a numeric score between 0 and 10 (higher = better).
- Provide a short 3–4 sentence summary of strengths and weaknesses.
Return JSON like this:
{
  "score": 7,
  "summary": "Candidate showed good problem solving..."
}
Respond ONLY with JSON, no markdown, no \`\`\`.
    `;
  const result = await axios.post(BACKEND_URL, { prompt });
  const text = result.data;

  try {
    return text;
  } catch (e) {
    console.error("AI returned non-JSON", e.message);
    return {
      score: 0,
      summary: "Evaluation failed. Please retry.",
    };
  }
}
