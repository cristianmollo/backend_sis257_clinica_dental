import { Cita } from 'src/citas/entities/cita.entity';
import { Horario } from 'src/horarios/entities/horario.entity';
import { OdontologoServicio } from 'src/odontologo_servicios/entities/odontologo_servicio.entity';
import { Rol } from 'src/roles/entities/role.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('odontologos')
export class Odontologo {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50 })
  nombre: string;

  @Column('varchar', { length: 50, name: 'primer_apellido' })
  primerApellido: string;

  @Column('varchar', { length: 50, name: 'segundo_apellido' })
  segundoApellido: string;

  @Column('varchar', { length: 50 })
  email: string;

  @Column('varchar', { length: 250 })
  password: string;

  @Column('varchar', { length: 15 })
  telefono: string;

  @Column('varchar', { length: 100 })
  direccion: string;

  @Column('varchar', { length: 50 })
  especialidad: string;

  @Column('integer', { name: 'rol_id', default: 1 })
  rol_id: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion', select: false })
  fechaEliminacion: Date;

  //Bug correcion al actualizar, ahora se puede actualizar la contraseña
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      // Solo genera el hash si la contraseña está presente
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

   // Implementación de la validación de la contraseña
   async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }


  @OneToMany(
    () => OdontologoServicio,
    (odontologo_servicio) => odontologo_servicio.odontologo,
  )
  odontologo_servicios: OdontologoServicio[];

  @ManyToOne(() => Rol, (rol) => rol.odontologos)
  @JoinColumn({ name: 'rol_id', referencedColumnName: 'id' })
  rol: Rol;

  @OneToMany(() => Cita, (cita) => cita.odontologo)
  citas: Cita[];

  @OneToMany(() => Horario, (horario) => horario.odontologo)
  horarios: Horario[];
}
