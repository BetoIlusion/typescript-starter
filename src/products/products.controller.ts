import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

/**
 * Controlador de Productos
 * Gestiona el catálogo de productos e inventario
 * Rutas base: /products
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * POST /products
   * Crea un nuevo producto en el catálogo
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * GET /products
   * Obtiene todos los productos activos
   */
  @Get()
  findAll(@Query('onlyActive') onlyActive?: string) {
    const active = onlyActive !== 'false';
    return this.productsService.findAll(active);
  }

  /**
   * GET /products/search/:term
   * Búsqueda de productos por nombre
   */
  @Get('search/:term')
  search(@Param('term') searchTerm: string) {
    return this.productsService.search(searchTerm);
  }

  /**
   * GET /products/category/:name
   * Obtiene productos de una categoría
   */
  @Get('category/:name')
  findByCategory(@Param('name') category: string) {
    return this.productsService.findByCategory(category);
  }

  /**
   * GET /products/price-range/:min/:max
   * Filtra productos por rango de precio
   */
  @Get('price-range/:min/:max')
  findByPriceRange(
    @Param('min', ParseIntPipe) minPrice: number,
    @Param('max', ParseIntPipe) maxPrice: number,
  ) {
    return this.productsService.findByPriceRange(minPrice, maxPrice);
  }

  /**
   * GET /products/admin/statistics
   * Obtiene estadísticas del catálogo
   */
  @Get('admin/statistics')
  getStatistics() {
    return this.productsService.getStatistics();
  }

  /**
   * GET /products/:id
   * Obtiene un producto específico por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  /**
   * PUT /products/:id
   * Actualiza un producto
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * DELETE /products/:id/deactivate
   * Desactiva un producto (soft delete)
   */
  @Delete(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deactivate(id);
  }

  /**
   * DELETE /products/:id
   * Elimina un producto permanentemente
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
