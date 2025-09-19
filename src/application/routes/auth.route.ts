import { Router } from "express";
import { loginExternalAPI } from "../services/auth.service";

const routerLogin = Router();

routerLogin.post("/login", async (req, res) => {
    try {
        const {name , password} = req.body;


        if (!name || !password) {
            return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
        }

        const data = await loginExternalAPI(name, password);
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