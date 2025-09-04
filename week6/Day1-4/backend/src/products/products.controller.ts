import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query,
  UploadedFiles, UseGuards, UseInterceptors
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBody } from '@nestjs/swagger';
import { NotFoundException } from '@nestjs/common';
import { UpdateSaleDto } from './dto/update-sale.dto';

function fileName(_req, file, cb) {
  const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, unique + extname(file.originalname));
}

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Get() getAll(@Query() q: any) {
    return this.products.findAll(q);
  }

  @Get(':id') getOne(@Param('id') id: string) {
    return this.products.findOne(id);
  }
  //uploading images
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, {
    storage: diskStorage({ destination: 'uploads', filename: fileName }),
  }))
  async create(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>) {
    return this.products.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.products.remove(id);
  }

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPERADMIN)
@Post(':id/images/:color')
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      images: {
        type: 'array',
        items: { type: 'string', format: 'binary' },
        description: 'Upload multiple images',
      },
    },
    required: ['images'],
  },
})
@UseInterceptors(FilesInterceptor('images', 10, {
  storage: diskStorage({ destination: 'uploads', filename: fileName }),
}))
uploadImages(
  @Param('id') id: string,
  @Param('color') color: string,
  @UploadedFiles() files: Express.Multer.File[],
) {
  const urls = files.map((f) => `/uploads/${f.filename}`);
  return this.products.attachImages(id, color, urls);
}


 @Patch(':id/sales')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @ApiBody({ type: UpdateSaleDto })
  async setSales(
    @Param('id') id: string,
    @Body() body: UpdateSaleDto,
  ) {
    const saleEnd = body.saleEnd ? new Date(body.saleEnd) : undefined;
    return this.products.updateSale(id, {
      sale: body.sale,
      discount: body.discount ?? 0,
      saleEnd,
    });
  }

}
