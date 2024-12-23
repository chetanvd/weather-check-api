import { IsNumber, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  title: string;

  @IsNumber()
  userId: number;
}
