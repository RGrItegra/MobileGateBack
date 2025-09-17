
import dotenv from 'dotenv';
dotenv.config(); // leer variables de entorno desde el archivo .env

import createServer from './infraestructure/server/createserver';
import { sequelize } from './domain/models';

const startApp = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos exitosa....');

        await sequelize.sync({force: false}); //sincroniza los modelos con la base de datos
        console.log('Modelos sincronizados....');

        const app = createServer(); 

        const PORT = process.env.PORT || 3000;
        const HOST = process.env.HOST || 'localhost';

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
        });
    } catch (err) {
        console.error('Error iniciando la app:', err);
    };
}

startApp();
