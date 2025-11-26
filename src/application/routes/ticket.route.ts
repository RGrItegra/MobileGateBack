import { Router } from "express";
import { fecthProtectedAPI } from "../middlewares/protectedApi";
import { config } from "../../config/config";
import validToken  from "../middlewares/validToken";
import https from "https";

import confirmPayment from "../services/paymentService.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const routerTicket = Router();

const agent = new https.Agent({ 
    rejectUnauthorized: false 
});

// TicketStatus
routerTicket.post("/status/short", authMiddleware, async (req, res) => {
    try {
        const { ticket, type } = req.body;

        if (!ticket || !type) {
            console.error("[BACK] Faltan parámetros en /status:", { ticket, type });
            return res.status(400).json({ error: "Debe enviar 'ticket', 'type' y 'uuid'" });
        }

        //console.log("[BACK] Body recibido en /status:", req.body);

        const externalToken = await validToken();
        //console.log("[BACK] Token externo válido obtenido (/status)");

        const data = await fecthProtectedAPI(`${config.baseUrl}${config.routes.status}`, config.device, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${externalToken}`,
            },
            body: JSON.stringify({ ticket, type }),
            agent: agent
        });

        //console.log("[BACK] Respuesta cruda de API externa /status:", data);
        res.json(data);
    } catch (err: any) {
        console.error("[ERROR] /status:", err.message);
        res.status(500).json({ error: err.message });
    }
});


// TicketRate
routerTicket.post("/rate", authMiddleware, async (req, res) => {
    try {
        const { ticket, type } = req.body;
        //console.log("[BACK] Body recibido en /rate:", req.body);

        if (!ticket || !type) {
            return res.status(400).json({ error: "Debe enviar 'ticket' y 'type'" });
        }

        const externalToken = await validToken();
        //console.log("[BACK] Token externo válido obtenido (/rate)");

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
                agent: agent
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


routerTicket.post("/payment", authMiddleware, async (req, res) => {
    try {
        const { ticket, type, payment, rate, status, userId } = req.body;

        if (!ticket || !type || !payment) {
            console.error("[BACK] Faltan parámetros en /payment:", { ticket, type, payment });
            return res.status(400).json({ error: "Debe enviar 'ticket', 'type', 'payment'" });
        }

        // console.log("[BACK] Body recibido en /payment:", req.body);

        const externalToken = await validToken();
        // console.log("[BACK] Token externo válido obtenido (/payment)");

        //limpiar ticket antes de mandarlo a la API externa
        const ticketLimpio = ticket.replace(/^_?LP\\?/, "");
        // console.log("[BACK] Ticket limpio para API externa:", ticketLimpio);

        const bodyPago = { ticket: ticketLimpio, type, payment };

        console.log("[BACK] Body de prueba API externa /payment:", bodyPago);
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
                agent: agent
            }
        );

        //console.log("[BACK] Respuesta cruda de API externa /payment:", data);
        //res.json(data);

        //console.info(rate);
        //console.info(status);
        // console.log("[BACK] Respuesta API externa /payment:", data);
        // console.log("[BACK] Datos para confirmPayment:", {
        //     ticket: ticketLimpio,
        //     rate,
        //     statusData: status,
        //     paymentAmount: payment.amount,
        //     userId
        // });
        const resp = await confirmPayment(req, rate, status, payment.amount);
        res.json(resp);

    } catch (err: any) {
        console.error("[ERROR] /payment:", err.message);
        res.status(500).json({ error: err.message });

    }

});


routerTicket.get("/client/find", authMiddleware,  async (req, res) => {
    try {
        const { tipoDcto, nroDcto } = req.query;

        if (!tipoDcto || !nroDcto) {
            return res.status(400).json({ error: "Debe enviar tipoDcto y nroDcto" });
        }

        const url = `${config.queryUserUrl}/client/find?tipoDcto=${tipoDcto}&nroDcto=${nroDcto}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status} al consultar el cliente`);
        }

        const data = await response.json();
        res.json(data);
    } catch (err: any) {
        console.error("[ERROR] /client/find proxy:", err.message);
        res.status(500).json({ error: "Error al consultar cliente externo" });
    }
});

export default routerTicket;
