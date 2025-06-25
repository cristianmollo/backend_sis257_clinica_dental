import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Horario } from './entities/horario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horario)
    private horariosRepository: Repository<Horario>,
  ) {}

  async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
    const { odontologoId, fecha, hora } = createHorarioDto;

    // Verificar si ya existe un horario para el odontólogo en la misma fecha y hora
    const existe = await this.horariosRepository.findOneBy({
      odontologoId,
      fecha,
      hora,
    });

    if (existe) {
      throw new ConflictException(
        'Ya existe un horario para el odontólogo en la misma fecha y hora',
      );
    }

    const horario = new Horario();
    horario.odontologoId = odontologoId;
    horario.fecha = fecha;
    horario.hora = hora;
    horario.disponible = false;
    return this.horariosRepository.save(horario);
  }

  async findAll(): Promise<Horario[]> {
    return this.horariosRepository.find({ relations: ['odontologo'] });
  }

  async findOne(id: number): Promise<Horario> {
    const horario = await this.horariosRepository.findOne({
      where: { id },
      relations: ['odontologo'],
    });
    if (!horario) {
      throw new NotFoundException(`Horario #${id} no encontrado`);
    }
    return horario;
  }

  async update(
    id: number,
    updateHorarioDto: UpdateHorarioDto,
  ): Promise<Horario> {
    const horario = await this.horariosRepository.findOneBy({ id });
    if (!horario) {
      throw new NotFoundException(`Horario #${id} no encontrado`);
    }

    const horarioUpdated = Object.assign(horario, updateHorarioDto);
    return this.horariosRepository.save(horarioUpdated);
  }

  async remove(id: number) {
    const horario = await this.horariosRepository.findOneBy({ id });
    if (!horario) {
      throw new NotFoundException(`Horario #${id} no encontrado`);
    }
    return this.horariosRepository.softRemove(horario);
  }
}
