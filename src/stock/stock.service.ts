import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Stock, StockMovement } from './entities/stock.entity.js';
import { UpdateStockDto } from './dto/update-stock.dto.js';
import { StockResponseDto } from './dto/stock-response.dto.js';

@Injectable()
export class StockService {
  /**
   * Map que almacena el stock en memoria (en producción usar BD)
   * Key: productId, Value: Stock
   */
  private stockMap = new Map<number, Stock>();

  /**
   * Registra un nuevo producto con stock inicial
   * @param productId - ID del producto
   * @param initialQuantity - Cantidad inicial del stock
   */
  createStock(
    productId: number,
    initialQuantity: number = 0,
  ): StockResponseDto {
    try {
      // Validar que el producto no exista
      if (this.stockMap.has(productId)) {
        throw new BadRequestException(
          `El producto ${productId} ya tiene stock registrado`,
        );
      }

      // Validar cantidad positiva
      if (initialQuantity < 0) {
        throw new BadRequestException('La cantidad inicial no puede ser negativa');
      }

      // Crear nueva instancia de Stock (objeto)
      const stock = new Stock(productId, initialQuantity);

      // Registrar movimiento inicial si hay cantidad
      if (initialQuantity > 0) {
        const movement = new StockMovement(
          'entrada',
          initialQuantity,
          'Stock inicial',
          0,
          initialQuantity,
        );
        stock.movements.push(movement);
      }

      // Guardar en el mapa
      this.stockMap.set(productId, stock);

      return this.mapToResponseDto(stock);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al crear stock: ' + error.message);
    }
  }

  /**
   * Obtiene el stock de un producto
   * @param productId - ID del producto
   */
  getStock(productId: number): StockResponseDto {
    try {
      const stock = this.stockMap.get(productId);

      if (!stock) {
        throw new NotFoundException(
          `No se encontró stock para el producto ${productId}`,
        );
      }

      return this.mapToResponseDto(stock);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener stock: ' + error.message);
    }
  }

  /**
   * Actualiza el stock de un producto
   * Soporta entrada, salida, ajuste y devolución
   * @param productId - ID del producto
   * @param updateDto - Datos de actualización
   * @param type - Tipo de movimiento
   */
  updateStock(
    productId: number,
    updateDto: UpdateStockDto,
    type: 'entrada' | 'salida' | 'ajuste' | 'devolución' = 'ajuste',
  ): StockResponseDto {
    try {
      const stock = this.stockMap.get(productId);

      // Validar que el producto exista
      if (!stock) {
        throw new NotFoundException(
          `No se encontró stock para el producto ${productId}`,
        );
      }

      // Validar cantidad positiva
      if (updateDto.quantity <= 0) {
        throw new BadRequestException('La cantidad debe ser mayor a cero');
      }

      const previousQuantity = stock.quantity;
      let newQuantity = previousQuantity;

      // Aplicar lógica según el tipo de movimiento (SWITCH)
      switch (type) {
        case 'entrada':
          // Aumentar stock (compra, devolución de producción, etc.)
          newQuantity = previousQuantity + updateDto.quantity;
          break;

        case 'salida':
          // Disminuir stock (venta)
          // Validar que hay suficiente stock (IF)
          if (previousQuantity < updateDto.quantity) {
            throw new BadRequestException(
              `Stock insuficiente. Disponible: ${previousQuantity}, Solicitado: ${updateDto.quantity}`,
            );
          }
          newQuantity = previousQuantity - updateDto.quantity;
          break;

        case 'devolución':
          // Aumentar stock (devolución de cliente)
          newQuantity = previousQuantity + updateDto.quantity;
          break;

        case 'ajuste':
          // Reemplazar stock (ajuste por pérdida, daño, etc.)
          newQuantity = updateDto.quantity;
          break;
      }

      // Actualizar cantidad
      stock.quantity = newQuantity;
      stock.lastUpdated = new Date();

      // Registrar movimiento en el historial
      const movement = new StockMovement(
        type,
        updateDto.quantity,
        updateDto.reason || `Movimiento de ${type}`,
        previousQuantity,
        newQuantity,
      );
      stock.movements.push(movement);

      return this.mapToResponseDto(stock);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        'Error al actualizar stock: ' + error.message,
      );
    }
  }

  /**
   * Realiza una venta (salida de stock)
   */
  sellProduct(productId: number, quantity: number): StockResponseDto {
    return this.updateStock(productId, { quantity }, 'salida');
  }

  /**
   * Realiza una compra o entrada de stock
   */
  addStock(
    productId: number,
    quantity: number,
    reason?: string,
  ): StockResponseDto {
    return this.updateStock(productId, { quantity, reason }, 'entrada');
  }

  /**
   * Obtiene todos los productos con stock bajo
   * @returns Array de productos con cantidad <= minThreshold
   */
  getLowStockProducts(): StockResponseDto[] {
    try {
      const lowStockArray: StockResponseDto[] = [];

      // Iterar sobre el mapa de stocks (FOR...OF)
      for (const [, stock] of this.stockMap.entries()) {
        if (stock.isLow()) {
          lowStockArray.push(this.mapToResponseDto(stock));
        }
      }

      return lowStockArray;
    } catch (error) {
      throw new BadRequestException(
        'Error al obtener productos con bajo stock: ' + error.message,
      );
    }
  }

  /**
   * Obtiene el historial de movimientos de un producto
   */
  getStockMovements(productId: number): StockMovement[] {
    try {
      const stock = this.stockMap.get(productId);

      if (!stock) {
        throw new NotFoundException(
          `No se encontró stock para el producto ${productId}`,
        );
      }

      return stock.movements;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Error al obtener movimientos: ' + error.message,
      );
    }
  }

  /**
   * Obtiene todos los productos con stock
   * @returns Array con información de todos los productos
   */
  getAllStocks(): StockResponseDto[] {
    try {
      const allStocks: StockResponseDto[] = [];

      // Convertir el mapa a array (FOR...OF)
      for (const [, stock] of this.stockMap.entries()) {
        allStocks.push(this.mapToResponseDto(stock));
      }

      return allStocks;
    } catch (error) {
      throw new BadRequestException(
        'Error al obtener todos los stocks: ' + error.message,
      );
    }
  }

  /**
   * Elimina el registro de stock de un producto
   */
  deleteStock(productId: number): { message: string } {
    try {
      if (!this.stockMap.has(productId)) {
        throw new NotFoundException(
          `No se encontró stock para el producto ${productId}`,
        );
      }

      this.stockMap.delete(productId);
      return { message: `Stock del producto ${productId} eliminado` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar stock: ' + error.message);
    }
  }

  /**
   * Mapea una entidad Stock a su DTO de respuesta
   * @private
   */
  private mapToResponseDto(stock: Stock): StockResponseDto {
    let status: 'available' | 'low' | 'out_of_stock';

    if (stock.quantity === 0) {
      status = 'out_of_stock';
    } else if (stock.isLow()) {
      status = 'low';
    } else {
      status = 'available';
    }

    return {
      productId: stock.productId,
      quantity: stock.quantity,
      lastUpdated: stock.lastUpdated,
      status,
    };
  }
}
