import { Router } from "express";
import { loginExternalAPI } from "../services/auth.service";

const routerLogin = Router();

routerLogin.post("/login", async (req, res) => {
    try {
        const { usr_name, usr_passwd } = req.body;    

        if (!usr_name || !usr_passwd){
            return res.status(400).json({error: "Debe enviar name y password"});
        }

        const data = await loginExternalAPI(usr_name,usr_passwd);
        res.json({
            message: "Login exitoso",
            token: data.token.key,
            expire: data.token.dateTill,
            enNote: data.enNote
        });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default routerLogin;