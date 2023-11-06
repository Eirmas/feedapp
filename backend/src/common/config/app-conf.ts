import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  app: {
    port: 3000,
    version: 'v1',
    env: 'development',
  },
  database: {
    host: process.env.NX_POSTGRES_HOST,
    port: parseInt(process.env.NX_POSTGRES_PORT, 10) || 5432,
    user: process.env.NX_POSTGRES_USER,
    password: process.env.NX_POSTGRES_PASSWORD,
    database: process.env.NX_POSTGRES_DATABASE,
  },
  mongo: {
    username: process.env.NX_MONGODB_USERNAME,
    password: process.env.NX_MONGODB_PASSWORD,
    cluster: process.env.NX_MONGODB_CLUSTER,
    database: process.env.NX_MONGODB_DATABASE,
  },
  rabbitmq: {
    url: process.env.NX_RABBITMQ_URL,
    queue: process.env.NX_RABBITMQ_QUEUE,
  },
  jwt: {
    secret: process.env.NX_JWT_SECRET,
  },
}));
