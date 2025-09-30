import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { BACKEND_URL } from "./helper";


export async function generateQuestions(
  skills
) {
  console.log(skills);
  const prompt = `
You are an interview question generator.
The candidate has the following skills: ${skills.join(", ")}.

Requirements:
1. Generate exactly 6 questions:
   - 2 easy
   - 2 medium
   - 2 hard
2. Each question object must have the following keys:
   - "prompt": the question text
   - "difficulty": "easy", "medium", or "hard"
   - "time": time in seconds (easy=20, medium=60, hard=120)
3. Respond ONLY with a JSON array of objects like this:

[
  { "prompt": "question text", "difficulty": "easy", "time": 20 },
  ...
]

4. Do NOT include explanations, markdown, numbering outside the JSON, or any extra text.
5. Make sure the JSON is directly parseable with JSON.parse().

Generate the questions now.
`;

  const response = await axios.post(BACKEND_URL, {
    prompt,
  });
  let questions = [];
  try {
    questions = response.data;
    console.log(questions);
  } catch (e) {
    console.error("Question JSON parse failed", e);
  }
  return questions;
}
