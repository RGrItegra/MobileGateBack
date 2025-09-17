
import express from 'express';
import userRouter from '../../application/routes/userRouter.js';

const createServer = () => {
    const app = express();

    app.use(express.json());

    app.use('/users', userRouter);

    
    app.get('/', (req, res) => {
        res.send('Servidor Express funcionando');
    });

    return app;
};

export default createServer;
