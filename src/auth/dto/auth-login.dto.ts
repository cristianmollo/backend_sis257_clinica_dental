import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo Email no debe ser vacío' })
  @IsString({ message: 'El campo Email debe ser de tipo cadena' })
  @MaxLength(80, { message: 'El campo Email excede los 80 caracteres' })
  @MinLength(4, { message: 'El campo Email es menor a 4 caracteres' })
  @IsEmail({}, { message: 'El campo Email no es un correo válido' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo Clave/Contraseña no debe ser vacío' })
  @IsString({ message: 'El campo Clave/Contraseña debe ser de tipo cadena' })
  clave: string;
}