import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import mammoth from "mammoth";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "./helper";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

async function extractTextFromPDF(file) {
  const fileReader = new FileReader();
  return new Promise((resolve) => {
    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text = text + content.items.map((s) => s.str).join(" ") + "\n";
      }
      resolve(text);
    };
    fileReader.readAsArrayBuffer(file);
  });
}

async function extractTextFromDocx(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (e) {
    console.log(e.message);
    toast(e.message);
  }
}

async function extractText(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "pdf") return await extractTextFromPDF(file);
  if (ext === "docx") return await extractTextFromDocx(file);
  toast("Unsupported file type. Please upload PDF or DOCX.");
  throw new Error("Unsupported file type. Please upload PDF or DOCX.");
}

export async function parseResume(file) {
  const text = await extractText(file);

  const prompt = `
You are a resume parser. Given the following resume text, extract only the following fields:

- name: full name of the candidate
- email: email address
- phone: phone number
- skills: list of technical skills, frameworks, tools, and programming languages

Requirements:
1. Respond ONLY with a JavaScript object like this:
{
  "name": "Full Name",
  ""email": "email@example.com",
  "phone": "+1234567890",
  "skills": ["Skill1", "Skill2", "Skill3"]
}
2. Do NOT include any explanations, extra text, or markdown.
3. The object must be directly parseable with JSON.parse().

Resume text:
${text.substring(0, 3000)}
`;

  const response = await axios.post(BACKEND_URL, {
    prompt,
  });

  let parsed = {};

  try {
    parsed = response.data;
  } catch (e) {
    console.error("Error parsing Gemini response", e);
  }
  return parsed;
}
