import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/productschema';
import * as fs from 'fs';
const csv = require('csv-parser');
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { BaseMessage } from "@langchain/core/messages";

  function extractText(response: any): string {
  if (!response) return "";

  // Case 1: direct string
  if (typeof response === "string") return response;

  // Case 2: response has a "content" field
  if (response.content) {
    const content = response.content;

    // If it's an array
    if (Array.isArray(content)) {
      return content
        .map((c) => {
          if (typeof c === "string") return c;
          if (c.text) return c.text;
          if (c.type === "text" && c.value) return c.value;
          return "";
        })
        .join(" ")
        .trim();
    }

    // If it's a single object
    if (typeof content === "object" && content.text) {
      return content.text;
    }
  }

  // Case 3: check for generic "text"
  if (response.text) return response.text;

  // Fallback: stringify
  return JSON.stringify(response);
}

@Injectable()
export class ProductsService {
  private model: ChatGoogleGenerativeAI
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {
    this.model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-2.5-flash',
    });
  }


  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

 async search(query: string): Promise<Product[]> {
  const numericQuery = Number(query);

  const conditions: any[] = [
    { brand: { $regex: query, $options: 'i' } },
    { description: { $regex: query, $options: 'i' } },
    { category: { $regex: query, $options: 'i' } },
    { name: { $regex: query, $options: 'i' } },
    { ingredients: { $regex: query, $options: 'i' } },
    { dosage: { $regex: query, $options: 'i' } },
  ];


  if (!isNaN(numericQuery)) {
    conditions.push({ price: numericQuery });
    conditions.push({ stock: numericQuery });
  }

  return this.productModel.find({ $or: conditions });
}

  async uploadCsv(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            await this.productModel.insertMany(results);
            fs.unlinkSync(filePath); // cleanup
            resolve({ message: 'Products uploaded successfully' });
          } catch (error) {
            reject(new BadRequestException(error.message));
          }
        });
    });
  }

async aiSearch(userQuery: string) {
  const prompt = `
  You are a healthcare shopping assistant.
  From the user query: "${userQuery}",
  extract **product-related keywords and synonyms** (brand, category, ingredients, or product use-case).
  Return them as a simple, comma-separated list.
  Example: "I have weak bones" -> "bone health, calcium, vitamin d, osteoporosis"
  `;

  const response = await this.model.invoke(prompt);
  const keywordsText = extractText(response);

  const keywords = keywordsText
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  // Build dynamic OR conditions
  const orConditions = keywords.flatMap((kw) => [
    { name: { $regex: kw, $options: "i" } },
    { description: { $regex: kw, $options: "i" } },
    { category: { $regex: kw, $options: "i" } },
    { brand: { $regex: kw, $options: "i" } },
    { ingredients: { $regex: kw, $options: "i" } },
  ]);
   const products = await this.productModel.find({ $or: orConditions });


  let explanation: string;

  if (products.length > 0) {
    // Normal explanation if we have products
    const explanationPrompt = `
    The user asked: "${userQuery}".
    I extracted keywords: ${keywords.join(", ")}.
    I found ${products.length} products.
    Write a short explanation (2 sentences max) why these products may help.
    `;
    const explanationResponse = await this.model.invoke(explanationPrompt);
    explanation = extractText(explanationResponse);
  } else {
    // Fallback if no products found
    const fallbackPrompt = `
    The user asked: "${userQuery}".
    I extracted keywords: ${keywords.join(", ")}.
    I did not find any matching products in the database.
    Suggest alternative categories or general advice (2 sentences max), like vitamins, supplements, or lifestyle tips.
    `;
    const explanationResponse = await this.model.invoke(fallbackPrompt);
    explanation = extractText(explanationResponse);
  }

  return { query: userQuery, keywords, products, explanation };
}


}
