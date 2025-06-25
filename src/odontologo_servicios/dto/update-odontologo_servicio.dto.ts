import { PartialType } from '@nestjs/swagger';
import { CreateOdontologoServicioDto } from './create-odontologo_servicio.dto';

export class UpdateOdontologoServicioDto extends PartialType(
  CreateOdontologoServicioDto,
) {}
