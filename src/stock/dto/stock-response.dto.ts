/**
 * DTO para la respuesta estandarizada del stock
 * Proporciona información consistente al cliente
 */
export class StockResponseDto {
  productId: number;
  quantity: number;
  lastUpdated: Date;
  status: 'available' | 'low' | 'out_of_stock';
}
