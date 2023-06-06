import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class CartOut extends Model {
  @Column({
    type: DataType.STRING,
  })
  deviceId!: string;
}
