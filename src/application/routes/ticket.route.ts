import { Router } from "express";
import { fecthProtectedAPI } from "../middlewares/protectedApi";
import { config } from "../../config/config";
import validToken  from "../middlewares/validToken";

const routerTicket = Router();

// TicketStatus
routerTicket.post("/status/short", async (req, res) => {
    try {
        const { ticket, type } = req.body;

        if (!ticket || !type) {
            console.error("[BACK] Faltan parámetros en /status:", { ticket, type });
            return res.status(400).json({ error: "Debe enviar 'ticket', 'type' y 'uuid'" });
        }

        console.log("[BACK] Body recibido en /status:", req.body);

        const externalToken = await validToken();
        console.log("[BACK] Token externo válido obtenido (/status)");

        const data = await fecthProtectedAPI(`${config.baseUrl}${config.routes.status}`, config.device, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${externalToken}`,
            },
            body: JSON.stringify({ ticket, type }),
        });

        console.log("[BACK] Respuesta cruda de API externa /status:", data);
        res.json(data);
    } catch (err: any) {
        console.error("[ERROR] /status:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// TicketRate
routerTicket.post("/rate", async (req, res) => {
    try {
        const { ticket, type } = req.body;
        console.log("[BACK] Body recibido en /rate:", req.body);

        if (!ticket || !type) {
            return res.status(400).json({ error: "Debe enviar 'ticket' y 'type'" });
        }

        const externalToken = await validToken();
        console.log("[BACK] Token externo válido obtenido (/rate)");

        const data = await fecthProtectedAPI(
            `${config.baseUrl}${config.routes.rate}`,
            config.device,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${externalToken}`,
                },
                body: JSON.stringify({ ticket, type }),
            }
        );

        res.json(data);
    } catch (err: any) {
        console.error("[ERROR] /rate:", err.message);
        res.status(500).json({
            error: "fallo al consultar la tarifa api externa",
            detalle: err.message,
        });
    }
});
// TicketRate
routerTicket.post("/rate", async (req, res) => {
    try {
        const { ticket, type } = req.body;
        console.log("[BACK] Body recibido en /rate:", req.body);

        if (!ticket || !type) {
            return res.status(400).json({ error: "Debe enviar 'ticket' y 'type'" });
        }

        const externalToken = await validToken();
        console.log("[BACK] Token externo válido obtenido (/rate)");

        const data = await fecthProtectedAPI(
            `${config.baseUrl}${config.routes.rate}`,
            config.device,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${externalToken}`,
                },
                body: JSON.stringify({ ticket, type }),
            }
        );

        res.json(data);
    } catch (err: any) {
        console.error("[ERROR] /rate:", err.message);
        res.status(500).json({
            error: "fallo al consultar la tarifa api externa",
            detalle: err.message,
        });
    }
});

// Payment
routerTicket.post("/payment", async (req, res) => {
    try {
        const { ticket, type, payment } = req.body;

        if (!ticket || !type || !payment) {
            console.error("[BACK] Faltan parámetros en /payment:", { ticket, type, payment });
            return res.status(400).json({ error: "Debe enviar 'ticket', 'type', 'payment'" });
        }

        console.log("[BACK] Body recibido en /payment:", req.body);

        const externalToken = await validToken();
        console.log("[BACK] Token externo válido obtenido (/payment)");

        // 🔥 limpiar ticket antes de mandarlo a la API externa
        const ticketLimpio = ticket.replace(/^_?LP\\?/, "");
        console.log("[BACK] Ticket limpio para API externa:", ticketLimpio);

        const bodyPago = { ticket: ticketLimpio, type, payment };

        const data = await fecthProtectedAPI(
            `${config.baseUrl}${config.routes.payment}`,
            config.device,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${externalToken}`,
                },
                body: JSON.stringify(bodyPago),
            }
        );

        console.log("[BACK] Respuesta cruda de API externa /payment:", data);
        res.json(data);
    } catch (err: any) {
        console.error("[ERROR] /payment:", err.message);
        res.status(500).json({ error: err.message });
    }
});

export default routerTicket;
