import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Odontologo } from 'src/odontologos/entities/odontologo.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';

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

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50 })
  estado: string;

  @Column('integer', { name: 'cliente_id' })
  clienteId: number;

  @Column('integer', { name: 'odontologo_id' })
  odontologoId: number;

  @Column('integer', { name: 'servicio_id' })
  servicioId: number;

  // Agregado para manejar un rango de tiempo
  @Column('timestamp', { name: 'fecha_hora_inicio' })
  fechaHoraInicio: Date;

  @Column('timestamp', { name: 'fecha_hora_fin' })
  fechaHoraFin: Date;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @Column('timestamp', { name: 'fecha_confirmacion', nullable: true })
  fechaConfirmacion: Date;
  
  @Column('timestamp', { name: 'fecha_suspension', nullable: true })
  fechaSuspension: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion', select: false })
  fechaEliminacion: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.citas)
  @JoinColumn({ name: 'cliente_id', referencedColumnName: 'id' })
  cliente: Cliente;

  @ManyToOne(() => Odontologo, (odontologo) => odontologo.citas)
  @JoinColumn({ name: 'odontologo_id', referencedColumnName: 'id' })
  odontologo: Odontologo;

  @ManyToOne(() => Servicio, (servicio) => servicio.citas)
  @JoinColumn({ name: 'servicio_id', referencedColumnName: 'id' })
  servicio: Servicio;
}
