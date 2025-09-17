import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CvsService } from './cvs.service'
import { CvsController } from './cvs.controller'
import { Cv, CvSchema } from './cvs.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cv.name, schema: CvSchema }]),
  ],
  providers: [CvsService],
  controllers: [CvsController],
})
export class CvsModule {}
