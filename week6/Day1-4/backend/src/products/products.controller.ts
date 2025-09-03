import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
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
function fileName(_req, file, cb) { const unique = Date.now() + '-' + Math.round(Math.random()*1e9); cb(null, unique + extname(file.originalname)); }
@ApiTags('products') @Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}
  @Get() getAll(@Query() q: any) { return this.products.findAll(q); }
  @Get(':id') getOne(@Param('id') id: string) { return this.products.findOne(id); }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPERADMIN) @Post() create(@Body() dto: CreateProductDto) { return this.products.create(dto); }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPERADMIN) @Patch(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>) { return this.products.update(id, dto); }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPERADMIN) @Delete(':id') remove(@Param('id') id: string) { return this.products.remove(id); }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post(':id/images/:color') @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, { storage: diskStorage({ destination: 'uploads', filename: fileName }) }))
  uploadImages(@Param('id') id: string, @Param('color') color: string, @UploadedFiles() files: Express.Multer.File[]) {
    const urls = files.map((f) => `/uploads/${f.filename}`);
    return this.products.attachImages(id, color, urls);
  }
  @Patch(':id/sales')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  setSales(@Param('id') id: string, 
  @Body() body: { sale: boolean, discount?: number, saleEnd?: Date }) {
    return this.products.updateSale(id, body);
  } 
}
