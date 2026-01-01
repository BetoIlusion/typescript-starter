import { IsString, IsNumber, IsPositive, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para crear un nuevo producto
 * Valida que todos los campos sean válidos antes de procesarlos
 */
export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  category: string;
}
