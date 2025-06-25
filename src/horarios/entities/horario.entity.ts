import { Odontologo } from 'src/odontologos/entities/odontologo.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'odontologo_id' })
  odontologoId: number;

  @Column('date')
  fecha: Date;

  @Column('time', { name: 'hora' })
  hora: string;

  @Column('boolean', { name: 'disponible' })
  disponible: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion', select: false })
  fechaEliminacion: Date;

  @ManyToOne(() => Odontologo, (odontologo) => odontologo.horarios)
  @JoinColumn({ name: 'odontologo_id', referencedColumnName: 'id' })
  odontologo: Odontologo;
}
