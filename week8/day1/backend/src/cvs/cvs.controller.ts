import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { CvsService } from './cvs.service'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { CreateCvDto } from './dto/create-cv.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { UpdateCvDto } from './dto/update-cv.dto'

@ApiTags('cvs')
@ApiBearerAuth() 
@UseGuards(JwtAuthGuard)
@Controller('cvs')
export class CvsController {
  constructor(private readonly cvsService: CvsService) {}

  @Get('me')
  getMyCvs(@Req() req) {
    return this.cvsService.findByUser(req.user.userId)
  }

  @Post()
create(@Req() req, @Body() dto: CreateCvDto) {
  return this.cvsService.create(req.user.userId, dto)
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvsService.findOne(id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCvDto) {
    console.log('Update body:', dto); // 👈
    return this.cvsService.update(id, dto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cvsService.delete(id)
  }

  @Post('upload-photo/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/cvs',
        filename: (req, file, callback) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
          callback(null, unique + extname(file.originalname))
        },
      }),
    })
  )
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: { type: 'string', format: 'binary' },
    },
  },
})
async uploadPhoto(
  @Param('id') cvId: string,
  @UploadedFile() file: Express.Multer.File
) {
  const photoUrl = `${process.env.BASE_URL}/cvs/${file.filename}`

  // Update that CV’s photoUrl in DB
  await this.cvsService.update(cvId, { photoUrl })

  return { photoUrl }
}

}
