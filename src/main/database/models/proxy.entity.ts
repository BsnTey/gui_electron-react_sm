import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Proxy extends Model {
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  proxy!: string;
}
