import { IsNumber, IsOptional, Length, Min } from 'class-validator';

export class UpdateWishDto {
  @IsOptional()
  @Length(1, 1024, { message: 'Описание должно быть длиной от 1 до 1024 символов' })
  description: string;

  @IsOptional()
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price: number;
}
