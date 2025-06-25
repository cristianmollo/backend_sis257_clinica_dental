import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo descripcion es obligatorio' })
  @IsString({ message: 'El campo descripcion debe ser de tipo string' })
  @MaxLength(15, {
    message:
      'El campo descripcion debe tener una longitud máxima de 15 caracteres',
  })
  readonly nombre_rol: string;
}
