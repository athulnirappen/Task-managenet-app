import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

function getDbConfig() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const url = new URL(databaseUrl);

  const config = {
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
    connectionLimit: 5,
  };

  const sslMode = url.searchParams.get('ssl-mode') || url.searchParams.get('sslmode');
  const useSsl =
    process.env.DB_SSL === 'true' ||
    sslMode === 'REQUIRED' ||
    sslMode === 'require' ||
    sslMode === 'VERIFY_CA';

  if (useSsl) {
    const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';
    config.ssl = process.env.DB_CA_CERT
      ? { ca: process.env.DB_CA_CERT, rejectUnauthorized }
      : { rejectUnauthorized };
  } else {
    config.allowPublicKeyRetrieval = true;
  }

  return config;
}

const adapter = new PrismaMariaDb(getDbConfig());
const prisma = new PrismaClient({ adapter });

export default prisma;
