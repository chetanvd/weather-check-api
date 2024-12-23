import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Locations } from './locations.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @OneToMany(() => Locations, (location) => location.user)
  locations: Locations[];
}
