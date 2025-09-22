import { Controller, Post, Body } from '@nestjs/common';
import { app } from './research.workflow';
import { ResearchState } from './research.state';
import mongoose from 'mongoose';
import { DocumentSchema, ResearchDoc } from '../schemas/document.schema';
import { runWorkflow } from "./research.workflow";

// Register model once
const DocumentModel = mongoose.model<ResearchDoc>("Document", DocumentSchema);

@Controller("research")
export class ResearchController {
  @Post("ask")
  async ask(@Body() body: { question: string }) {
    // Call the workflow wrapper that logs trace
    const result = await runWorkflow(body.question);

    // Send both finalAnswer and step-by-step trace
    return {
      finalAnswer: result.finalAnswer,
      trace: result.trace || [],
    };
  }

  // 🚀 Upload a document into MongoDB
  @Post("upload")
  async upload(@Body() body: { title: string; topic: string; content: string }) {
    const doc = new DocumentModel({
      title: body.title,
      topic: body.topic,
      content: body.content,
    });
    await doc.save();
    return { message: "✅ Document uploaded", id: doc._id };
  }
}
