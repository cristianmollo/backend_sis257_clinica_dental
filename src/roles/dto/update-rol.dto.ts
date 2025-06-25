import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-rol.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
