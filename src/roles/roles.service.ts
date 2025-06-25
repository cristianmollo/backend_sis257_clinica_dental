import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-rol.dto';
import { UpdateRoleDto } from './dto/update-rol.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private rolesRepository: Repository<Rol>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Rol> {
    const { nombre_rol } = createRoleDto;

    if (
      !nombre_rol ||
      (nombre_rol !== 'odontologo' && nombre_rol !== 'cliente')
    ) {
      throw new ConflictException(
        'El campo rol es obligatorio y debe ser "odontologo" o "cliente"',
      );
    }

    const rol = new Rol();
    rol.nombre_rol = createRoleDto.nombre_rol.trim();
    return this.rolesRepository.save(rol);
  }

  async findAll(): Promise<Rol[]> {
    return this.rolesRepository.find();
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolesRepository.findOneBy({ id });
    if (!rol) throw new NotFoundException('El rol no existe');
    return rol;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Rol> {
    const rol = await this.findOne(id);
    const rolUpdate = Object.assign(rol, updateRoleDto);
    return this.rolesRepository.save(rolUpdate);
  }

  async remove(id: number) {
    const rol = await this.findOne(id);
    return this.rolesRepository.softRemove(rol);
  }
}
