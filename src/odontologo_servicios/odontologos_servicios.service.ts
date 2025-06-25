import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOdontologoServicioDto } from './dto/create-odontologo_servicio.dto';
import { UpdateOdontologoServicioDto } from './dto/update-odontologo_servicio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OdontologoServicio } from './entities/odontologo_servicio.entity';
import { In, Not, Repository } from 'typeorm';
import { Odontologo } from 'src/odontologos/entities/odontologo.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';

@Injectable()
export class OdontologosServiciosService {
  constructor(
    @InjectRepository(OdontologoServicio)
    private odontologoServicioRepository: Repository<OdontologoServicio>,
    @InjectRepository(Odontologo)
    private odontologoRepository: Repository<Odontologo>,
    @InjectRepository(Servicio)
    private servicioRepository: Repository<Servicio>,
  ) {}

  async create(
    createOdontologoServicioDto: CreateOdontologoServicioDto,
  ): Promise<OdontologoServicio> {
    const { odontologoId, servicioId } = createOdontologoServicioDto;

    // Verificar si el odontólogo existe
    const odontologoExistente = await this.odontologoRepository.findOneBy({
      id: odontologoId,
    });
    if (!odontologoExistente) {
      throw new NotFoundException(
        `El odontólogo con ID ${odontologoId} no existe`,
      );
    }

    // Verificar si el servicio existe
    const servicioExistente = await this.servicioRepository.findOneBy({
      id: servicioId,
    });
    if (!servicioExistente) {
      throw new NotFoundException(`El servicio con ID ${servicioId} no existe`);
    }

    const existe = await this.odontologoServicioRepository.findOne({
      where: { odontologoId: odontologoId, servicioId: servicioId },
    });
    if (existe)
      throw new ConflictException(
        `El odontólogo ya está asociado con el servicio de nombre ${servicioExistente.nombre} se agrego los no repetidos. Gracias`,
      );

    const odontologoServicio = new OdontologoServicio();
    odontologoServicio.odontologoId = createOdontologoServicioDto.odontologoId;
    odontologoServicio.servicioId = createOdontologoServicioDto.servicioId;
    return this.odontologoServicioRepository.save(odontologoServicio);
  }

  async findAll(): Promise<OdontologoServicio[]> {
    return this.odontologoServicioRepository.find({
      relations: ['odontologo', 'servicio'],
    });
  }

  async findOne(id: number): Promise<OdontologoServicio> {
    if (isNaN(id)) {
      throw new BadRequestException('El id proporcionado no es válido');
    }

    try {
      const odontologoServicio =
        await this.odontologoServicioRepository.findOneOrFail({
          where: { id },
          relations: ['odontologo', 'servicio'],
        });
      return odontologoServicio;
    } catch (error) {
      throw new ConflictException(
        'El odontólogo no está asociado con este servicio',
      );
    }
  }

  async update(
    id: number,
    updateOdontologoServicioDto: UpdateOdontologoServicioDto,
  ): Promise<OdontologoServicio> {
    const odontologoServicio =
      await this.odontologoServicioRepository.findOneBy({ id });

    if (!odontologoServicio) {
      throw new NotFoundException(
        'La relación no existe para este odontólogo y servicio',
      );
    }

    // Actualizar el servicioId
    odontologoServicio.servicioId = updateOdontologoServicioDto.servicioId;

    // Guardar los cambios
    return this.odontologoServicioRepository.save(odontologoServicio);
  }

  async remove(id: number): Promise<OdontologoServicio> {
    const odontologoServicio =
      await this.odontologoServicioRepository.findOneBy({ id });
    if (!odontologoServicio)
      throw new ConflictException(
        'El odontólogo no está asociado con este servicio',
      );
    return this.odontologoServicioRepository.softRemove(odontologoServicio);
  }

  async eliminarRelacion(
    odontologoId: number,
    servicioId: number,
  ): Promise<boolean> {
    console.log('Intentando eliminar relación:', { odontologoId, servicioId });

    try {
      // Buscar la relación
      const relacion = await this.odontologoServicioRepository.findOne({
        where: { odontologoId, servicioId },
      });

      if (!relacion) {
        console.error('Relación no encontrada en la base de datos');
        return false;
      }

      // Eliminar la relación
      await this.odontologoServicioRepository.remove(relacion);
      return true;
    } catch (error) {
      return false;
    }
  }

  async findByOdontologoId(odontologoId: number): Promise<any> {
    const odontologoServicios = await this.odontologoServicioRepository.find({
      where: { odontologoId },
      relations: ['servicio'], // Solo necesitamos los servicios relacionados
    });
  
    // Devuelve un array vacío si no hay servicios
    return odontologoServicios.map((item) => ({
      id: item.servicio.id,
      nombre: item.servicio.nombre,
      descripcion: item.servicio.descripcion,
      precio: item.servicio.precio,
      duracion: item.servicio.duracion,
    }));
  }
  

  async findServiciosDisponibles(odontologoId: number): Promise<any> {
    // Obtener los IDs de los servicios ya asignados
    const serviciosAsignados = await this.odontologoServicioRepository.find({
      where: { odontologoId },
      relations: ['servicio'],
    });
  
    const serviciosAsignadosIds = serviciosAsignados.map(item => item.servicio.id);
  
    // Obtener todos los servicios que NO están asignados
    const serviciosDisponibles = await this.servicioRepository.find({
      where: {
        id: Not(In(serviciosAsignadosIds)), // Excluir los servicios asignados
      },
    });
  
    return serviciosDisponibles;
  }
  
}
