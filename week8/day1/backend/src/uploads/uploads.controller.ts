import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { JwtAuthGuard } from 'src/guards/jwt.guard'
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger'
import { UsersService } from 'src/users/users.service'

@Controller('uploads')
export class UploadsController {
  constructor(private readonly usersService: UsersService) {} // Inject UsersService

  @Post('me/photo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/photos',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
          cb(null, unique + extname(file.originalname))
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadProfilePhoto(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const url = `${process.env.BASE_URL}/photos/${file.filename}`

    // Update user's profile photo in DB
    await this.usersService.update(req.user.userId, { profilePhoto: url })

    return { profilePhoto: url }
  }
}
