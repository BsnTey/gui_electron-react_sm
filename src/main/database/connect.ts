require('dotenv').config();
import { Sequelize } from 'sequelize-typescript';
import { AccountSportmaster } from './models/accounts.entity';
import { Proxy } from './models/proxy.entity';
import { CartIn } from './models/createCart/in.entity';
import { CartOut } from './models/createCart/out.entity';

export const sequelize = new Sequelize({
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  dialect: 'postgres',
  models: [AccountSportmaster, Proxy, CartIn, CartOut],
});
