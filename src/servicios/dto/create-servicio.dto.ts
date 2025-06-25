import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateServicioDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser un string o cadena' })
  @MaxLength(50, {
    message: 'El campo nombre debe tener un máximo de 50 caracteres',
  })
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo descripcion es obligatorio' })
  @IsString({ message: 'El campo descripcion debe ser un string o cadena' })
  @MaxLength(100, {
    message: 'El campo descripcion debe tener un máximo de 100 caracteres',
  })
  readonly descripcion: string;

  @ApiProperty({
    example: 0.0,
    description: 'Precio del servicio, puede tener hasta 2 decimales',
    type: 'number',
  })
  @IsDefined({ message: 'El campo precio es obligatorio' })
  @IsNumber({}, { message: 'El campo precio debe ser un número' })
  readonly precio: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo duracion es obligatorio' })
  @IsDefined({ message: 'El campo duracion debe estar definido' })
  @IsNumber({}, { message: 'El campo duracion debe ser un número' })
  readonly duracion: number;
}
