import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as pdfParse from 'pdf-parse';
import { PdfDoc } from './schemas/pdf.schema';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

@Injectable()
export class PdfService {
  constructor(@InjectModel(PdfDoc.name) private pdfModel: Model<PdfDoc>) {}

  async savePdf(file: Express.Multer.File) {
    console.log('Received file:', file.originalname);

    // ✅ Extract text from PDF
    const parsedPdf = await pdfParse.default(file.buffer);
    const text = parsedPdf.text;

    // ✅ Call Gemini model
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY!,
      model: 'gemini-1.5-flash',
    });

      const prompt = `
        You are analyzing a PDF document.

        Here is the text from the PDF (may be truncated):
        """
        ${text.slice(0, 8000)}
        """

        Return ONLY JSON (no extra text) in this exact structure:
        {
          "summary": "<3-5 sentence executive summary>",
          "highlights": ["<bullet point 1>", "<bullet point 2>", "<bullet point 3>"],
          "category": "<document type such as research paper, business report, resume, user manual, etc.>"
        }
      `;

    const response = await model.invoke([{ role: 'user', content: prompt }]);

    // ✅ Parse JSON safely
    // ✅ Parse JSON safely
let parsed;
try {
  let raw = '';

  if (Array.isArray(response.content)) {
    raw = response.content
      .map((c: any) => c.text ?? c.content ?? '')
      .join('')
      .trim();
  } else {
    raw = String(response.content).trim();
  }

  console.log('🔍 Gemini raw output:', raw);

  raw = raw.replace(/```json|```/g, '').trim();
  parsed = JSON.parse(raw);
} catch (err) {
  console.error('JSON parse error from Gemini:', err);
  parsed = { summary: '', highlights: [], category: 'Unknown' };
}




    // ✅ Save to DB
    const doc = new this.pdfModel({
      filename: file.originalname,
      text,
      summary: parsed.summary,
      highlights: parsed.highlights,
      category: parsed.category,
    });

    await doc.save();

    // ✅ Return the doc so frontend gets these fields
    return {
      _id: doc._id,
      filename: doc.filename,
      summary: doc.summary,
      highlights: doc.highlights,
      category: doc.category,
    };
      }

async askQuestion(id: string, question: string) {
  const pdf = await this.pdfModel.findById(id);
  if (!pdf) throw new Error('PDF not found');

  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY!,
    model: 'gemini-1.5-flash',
  });

  const response = await model.invoke([
    {
      role: 'system',
      content: `You are a PDF assistant. 
      You must answer only based on the provided PDF text.
        - If the answer is directly supported by the PDF content, answer concisely.You can give suggestions also. 
        - If the question is unrelated or irrelevant to the PDF content, respond exactly with: "This question is irrelevant to the PDF content."`,
    },
    {
      role: 'user',
      content: `PDF Text:\n${pdf.text}\n\nQuestion: ${question}`,
    },
  ]);

  let answer = '';

  if (Array.isArray(response.content)) {
    answer = response.content
      .filter((c: any) => c.type === 'text')
      .map((c: any) => c.text)
      .join(' ')
      .trim();
  } else if (typeof response.content === 'string') {
    answer = response.content.trim();
  }

  console.log("Gemini's answer:", answer);
  return answer || 'No answer generated.';
}


  async getPdfMetadata(id: string) {
    const pdf = await this.pdfModel.findById(id).select('summary highlights category filename');
    if (!pdf) throw new Error('PDF not found');
    return pdf;
  }

  async getAllPdfs() {
    return this.pdfModel.find().select('filename summary category').lean();
  }
}
