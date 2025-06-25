import { PartialType } from '@nestjs/swagger';
import { CreateCitaDto } from './create-cita.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateCitaDto extends PartialType(CreateCitaDto) {
    @ApiProperty({ required: false })
    @IsOptional()
    readonly fechaConfirmacion?: Date;

    @ApiProperty({ required: false })
    @IsOptional()
    readonly fechaSuspension?: Date;
}
