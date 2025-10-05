import { Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from '../assignment/dto/create-assignment.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GenAiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GENAI_API_KEY;
    if (!apiKey) {
      throw new Error('❌ GENAI_API_KEY not set in environment');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

 async evaluateText(config: CreateAssignmentDto, studentText: string) {
  const prompt = `
    Assignment Instructions: ${config.instructions}
    Mode: ${config.mode}
    Student Submission: ${studentText}

    Evaluate the submission strictly according to the instructions.Remarks should only be 10-40 words. Marks between 0 to 10 Provide ONLY valid JSON, no extra text.
    Format:
Return ONLY a valid JSON object in this format:

{
  "score": number,
  "remarks": "string"
}
  `;

  const result = await this.model.generateContent(prompt);
  const text = result.response.text();

  // Try to find JSON inside response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const cleanText = jsonMatch ? jsonMatch[0] : text;

  try {
    return JSON.parse(cleanText);
  } catch (err) {
    console.error("❌ JSON parse failed. Raw response:", text);
    return { score: 0, remarks: "Error parsing AI response" };
  }
}


}
