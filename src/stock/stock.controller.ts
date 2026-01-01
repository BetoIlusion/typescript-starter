import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StockService } from './stock.service.js';
import { UpdateStockDto } from './dto/update-stock.dto.js';

/**
 * Controlador de Stock
 * Maneja todas las operaciones CRUD y lógica de inventario.
 * Rutas base: /stock
 */
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  /**
   * POST /stock
   * Crea un nuevo registro de stock para un producto
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStockDto: { productId: number; initialQuantity?: number }) {
    return this.stockService.createStock(
      createStockDto.productId,
      createStockDto.initialQuantity || 0,
    );
  }

  /**
   * GET /stock
   * Obtiene todos los productos con su información de stock
   * @query type - Filtro: 'all', 'low'
   */
  @Get()
  findAll(@Query('type') type?: string) {
    if (type === 'low') {
      return this.stockService.getLowStockProducts();
    }
    return this.stockService.getAllStocks();
  }

  /**
   * GET /stock/:productId
   * Obtiene el stock de un producto específico
   */
  @Get(':productId')
  findOne(@Param('productId', ParseIntPipe) productId: number) {
    return this.stockService.getStock(productId);
  }

  /**
   * GET /stock/:productId/movements
   * Obtiene el historial de movimientos de un producto
   */
  @Get(':productId/movements')
  getMovements(@Param('productId', ParseIntPipe) productId: number) {
    return this.stockService.getStockMovements(productId);
  }

  /**
   * POST /stock/:productId/entrada
   * Entrada de stock (compra, devolución de producción)
   */
  @Post(':productId/entrada')
  addStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.stockService.updateStock(productId, updateStockDto, 'entrada');
  }

  /**
   * POST /stock/:productId/salida
   * Salida de stock (venta)
   */
  @Post(':productId/salida')
  sellStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.stockService.updateStock(productId, updateStockDto, 'salida');
  }

  /**
   * POST /stock/:productId/devolucion
   * Devolución de cliente
   */
  @Post(':productId/devolucion')
  returnStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.stockService.updateStock(productId, updateStockDto, 'devolución');
  }

  /**
   * PUT /stock/:productId
   * Ajuste de stock (reemplazo de cantidad)
   */
  @Put(':productId')
  updateStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.stockService.updateStock(productId, updateStockDto, 'ajuste');
  }

  /**
   * DELETE /stock/:productId
   * Elimina el registro de stock de un producto
   */
  @Delete(':productId')
  @HttpCode(HttpStatus.OK)
  remove(@Param('productId', ParseIntPipe) productId: number) {
    return this.stockService.deleteStock(productId);
  }
}
