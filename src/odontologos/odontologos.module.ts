import { Module } from '@nestjs/common';
import { OdontologosService } from './odontologos.service';
import { OdontologosController } from './odontologos.controller';
import { Odontologo } from './entities/odontologo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Odontologo])],
  controllers: [OdontologosController],
  providers: [OdontologosService],
  exports: [OdontologosService],
})
export class OdontologosModule {}
