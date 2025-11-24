import express from 'express';
import  SessionController from '../controllers/sessionController.js';
import   SessionValidator  from '../validator/sessionValidator.js';
//import handleValidationErrors from 'application/middlewares/handleValidationErrors.js';
import SessionController from "../controllers/sessionController.js";
import  {validateSessionMiddleware}  from '../middlewares/validateSessionMiddleware.js';
import {authMiddleware} from '../middlewares/authMiddleware.js'

const router = express.Router();

router.patch(
  '/sessions/:sesId/close',
  authMiddleware,
  SessionValidator.closeSessionValidator(), 
                     
  (req, res) => SessionController.closeSessionController(req, res) 
);

router.get(
    "/sessions",validateSessionMiddleware,(req,res)=> SessionController.getSessionsController(req,res)
);






export default router;


