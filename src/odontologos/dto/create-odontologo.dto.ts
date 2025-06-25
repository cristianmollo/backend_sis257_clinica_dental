import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateOdontologoDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  @IsString({ message: 'El campo nombre debe ser un string o cadena' })
  @MaxLength(50, {
    message: 'El campo nombre debe tener un máximo de 50 caracteres',
  })
  readonly nombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo primer apellido es obligatorio' })
  @IsString({ message: 'El campo primer apellido debe ser un string o cadena' })
  @MaxLength(50, {
    message: 'El campo primer apellido debe tener un máximo de 50 caracteres',
  })
  readonly primerApellido: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo segundo apellido es obligatorio' })
  @IsString({
    message: 'El campo segundo apellido debe ser un string o cadena',
  })
  @MaxLength(50, {
    message: 'El campo segundo apellido debe tener un máximo de 50 caracteres',
  })
  readonly segundoApellido: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo email es obligatorio' })
  @IsString({ message: 'El campo email debe ser un string o cadena' })
  @MaxLength(50, {
    message: 'El campo email debe tener un máximo de 50 caracteres',
  })
  @IsEmail({}, { message: 'El campo debe ser un email' })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo password es obligatorio' })
  @IsString({ message: 'El campo password debe ser un string o cadena' })
  @MaxLength(250, {
    message: 'El campo password debe tener un máximo de 50 caracteres',
  })
  readonly password?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo telefono es obligatorio' })
  @IsString({ message: 'El campo telefono debe ser un string o cadena' })
  @MaxLength(15, {
    message: 'El campo telefono debe tener un máximo de 15 caracteres',
  })
  readonly telefono: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo direccion es obligatorio' })
  @IsString({ message: 'El campo direccion debe ser un string o cadena' })
  @MaxLength(100, {
    message: 'El campo direccion debe tener un máximo de 100 caracteres',
  })
  readonly direccion: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo especialidad es obligatorio' })
  @IsString({ message: 'El campo especialidad debe ser un string o cadena' })
  @MaxLength(50, {
    message: 'El campo especialidad debe tener un máximo de 50 caracteres',
  })
  readonly especialidad: string;
}
