import { IsString, IsNumber, IsPositive, IsOptional, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para actualizar un producto
 * Todos los campos son opcionales
 */
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsString()
  category?: string;
}
