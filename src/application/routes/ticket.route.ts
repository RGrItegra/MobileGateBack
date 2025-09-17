import { Router } from "express";
import { fecthProtectedAPI } from "../middlewares/protectedApi";
import { config } from "../../config/config";

const routerTicket = Router();


//TicketStatus
routerTicket.post("/status", async (req, res) => {
    try {
        const { ticket, type , uuid} = req.body;

        if (!ticket || !type || !uuid) {
            return res.status(400).json({ error: "Debe enviar 'ticket' y 'type'" });
        }

        console.log("[DEBUG] Enviando body a /status:", { ticket, type });

        const data = await fecthProtectedAPI(`${config.baseUrl}${config.routes.status}`,uuid, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ticket, type }),
        });

        res.json(data);
    } catch (err: any) {
        console.error("[ERROR] /status:", err.message);
        res.status(500).json({ error: err.message });
    }
});

//TicketRate
routerTicket.post("/rate", async(req,res)=>{
    try{
        const {ticket, type , uuid} = req.body;

        if(!ticket || !type || !uuid){
            return res.status(400).json({error:"debe envair ticket y type!!"})
        }

        console.log("[DEBUG] Enviando body a /rate:", { ticket, type });

        const data = await fecthProtectedAPI(`${config.baseUrl}${config.routes.rate}`, uuid,{
            method: "POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ticket,type}),
        });
        res.json(data)
    }   
    catch(err:any){
        console.error("[ERROR] /rate:", err.message);
        res.status(500).json({error: err.message})
    }
})

//payment

routerTicket.post("/payment", async (req, res) => {
    try {
        const { ticket, type, payment , uuid} = req.body;

        if (!ticket || !type || !payment || !uuid) {
            return res.status(400).json({ error: "Debe enviar 'ticket', 'type' y 'payment'" });
        }

        const data = await fecthProtectedAPI(`${config.baseUrl}${config.routes.payment}`, uuid,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ticket, type, payment }),
        });

        res.json(data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});


export default routerTicket;