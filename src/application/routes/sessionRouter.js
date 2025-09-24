import express from 'express';
import  SessionController from '../controllers/sessionController.js';
import   SessionValidator  from '../validator/sessionValidator.js';
//import handleValidationErrors from 'application/middlewares/handleValidationErrors.js';
import SessionController from "../controllers/sessionController.js";
import  {validateSessionMiddleware}  from '../middlewares/validateSessionMiddleware.js';


const router = express.Router();

router.patch(
  '/sessions/:sesId/close',
  SessionValidator.closeSessionValidator(), // 1. validar
                     // 2. manejar errores si los hay
  (req, res) => SessionController.closeSessionController(req, res) // 3. controller
);

router.get(
    "/sessions",validateSessionMiddleware,(req,res)=> SessionController.getSessionsController(req,res)
);






export default router;


