import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateHorarioDto {
  @ApiProperty()
  @IsDefined({ message: 'El campo odontologoId es requerido' })
  @IsNumber({}, { message: 'El campo odontologoId debe ser un número' })
  readonly odontologoId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo fecha es obligatorio' })
  @IsDate({ message: 'El campo fecha debe ser una fecha' })
  @Type(() => Date)
  readonly fecha: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo hora es obligatorio' })
  @IsString({ message: 'El campo hora debe ser una cadena de texto' })
  @MaxLength(25, {
    message: 'El campo hora debe tener una longitud máxima de 25 caracteres',
  })
  readonly hora: string;

  @ApiProperty()
  @IsBoolean({ message: 'El campo disponible debe ser un booleano' })
  @IsNotEmpty({ message: 'El campo disponible es obligatorio' })
  readonly disponible: boolean;
}
