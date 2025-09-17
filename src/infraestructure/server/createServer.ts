import express from 'express';
import routerLogin from '../../application/routes/auth.route';
import routerTicket from '../../application/routes/ticket.route';
import userRouter from '../../application/routes/userRouter';

const createServer = () => {
    const app = express();

    app.use(express.json());

    //Rutas 
    app.use('/users', userRouter);
    app.use('/auth', routerLogin);
    app.use('/ticket', routerTicket);

    
    app.get('/', (req, res) => {
        res.send('Servidor Express funcionando.....');
    });

    return app;
};

export default createServer;
