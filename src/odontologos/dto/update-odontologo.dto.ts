import { PartialType } from '@nestjs/swagger';
import { CreateOdontologoDto } from './create-odontologo.dto';

export class UpdateOdontologoDto extends PartialType(CreateOdontologoDto) {}
