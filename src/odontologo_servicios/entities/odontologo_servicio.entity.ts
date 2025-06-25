import { Servicio } from 'src/servicios/entities/servicio.entity';
import { Odontologo } from '../../odontologos/entities/odontologo.entity';
import {
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

@Entity('odontologo_servicios')
export class OdontologoServicio {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'odontologo_id' })
  odontologoId: number;

  @Column('integer', { name: 'servicio_id' })
  servicioId: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion', select: false })
  fechaEliminacion: Date;

  @ManyToOne(() => Odontologo, (odontologo) => odontologo.odontologo_servicios)
  @JoinColumn({ name: 'odontologo_id', referencedColumnName: 'id' })
  odontologo: Odontologo;

  @ManyToOne(() => Servicio, (servicio) => servicio.odontologo_servicios)
  @JoinColumn({ name: 'servicio_id', referencedColumnName: 'id' })
  servicio: Servicio;
}
