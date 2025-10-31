import { Router } from "express";
import { loginExternalAPI } from "../services/auth.service";


const routerLogin = Router();

routerLogin.post("/login", async (req, res) => {
    try {
        const {devUuid} = req.body;


        const user= process.env.USER;
        const password= process.env.PASSWORD;

        //console.log("[DEBUG] devUuid recibido:", devUuid);
        //console.log("[DEBUG] USER desde .env:", user);
       // console.log("[DEBUG] PASSWORD desde .env:", password ? "****" : "NO DEFINIDO");

        if (!user || !password) {
            return res.status(500).json({ error: "Credenciales no configuradas en el servidor" });
        }

        const data = await loginExternalAPI(user, password);
        res.json({
            message: "Login exitoso",
            token: data.token.key,
            expire: data.token.dateTill,
            enNote: data.enNote
        });

    } catch (err: any) {
        console.error("Error en /login:", err.message);
        res.status(500).json({ error: err.message });
    }
});

export default routerLogin;