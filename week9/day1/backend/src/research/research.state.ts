export interface ResearchState {
  question: string;
  subquestions?: string[];
  foundDocs?: any[];
  rankedDocs?: any[];
  summaries?: string[];
  contradictions?: string[];
  finalAnswer?: string;
   trace?: any[]; // add this
}
