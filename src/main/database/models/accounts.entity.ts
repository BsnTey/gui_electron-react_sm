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
    type: DataType.TEXT,
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
    allowNull: true,
  })
  userId!: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  createdAt!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updatedAt!: string;
}
