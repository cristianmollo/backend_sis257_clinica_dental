import { ConflictException, Injectable } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private serviciosRepository: Repository<Servicio>,
  ) {}

  async create(createServicioDto: CreateServicioDto): Promise<Servicio> {
    const buscarRepetidos = await this.serviciosRepository.findOne({
      where: {
        nombre: createServicioDto.nombre,
      },
    });

    if (buscarRepetidos)
      throw new ConflictException('El servicio con ese nombre ya existe');

    const servicio = new Servicio();
    servicio.nombre = createServicioDto.nombre.trim();
    servicio.descripcion = createServicioDto.descripcion.trim();
    servicio.precio = createServicioDto.precio;
    servicio.duracion = createServicioDto.duracion;

    return this.serviciosRepository.save(servicio);
  }

  async findAll(): Promise<Servicio[]> {
    return this.serviciosRepository.find();
  }

  async findOne(id: number): Promise<Servicio> {
    const servicio = await this.serviciosRepository.findOneBy({ id });
    if (!servicio) throw new ConflictException('El servicio no existe');

    return servicio;
  }

  async findByOdontologo(idOdontologo: number): Promise<Servicio[]> {
    return this.serviciosRepository
      .createQueryBuilder('servicio')
      .innerJoin('servicio.odontologo_servicios', 'odontologo_servicios')
      .innerJoin('odontologo_servicios.odontologo', 'odontologo')
      .where('odontologo.id = :idOdontologo', { idOdontologo })
      .getMany();
  }

  async update(
    id: number,
    updateServicioDto: UpdateServicioDto,
  ): Promise<Servicio> {
    const servicio = await this.findOne(id);
    const servicioUpdate = Object.assign(servicio, updateServicioDto);
    return this.serviciosRepository.save(servicioUpdate);
  }

  async remove(id: number): Promise<Servicio> {
    const servicio = await this.findOne(id);
    return this.serviciosRepository.softRemove(servicio);
  }
}
