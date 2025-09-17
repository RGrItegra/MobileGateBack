import { Router } from "express";
import { loginExternalAPI } from "../services/auth.service";

const routerLogin = Router();

routerLogin.post("/login", async (req, res) => {
    try {
        const { name, password } = req.body;    

        if (!name || !password){
            return res.status(400).json({error: "Debe enviar name y password"});
        }

        const data = await loginExternalAPI(name,password);
        res.json(data);

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default routerLogin;