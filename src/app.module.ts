import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module.js';
import { StockModule } from './stock/stock.module.js';

/**
 * AppModule - Módulo raíz de la aplicación
 */
@Module({
  imports: [ProductsModule, StockModule],
})
export class AppModule {}
