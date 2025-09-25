import express from 'express';
import cors from 'cors'
import routerLogin from '../../application/routes/auth.route';
import routerTicket from '../../application/routes/ticket.route';
import userRouter from '../../application/routes/userRouter';
import paymentRoute from '../../application/routes/paymentRoute'
import sessionRouter from '../../application/routes/sessionRouter'
const createServer = () => {
    const app = express();
  
  
    app.use(cors({
  origin: 'http://localhost:3001', // el puerto donde corre React
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

    app.use(express.json());
        app.use(
        cors({
            origin: process.env.FRONTEND_URL || "http://localhost:3001", 
            credentials: true, 
        })
    );
    //Rutas 
    app.use('/users', userRouter);
    app.use('/auth', routerLogin);
    app.use('/ticket', routerTicket);
    app.use('/session', sessionRouter )
    app.use('/payment', paymentRoute);

    
    app.get('/', (req, res) => {
        res.send('Servidor Express funcionando.....');
    });

    return app;
};

export default createServer;
