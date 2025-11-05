import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config(); // leer variables de entorno desde el archivo .env
import createServer from './infraestructure/server/createServer';
import { sequelize } from './domain/models';

const startApp = async () => {
    try {
        await sequelize.authenticate();
        

        await sequelize.sync({force: false}); //sincroniza los modelos con la base de datos
        //console.log('Modelos sincronizados....');

        const app = createServer(); 

        const PORT = process.env.PORT || '3000';
        const HOST = process.env.HOST || 'localhost';

        /* __dirname represents the absolute path of the directory containing the current script.
        const currentDir = __dirname; 

        // path.dirname() returns the directory name of a path.
        const parentDir = path.dirname(currentDir);

        app.use(express.static(path.join(parentDir, 'front')));
        
        // Handle all other routes by serving the React app's index.html
        // This is crucial for client-side routing with React Router
        app.get('/', (req, res) => {
            res.sendFile(path.join(parentDir, 'front', 'index.html'));
        });*/

        app.listen(parseInt(PORT), HOST, () => {
            //console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
        });
    } catch (err) {
        console.error('Error iniciando la app:', err);
    };
}

startApp();
