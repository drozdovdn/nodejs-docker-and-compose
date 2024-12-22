import { Transform } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class IdParamDto {
  @Transform(({ value }) => parseInt(value, 10)) // Преобразуем строку в число
  @IsInt({ message: 'id должен быть числом' })
  @IsPositive({ message: 'id должен быть положительным числом' })
  id: number;
}
