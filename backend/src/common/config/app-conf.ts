import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  app: {
    port: 3000,
    version: 'v1',
    env: 'development'
  },
  database: {
    host: '',
    port: 5432,
    user: '',
    password: '',
    database: '',
  }
}));
