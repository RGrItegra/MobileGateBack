import express from 'express';
import cors from 'cors';

// 👇 quité los .js, así ts-node busca directamente los .ts
import routerLogin from '../../application/routes/auth.route';
import routerTicket from '../../application/routes/ticket.route';
import userRouter from '../../application/routes/userRouter';
import paymentRoute from '../../application/routes/paymentRoute';
import sessionRouter from '../../application/routes/sessionRouter';
import antennaRouter from '../../application/routes/antennaRouter';
import "../../jobs/sessionCleanUp.js";

const createServer = () => {
  const app = express();

  // Middlewares
  app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  }));

  // 👇 muy importante para que req.body no sea undefined
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Rutas 
  app.use('/users', userRouter);
  app.use('/auth', routerLogin);
  app.use('/ticket', routerTicket);
  app.use('/session', sessionRouter);
  app.use('/payment', paymentRoute);
  app.use('/antenna', antennaRouter)

  /*app.get('/', (_req, res) => {
    res.send('Servidor Express funcionando.....');
  });*/

  return app;
};

export default createServer;
