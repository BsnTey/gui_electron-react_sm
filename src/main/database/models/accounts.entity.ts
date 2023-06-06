import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class AccountSportmaster extends Model {
  @Column({
    type: DataType.INTEGER,
  })
  accessOrder!: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  passImap!: string;

  @Column({
    type: DataType.STRING,
  })
  passEmail!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  cookie!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  accessToken!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  refreshToken!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  xUserId!: string;

  @Column({
    type: DataType.STRING,
    primaryKey: true,
    unique: true,
    allowNull: false,
  })
  deviceId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  installationId!: string;

  @Column({
    type: DataType.INTEGER,
  })
  userId!: number;
}
