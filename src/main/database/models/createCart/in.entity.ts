import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class CartIn extends Model {
  @Column({
    type: DataType.STRING,
  })
  deviceId!: string;
}
