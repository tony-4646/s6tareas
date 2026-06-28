import { IsString, Length, MaxLength } from 'class-validator';

export class CreateEventoDto {
  @IsString()
  @MaxLength(50)
  nombre!: string;
  @IsString()
  @MaxLength(150)
  descripcion!: string;
}
