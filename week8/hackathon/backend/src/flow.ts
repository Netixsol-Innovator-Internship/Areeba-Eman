// 2
// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import * as pdfParse from 'pdf-parse';
// import { PdfDoc } from './schemas/pdf.schema';
// import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// @Injectable()
// export class PdfService {
//   constructor(@InjectModel(PdfDoc.name) private pdfModel: Model<PdfDoc>) {}

//   async savePdf(file: Express.Multer.File) {
//     console.log('Received file:', file.originalname);

//     // ✅ Extract text from PDF
//     const parsedPdf = await pdfParse.default(file.buffer);
//     const text = parsedPdf.text;

//     // ✅ Call Gemini model
//     const model = new ChatGoogleGenerativeAI({
//       apiKey: process.env.GEMINI_API_KEY!,
//       model: 'gemini-1.5-flash',
//     });

//     const prompt = `
// You are analyzing a PDF document.

// Here is the text from the PDF (may be truncated):
// """
// ${text.slice(0, 8000)}
// """

// Return ONLY JSON (no extra text) in this exact structure:
// {
//   "summary": "<3-5 sentence executive summary>",
//   "highlights": ["<bullet point 1>", "<bullet point 2>", "<bullet point 3>"],
//   "category": "<document type such as research paper, business report, resume, user manual, etc.>"
// }
//     `;

//     const response = await model.invoke([{ role: 'user', content: prompt }]);

//     // ✅ Parse JSON safely
//     let parsed;
//     try {
//       parsed = JSON.parse(response.content as string);
//     } catch (err) {
//       console.error('JSON parse error from Gemini:', response.content);
//       parsed = { summary: '', highlights: [], category: 'Unknown' };
//     }

//     // ✅ Save to DB
//     const doc = new this.pdfModel({
//       filename: file.originalname,
//       text,
//       summary: parsed.summary,
//       highlights: parsed.highlights,
//       category: parsed.category,
//     });

//     await doc.save();

//     return doc;
//   }

//   async askQuestion(id: string, question: string) {
//     const pdf = await this.pdfModel.findById(id);
//     if (!pdf) throw new Error('PDF not found');

//     const model = new ChatGoogleGenerativeAI({
//       apiKey: process.env.GEMINI_API_KEY!,
//       model: 'gemini-1.5-flash',
//     });

//     const response = await model.invoke([
//       {
//         role: 'system',
//         content:
//           'Answer strictly using the provided PDF text. If not found, say "Not found in PDF."',
//       },
//       {
//         role: 'user',
//         content: `PDF Text:\n${pdf.text}\n\nQuestion: ${question}`,
//       },
//     ]);

//     return response.content;
//   }
// }
