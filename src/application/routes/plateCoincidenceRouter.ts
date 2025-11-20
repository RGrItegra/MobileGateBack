import { Router } from "express";

const router = Router();

router.get("/coincidences/:plate", async (req, res) => {
    try {
        const { plate } = req.params;

        const url = `http://10.45.0.199:8443/api/plates/coincidence/${plate}`;

        const response = await fetch(url);
        const result = await response.json();

        return res.json(Array.isArray(result) ? result : []);
    } catch (error) {
        console.error("Error obteniendo coincidencias:", error);
        return res.status(500).json({ message: "Error consultando coincidencias" });
    }
});

export default router;