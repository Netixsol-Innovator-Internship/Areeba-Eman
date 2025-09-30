import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './schemas/match.schema';
// import { Readable } from 'stream';
// import csvParser from 'csv-parser';
import { buildWorkflow } from "./workflow";

@Injectable()
export class CricketService {
    private workflow;
  constructor(@InjectModel(Match.name) private matchModel: Model<Match>) {
    this.workflow = buildWorkflow(this.matchModel);
  }

  // async uploadCSV(file: Express.Multer.File, type: string) {
  //   return new Promise((resolve, reject) => {
  //     const results: any[] = [];

  //     Readable.from(file.buffer)
  //       .pipe(csvParser())
  //       .on('data', (row) => {
  //         results.push({
  //           team: row['Team'],
  //           score: row['Score'],
  //           overs: row['Overs'],
  //           rpo: row['RPO'],
  //           lead: row['Lead'],
  //           inns: row['Inns'],
  //           result: row['Result'],
  //           opposition: row['Opposition'],
  //           ground: row['Ground'],
  //           start_date: row['Start Date'],
  //           type, // add type (test/odi/t20)
  //         });
  //       })
  //       .on('end', async () => {
  //         await this.matchModel.insertMany(results);
  //         resolve({ message: `${results.length} records uploaded for ${type}` });
  //       })
  //       .on('error', reject);
  //   });
  // }
    async ask(question: string) {
        const response = await this.workflow.invoke({ question });
        return response.answer;
    }
}
