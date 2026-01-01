import { Module } from '@nestjs/common';
import { StockService } from './stock.service.js';
import { StockController } from './stock.controller.js';
import { ProductsModule } from '../products/products.module.js';

/**
 * StockModule - Módulo que gestiona el inventario
 */
@Module({
  imports: [ProductsModule],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
