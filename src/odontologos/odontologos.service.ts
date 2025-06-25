import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOdontologoDto } from './dto/create-odontologo.dto';
import { UpdateOdontologoDto } from './dto/update-odontologo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Odontologo } from './entities/odontologo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OdontologosService {
  constructor(
    @InjectRepository(Odontologo)
    private odontologosRepository: Repository<Odontologo>,
  ) {}

  async create(createOdontologoDto: CreateOdontologoDto): Promise<Odontologo> {
    const buscarRepetidos = await this.odontologosRepository.findOne({
      where: { email: createOdontologoDto.email },
    });

    if (buscarRepetidos)
      throw new ConflictException('El odontólogo con ese email ya existe');

    const odontologo = new Odontologo();
    odontologo.nombre = createOdontologoDto.nombre.trim();
    odontologo.primerApellido = createOdontologoDto.primerApellido.trim();
    odontologo.segundoApellido = createOdontologoDto.segundoApellido.trim();
    odontologo.email = createOdontologoDto.email.trim();
    odontologo.password = createOdontologoDto.password.trim();
    odontologo.telefono = createOdontologoDto.telefono.trim();
    odontologo.direccion = createOdontologoDto.direccion.trim();
    odontologo.especialidad = createOdontologoDto.especialidad.trim();

    return this.odontologosRepository.save(odontologo);
  }

  async findAll(): Promise<Odontologo[]> {
    return this.odontologosRepository.find({ relations: ['rol'] });
  }

  async findOne(id: number): Promise<Odontologo> {
    const odontologo = await this.odontologosRepository.findOneBy({ id });
    if (!odontologo) throw new ConflictException('El odontologo no existe');

    return odontologo;
  }

  async findAuthenticatedUser(id: number): Promise<Odontologo> {
    // Reutilizamos findOne para obtener al odontologo autenticado
    return this.findOne(id);
  }

  async update(
    id: number,
    updateOdontologoDto: UpdateOdontologoDto,
  ): Promise<Odontologo> {
    const Odontologo = await this.findOne(id);
    const odontologoUpdate = Object.assign(Odontologo, updateOdontologoDto);
    return this.odontologosRepository.save(odontologoUpdate);
  }

  async remove(id: number): Promise<Odontologo> {
    const odontologo = await this.findOne(id);
    return this.odontologosRepository.softRemove(odontologo);
  }

  // aqui se valida el email y la clave
  async validate(email: string, clave: string): Promise<Odontologo | null> {
    const emailOk = await this.odontologosRepository.findOne({
      where: { email },
      select: ['id', 'nombre', 'email', 'password'], // Campos seleccionados
      relations: ['rol'], // Incluye la relación con el rol
    });
  
    if (!emailOk) {
      return null; // Retorna null si no encuentra el odontólogo
    }
  
    // Validamos la contraseña
    const isPasswordValid = await emailOk.validatePassword(clave);
    if (!isPasswordValid) {
      return null; // Retorna null si la contraseña no es válida
    }
  
    return emailOk; // Devuelve el odontólogo con el rol cargado
  }

  async cambiarPassword(
    userId: number,
    passwordActual: string,
    nuevaPassword: string,
  ): Promise<string> {
    // 1. Buscar al odontologo por ID
    const odontologo = await this.findOne(userId);
    if (!odontologo) {
      throw new NotFoundException('Odontologo no encontrado.');
    }

    // 2. Validar la contraseña actual
    const isPasswordValid = await odontologo.validatePassword(passwordActual);
    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta.');
    }

    // 3. Actualizar la contraseña
    odontologo.password = nuevaPassword; // Asignar la nueva contraseña
    await this.odontologosRepository.save(odontologo); // Guardar cambios (se hashea automáticamente en `hashPassword`)

    return 'La contraseña ha sido actualizada correctamente.';
  } 
}
