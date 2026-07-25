import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  user: 'appuser',
  password: 'apppassword',
  database: 'mydb',
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export default prisma;