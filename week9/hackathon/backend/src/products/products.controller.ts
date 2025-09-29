import { Controller,Get,  Query, Post, UseInterceptors,UploadedFile, Body,UseGuards,} from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts() {
    return this.productsService.findAll();
  }

  @Get('search')
  async searchProducts(@Query('q') query: string) {
    return this.productsService.search(query);
  }

  @Post('ai-search')
  async aiSearch(@Body('query') query: string) {
    return this.productsService.aiSearch(query);
  }

 @Post('upload')
    @UseInterceptors(
    FileInterceptor('file', {
        storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
        }),
    }),
    )
    async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    return this.productsService.uploadCsv(file.path);
    }
}
