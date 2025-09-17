import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Cv } from './cvs.schema'

@Injectable()
export class CvsService {
  constructor(@InjectModel(Cv.name) private cvModel: Model<Cv>) {}

  create(userId: string, dto: any) {
    return this.cvModel.create({ userId, ...dto })
  }

  findByUser(userId: string) {
    return this.cvModel.find({ userId })
  }

  findOne(id: string) {
    return this.cvModel.findById(id)
  }

  update(id: string, dto: any) {
    return this.cvModel.findByIdAndUpdate(id, dto, { new: true })
  }

  delete(id: string) {
    return this.cvModel.findByIdAndDelete(id)
  }
}
