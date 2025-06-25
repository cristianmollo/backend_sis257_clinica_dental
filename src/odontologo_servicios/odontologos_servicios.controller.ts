import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OdontologosServiciosService } from './odontologos_servicios.service';
import { CreateOdontologoServicioDto } from './dto/create-odontologo_servicio.dto';
import { UpdateOdontologoServicioDto } from './dto/update-odontologo_servicio.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OdontologoServicio } from './entities/odontologo_servicio.entity';

@ApiTags('Odontologos_Servicios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('odontologos_servicios')
export class OdontologosServiciosController {
  constructor(
    private readonly odontologoServiciosService: OdontologosServiciosService,
  ) {}

  @Post()
  create(@Body() createOdontologoServicioDto: CreateOdontologoServicioDto) {
    return this.odontologoServiciosService.create(createOdontologoServicioDto);
  }

  @Get()
  findAll() {
    return this.odontologoServiciosService.findAll();
  }


  @Get('mis-servicios')
  async findMisServicios(@Req() req: any) {
    const odontologoId = req.user.id; // Extraer el ID del usuario autenticado
    return this.odontologoServiciosService.findByOdontologoId(odontologoId);
  }
  @Get('mis-servicios-disponibles')
  async findServiciosDisponibles(@Req() req: any) {
    const odontologoId = req.user.id;
    return this.odontologoServiciosService.findServiciosDisponibles(odontologoId);
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OdontologoServicio> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('El id debe ser un número entero');
    }
    return this.odontologoServiciosService.findOne(parsedId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOdontologoServicioDto: UpdateOdontologoServicioDto,
  ) {
    return this.odontologoServiciosService.update(
      +id,
      updateOdontologoServicioDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.odontologoServiciosService.remove(+id);
  }

  @Delete('eliminar-relacion/:odontologoId/:servicioId')
  async eliminarRelacion(
    @Param('odontologoId') odontologoId: number,
    @Param('servicioId') servicioId: number,
  ) {
    try {
      const result =
        await this.odontologoServiciosService.eliminarRelacion(
          odontologoId,
          servicioId,
        );

      if (!result) {
        throw new BadRequestException(
          'La relación no fue encontrada o ya fue eliminada',
        );
      }

      return { message: 'Relación eliminada correctamente' };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Error al eliminar la relación',
      );
    }
  }
}
