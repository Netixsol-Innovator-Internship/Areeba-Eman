import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/Update-car.dto';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiBearerAuth()
@Controller('cars')
export class CarsController {
  constructor(private cars: CarsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FilesInterceptor('photos', 6, {
      storage: diskStorage({
        destination: './uploads/cars', // folder to save photos
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create car with up to 6 photos',
    type: CreateCarDto,
  })
  async create(
    @GetUser('sub') userId: string,
    @Body() dto: CreateCarDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(files); // will log uploaded files
    return this.cars.create(userId, dto, files);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.cars.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cars.findById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCarDto) {
    return this.cars.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cars.remove(id);
  }
}
