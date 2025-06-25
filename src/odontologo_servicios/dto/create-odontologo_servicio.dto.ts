import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber } from 'class-validator';

export class CreateOdontologoServicioDto {
  @ApiProperty()
  @IsDefined({ message: 'El campo odontologo_id es obligatorio' })
  @IsNumber({}, { message: 'El campo odontologo_id debe ser de tipo number' })
  readonly odontologoId: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo servicio_id es obligatorio' })
  @IsNumber({}, { message: 'El campo servicio_id debe ser de tipo number' })
  readonly servicioId: number;
}
