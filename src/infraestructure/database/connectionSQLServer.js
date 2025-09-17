import dotenv from 'dotenv';
dotenv.config(); // 🔹 esto debe ir primero

import { Sequelize } from 'sequelize';
//console.log('DB_HOST:', process.env.DB_HOST);
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10), // siempre lee del .env
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    },
    logging: false,
  }
);


export default sequelize;
