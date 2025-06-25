import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { Cita } from './entities/cita.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Odontologo } from 'src/odontologos/entities/odontologo.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private citasRepository: Repository<Cita>,
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
    @InjectRepository(Odontologo)
    private odontologosRepository: Repository<Odontologo>,
    @InjectRepository(Servicio)
    private serviciosRepository: Repository<Servicio>,
  ) {}

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    const { clienteId, odontologoId, fechaHoraInicio, fechaHoraFin } =
      createCitaDto;

    // Verificar si el cliente existe
    const clienteExistente = await this.clientesRepository.findOneBy({
      id: clienteId,
    });
    if (!clienteExistente) {
      throw new NotFoundException(`El cliente con ID ${clienteId} no existe`);
    }

    // Verificar si el odontólogo existe
    const odontologoExistente = await this.odontologosRepository.findOneBy({
      id: odontologoId,
    });
    if (!odontologoExistente) {
      throw new NotFoundException(
        `El odontólogo con ID ${odontologoId} no existe`,
      );
    }

    // Verificar si el servicio existe
    const servicioExistente = await this.serviciosRepository.findOneBy({
      id: createCitaDto.servicioId,
    });
    if (!servicioExistente) {
      throw new NotFoundException(
        `El servicio con ID ${createCitaDto.servicioId} no existe`,
      );
    }

    // Validar horario permitido
    this.validarHorarioPermitido(
      new Date(fechaHoraInicio),
      new Date(fechaHoraFin),
    );

    // Verificar que el odontólogo no tenga citas en el rango de horas
    const citasEnRango = await this.citasRepository.find({
      where: {
        odontologoId,
        fechaHoraInicio: LessThanOrEqual(new Date(fechaHoraFin)),
        fechaHoraFin: MoreThanOrEqual(new Date(fechaHoraInicio)),
      },
    });

    if (citasEnRango.length > 0) {
      const horariosOcupados = citasEnRango
        .map(
          (cita) =>
            `De ${cita.fechaHoraInicio.toLocaleString()} a ${cita.fechaHoraFin.toLocaleString()}`,
        )
        .join(', ');

      throw new ConflictException(
        `El odontólogo seleccionado ya tiene citas en el rango de horas especificado. Horarios ocupados: ${horariosOcupados}.`,
      );
    }

    const nuevaCita = this.citasRepository.create(createCitaDto);
    return this.citasRepository.save(nuevaCita);
  }

  async findAll(): Promise<Cita[]> {
    return this.citasRepository.find({
      relations: ['cliente', 'odontologo', 'servicio'],
    });
  }

  async findOne(id: number): Promise<Cita> {
    const cita = await this.citasRepository.findOne({
      where: { id },
      relations: ['cliente', 'odontologo', 'servicio'],
    });

    if (!cita) throw new NotFoundException('La cita no existe');
    return cita;
  }

  async update(id: number, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    const cita = await this.findOne(id);

    if (!cita) {
      throw new NotFoundException(`La cita con ID ${id} no existe`);
    }

    const {
      clienteId,
      odontologoId,
      servicioId,
      fechaHoraInicio,
      fechaHoraFin,
      estado,
    } = updateCitaDto;

    // Validar si el cliente se está actualizando
    if (clienteId && clienteId !== cita.clienteId) {
      const clienteExistente = await this.clientesRepository.findOneBy({
        id: clienteId,
      });
      if (!clienteExistente) {
        throw new NotFoundException(`El cliente con ID ${clienteId} no existe`);
      }
    }

    // Validar si el odontólogo se está actualizando
    if (odontologoId && odontologoId !== cita.odontologoId) {
      const odontologoExistente = await this.odontologosRepository.findOneBy({
        id: odontologoId,
      });
      if (!odontologoExistente) {
        throw new NotFoundException(
          `El odontólogo con ID ${odontologoId} no existe`,
        );
      }
    }

    // Validar si el servicio se está actualizando
    if (servicioId && servicioId !== cita.servicioId) {
      const servicioExistente = await this.serviciosRepository.findOneBy({
        id: servicioId,
      });
      if (!servicioExistente) {
        throw new NotFoundException(
          `El servicio con ID ${servicioId} no existe`,
        );
      }
    }

    // Validar horario permitido y fechas
    if (fechaHoraInicio && fechaHoraFin) {
      this.validarHorarioPermitido(
        new Date(fechaHoraInicio),
        new Date(fechaHoraFin),
      );

      // Verificar que el odontólogo no tenga citas en el rango de horas (solo si se actualizan las fechas)
      const citasEnRango = await this.citasRepository.find({
        where: {
          odontologoId: odontologoId || cita.odontologoId,
          fechaHoraInicio: LessThanOrEqual(new Date(fechaHoraFin)),
          fechaHoraFin: MoreThanOrEqual(new Date(fechaHoraInicio)),
          id: Not(id),
        },
      });

      if (citasEnRango.length > 0) {
        const horariosOcupados = citasEnRango
          .map(
            (citaExistente) =>
              `De ${citaExistente.fechaHoraInicio.toLocaleString()} a ${citaExistente.fechaHoraFin.toLocaleString()}`,
          )
          .join(', ');

        throw new ConflictException(
          `El odontólogo seleccionado ya tiene citas en el rango de horas especificado. Horarios ocupados: ${horariosOcupados}.`,
        );
      }

      cita.fechaHoraInicio = new Date(fechaHoraInicio);
      cita.fechaHoraFin = new Date(fechaHoraFin);
    }

    // Actualizar Estado y fechas relacionadas
    if (estado) {
      cita.estado = estado;

      if (estado === 'Confirmado') {
        cita.fechaConfirmacion = new Date();
      } else if (estado === 'Rechazado') {
        cita.fechaSuspension = new Date();
      }
    }

    // Combinar la cita existente con los nuevos datos
    const citaActualizada = {
      ...cita, // Mantener los datos existentes
      ...updateCitaDto, // Sobrescribir con los nuevos datos
    };

    // Guardar cambios
    return this.citasRepository.save(citaActualizada);
  }

  async remove(id: number): Promise<Cita> {
    const cita = await this.findOne(id);
    return this.citasRepository.softRemove(cita);
  }

  async obtenerServiciosPorOdontologo(
    odontologoId: number,
  ): Promise<Servicio[]> {
    const servicios = await this.serviciosRepository
      .createQueryBuilder('servicio')
      .innerJoin('odontologo_servicios', 'os', 'os.servicio_id = servicio.id')
      .where('os.odontologo_id = :odontologoId', { odontologoId })
      .getMany();

    if (!servicios || servicios.length === 0) {
      throw new NotFoundException(
        `El odontólogo con ID ${odontologoId} no tiene servicios asociados`,
      );
    }

    return servicios;
  }

  private validarHorarioPermitido(fechaHoraInicio: Date, fechaHoraFin: Date) {
    const inicio = new Date(fechaHoraInicio);
    const fin = new Date(fechaHoraFin);

    const horario1Inicio = new Date(inicio);
    horario1Inicio.setHours(8, 0, 0, 0);

    const horario1Fin = new Date(inicio);
    horario1Fin.setHours(12, 30, 0, 0);

    const horario2Inicio = new Date(inicio);
    horario2Inicio.setHours(14, 0, 0, 0);

    const horario2Fin = new Date(inicio);
    horario2Fin.setHours(18, 0, 0, 0);

    if (
      !(
        (inicio >= horario1Inicio && fin <= horario1Fin) ||
        (inicio >= horario2Inicio && fin <= horario2Fin)
      )
    ) {
      throw new ConflictException(
        'Las citas solo se pueden programar entre 8:00-12:30 y 14:00-18:00.',
      );
    }
  }
}
