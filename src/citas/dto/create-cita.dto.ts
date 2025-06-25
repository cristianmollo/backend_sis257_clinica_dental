import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCitaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo estado es obligatorio' })
  @IsString({ message: 'El campo estado debe ser un string o cadena' })
  @MaxLength(50, {
    message: 'El campo estado debe tener un máximo de 50 caracteres',
  })
  readonly estado: string;

  @ApiProperty()
  @IsDefined({ message: 'El campo fecha de inicio es obligatorio' })
  readonly fechaHoraInicio: Date;

  @ApiProperty()
  @IsDefined({ message: 'El campo fecha de fin es obligatorio' })
  readonly fechaHoraFin: Date;

  @ApiProperty()
  @IsDefined({ message: 'El campo cliente_id es obligatorio' })
  @IsNumber({}, { message: 'El campo cliente_id debe ser de tipo number' })
  readonly clienteId: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo odontologo_id es obligatorio' })
  @IsNumber({}, { message: 'El campo odontologo_id debe ser de tipo number' })
  readonly odontologoId: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo servicio_id es obligatorio' })
  @IsNumber({}, { message: 'El campo servicio_id debe ser de tipo number' })
  readonly servicioId: number;
}
