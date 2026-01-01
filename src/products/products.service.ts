import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './entities/product.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { getErrorMessage } from '../common/utils/get-error-message.js';

@Injectable()
export class ProductsService {
  /**
   * Map que almacena los productos en memoria
   * Key: productId, Value: Product
   */
  private productsMap = new Map<number, Product>();

  /**
   * Contador auto-incremental para IDs
   */
  private idCounter = 1;

  /**
   * Crea un nuevo producto en el catálogo
   * @param createProductDto - Datos del producto
   */
  create(createProductDto: CreateProductDto): Product {
    try {
      // Validar nombre no vacío (IF)
      if (!createProductDto.name || createProductDto.name.trim().length === 0) {
        throw new BadRequestException('El nombre del producto es requerido');
      }

      // Validar precio positivo (IF)
      if (createProductDto.price <= 0) {
        throw new BadRequestException('El precio debe ser mayor a 0');
      }

      // Crear nueva instancia del producto (OBJETO)
      const product = new Product(
        this.idCounter++,
        createProductDto.name,
        createProductDto.description,
        createProductDto.price,
        createProductDto.category,
      );

      // Guardar en el mapa
      this.productsMap.set(product.id, product);

      return product;
    } catch (error) {
      const msg = getErrorMessage(error);
      throw new BadRequestException('Error al crear producto: ' + msg);
    }
  }

  /**
   * Obtiene todos los productos del catálogo
   * @param onlyActive - Si true, solo retorna productos activos
   */
  findAll(onlyActive: boolean = true): Product[] {
    try {
      const allProducts: Product[] = [];

      // Iterar sobre el mapa y convertir a array (FOR...OF)
      for (const [, product] of this.productsMap.entries()) {
        // Filtrar solo activos si es necesario (IF)
        if (onlyActive && !product.isActive) {
          continue;
        }
        allProducts.push(product);
      }

      return allProducts;
    } catch (error) {
      const msg = getErrorMessage(error);
      throw new BadRequestException('Error al obtener productos: ' + msg);
    }
  }

  /**
   * Obtiene un producto específico por ID
   * @param id - ID del producto
   */
  findOne(id: number): Product {
    try {
      // Buscar en el mapa usando la key (id)
      const product = this.productsMap.get(id);

      if (!product) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const msg = getErrorMessage(error);
      throw new BadRequestException('Error al obtener producto: ' + msg);
    }
  }

  /**
   * Busca productos por nombre (búsqueda parcial)
   * @param searchTerm - Término de búsqueda
   */
  search(searchTerm: string): Product[] {
    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        throw new BadRequestException('El término de búsqueda es requerido');
      }

      const results: Product[] = [];
      const lowerSearchTerm = searchTerm.toLowerCase();

      // Iterar y filtrar (FOR...OF)
      for (const [, product] of this.productsMap.entries()) {
        if (product.name.toLowerCase().includes(lowerSearchTerm)) {
          results.push(product);
        }
      }

      return results;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const msg = getErrorMessage(error);
      throw new BadRequestException('Error en búsqueda: ' + msg);
    }
  }

  /**
   * Obtiene productos de una categoría específica
   * @param category - Nombre de la categoría
   */
  findByCategory(category: string): Product[] {
    try {
      if (!category || category.trim().length === 0) {
        throw new BadRequestException('La categoría es requerida');
      }

      const results: Product[] = [];

      // Filtrar por categoría (IF + FOR...OF)
      for (const [, product] of this.productsMap.entries()) {
        if (
          product.category.toLowerCase() === category.toLowerCase() &&
          product.isActive
        ) {
          results.push(product);
        }
      }

      return results;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const msg = getErrorMessage(error);
      throw new BadRequestException('Error al filtrar por categoría: ' + msg);
    }
  }

  /**
   * Obtiene productos dentro de un rango de precio
   * @param minPrice - Precio mínimo
   * @param maxPrice - Precio máximo
   */
  findByPriceRange(minPrice: number, maxPrice: number): Product[] {
    try {
      // Validar precios (IF)
      if (minPrice < 0 || maxPrice < 0) {
        throw new BadRequestException('Los precios no pueden ser negativos');
      }

      if (minPrice > maxPrice) {
        throw new BadRequestException(
          'El precio mínimo no puede ser mayor al máximo',
        );
      }

      const results: Product[] = [];

      // Filtrar por rango (IF + FOR...OF)
      for (const [, product] of this.productsMap.entries()) {
        if (
          product.price >= minPrice &&
          product.price <= maxPrice &&
          product.isActive
        ) {
          results.push(product);
        }
      }

      return results;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const msg = getErrorMessage(error);
      throw new BadRequestException('Error al filtrar por precio: ' + msg);
    }
  }

  /**
   * Actualiza un producto existente
   * @param id - ID del producto
   * @param updateProductDto - Datos a actualizar
   */
  update(id: number, updateProductDto: UpdateProductDto): Product {
    try {
      const product = this.findOne(id);

      // Actualizar solo campos proporcionados (IF con operador ?)
      if (updateProductDto.name !== undefined) {
        if (updateProductDto.name.trim().length === 0) {
          throw new BadRequestException('El nombre no puede estar vacío');
        }
        product.name = updateProductDto.name;
      }

      if (updateProductDto.description !== undefined) {
        product.description = updateProductDto.description;
      }

      if (updateProductDto.price !== undefined) {
        product.updatePrice(updateProductDto.price);
      }

      if (updateProductDto.category !== undefined) {
        product.category = updateProductDto.category;
      }

      product.updatedAt = new Date();

      return product;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      const msg = getErrorMessage(error);
      throw new BadRequestException('Error al actualizar producto: ' + msg);
    }
  }

  /**
   * Desactiva un producto (soft delete)
   */
  deactivate(id: number): { message: string; product: Product } {
    try {
      const product = this.findOne(id);
      product.deactivate();
      return { message: `Producto ${id} desactivado`, product };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const msg = getErrorMessage(error);
      throw new BadRequestException('Error al desactivar producto: ' + msg);
    }
  }

  /**
   * Elimina un producto permanentemente (hard delete)
   */
  remove(id: number): { message: string } {
    try {
      if (!this.productsMap.has(id)) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      this.productsMap.delete(id);
      return { message: `Producto ${id} eliminado permanentemente` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const msg = getErrorMessage(error);
      throw new BadRequestException('Error al eliminar producto: ' + msg);
    }
  }

  /**
   * Obtiene estadísticas del catálogo
   * Útil para dashboards y reportes
   */
  getStatistics(): {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    averagePrice: number;
    categories: string[];
  } {
    try {
      const allProducts = Array.from(this.productsMap.values());
      const activeProducts = allProducts.filter((p) => p.isActive);

      // Calcular promedio de precio
      const totalPrice = activeProducts.reduce((sum, p) => sum + p.price, 0);
      const averagePrice =
        activeProducts.length > 0 ? totalPrice / activeProducts.length : 0;

      // Obtener categorías únicas
      const categoriesSet = new Set(activeProducts.map((p) => p.category));

      return {
        totalProducts: allProducts.length,
        activeProducts: activeProducts.length,
        inactiveProducts: allProducts.length - activeProducts.length,
        averagePrice: parseFloat(averagePrice.toFixed(2)),
        categories: Array.from(categoriesSet),
      };
    } catch (error) {
      const msg = getErrorMessage(error);
      throw new BadRequestException('Error al obtener estadísticas: ' + msg);
    }
  }
}
