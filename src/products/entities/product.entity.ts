/**
 * Entidad Product - Representa un producto en el inventario
 * Propiedades:
 * - id: Identificador único
 * - name: Nombre del producto
 * - description: Descripción detallada
 * - price: Precio unitario
 * - category: Categoría del producto
 * - createdAt: Fecha de creación
 * - updatedAt: Fecha de última actualización
 * - isActive: Si el producto está activo en el catálogo
 */
export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;

  constructor(
    id: number,
    name: string,
    description: string,
    price: number,
    category: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isActive = true;
  }

  /**
   * Actualiza el precio del producto
   */
  updatePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    this.price = newPrice;
    this.updatedAt = new Date();
  }

  /**
   * Desactiva el producto del catálogo
   */
  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  /**
   * Activa el producto en el catálogo
   */
  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }
}
