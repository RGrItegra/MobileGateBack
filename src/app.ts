import  express from  'express' ;
import routerLogin from './application/routes/auth.route';
import routerTicket from './application/routes/ticket.route';

const app = express();
app.use(express.json());

//Api externa  
app.use("/auth", routerLogin);
app.use("/ticket", routerTicket);

app.listen(3000, () => console.log('Servidor Escuhando...'))