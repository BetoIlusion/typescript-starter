import { IsNumber, IsPositive, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO (Data Transfer Object) para actualizar el stock de un producto
 * Valida que la cantidad sea un número positivo
 */
export class UpdateStockDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  reason?: string; // Razón del cambio (entrada, salida, ajuste, etc.)
}
