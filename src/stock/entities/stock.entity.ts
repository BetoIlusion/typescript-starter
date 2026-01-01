/**
 * Entidad Stock - Representa el inventario de un producto
 * Propiedades:
 * - id: Identificador único
 * - productId: Referencia al producto
 * - quantity: Cantidad disponible
 * - minThreshold: Cantidad mínima antes de alertar
 * - lastUpdated: Fecha de la última modificación
 * - movements: Historial de movimientos
 */
export class Stock {
  id: number;
  productId: number;
  quantity: number;
  minThreshold: number;
  lastUpdated: Date;
  movements: StockMovement[];

  constructor(productId: number, quantity: number = 0) {
    this.productId = productId;
    this.quantity = quantity;
    this.minThreshold = 10; // Valor por defecto
    this.lastUpdated = new Date();
    this.movements = [];
  }

  /**
   * Verifica si el stock está disponible
   * @returns true si quantity > 0
   */
  isAvailable(): boolean {
    return this.quantity > 0;
  }

  /**
   * Verifica si el stock está bajo el mínimo
   * @returns true si quantity <= minThreshold
   */
  isLow(): boolean {
    return this.quantity <= this.minThreshold && this.quantity > 0;
  }
}

/**
 * Clase para registrar movimientos de stock
 * Permite auditar cambios en el inventario
 */
export class StockMovement {
  id: number;
  stockId: number;
  type: 'entrada' | 'salida' | 'ajuste' | 'devolución'; // Tipo de movimiento
  quantity: number;
  reason: string;
  timestamp: Date;
  previousQuantity: number;
  newQuantity: number;

  constructor(
    type: 'entrada' | 'salida' | 'ajuste' | 'devolución',
    quantity: number,
    reason: string,
    previousQuantity: number,
    newQuantity: number,
  ) {
    this.type = type;
    this.quantity = quantity;
    this.reason = reason;
    this.timestamp = new Date();
    this.previousQuantity = previousQuantity;
    this.newQuantity = newQuantity;
  }
}
