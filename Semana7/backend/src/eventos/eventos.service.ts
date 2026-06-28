import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { Evento } from './entities/evento.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EventosService {

  constructor(
    @InjectRepository(Evento) 
    private readonly eventoRepository:Repository<Evento>
  ) {}


  async create(createEventoDto: CreateEventoDto):Promise<Evento> {
    const existe = await this.eventoRepository.findOne({
      where:{nombre: createEventoDto.nombre}
    })
    if(existe) {
      throw new ConflictException("Ya existe un evento registrado con ese nombre")
    }
    const evento = this.eventoRepository.create(createEventoDto)
    return this.eventoRepository.save(evento)
  }

  async findAll():Promise<Evento[]> {
    return this.eventoRepository.find({
      order:{ id: 'DESC'}
    })
  }

  async findOne(id: number):Promise<Evento> {
    const evento = await this.eventoRepository.findOne({where: {id}})
    if(!evento){
      throw new NotFoundException("Evento no encontrado")
    }
    return evento
  }

async update(id: number, updateEventoDto: UpdateEventoDto): Promise<Evento> {
  const evento = await this.findOne(id);
  
  if (updateEventoDto.nombre && updateEventoDto.nombre !== evento.nombre) {
    const existe = await this.eventoRepository.findOne({
      where: { nombre: updateEventoDto.nombre }
    });
    if (existe) {
      throw new ConflictException("Ya existe un evento con ese nombre");
    }
  }

  Object.assign(evento, updateEventoDto); 
  
  return this.eventoRepository.save(evento);
}

  async remove(id: number):Promise<{message:string}> {
    const evento = await this.findOne(id)
    await this.eventoRepository.remove(evento)
    return{
      message:"Evento eliminado con exito"
    }
  }
}
