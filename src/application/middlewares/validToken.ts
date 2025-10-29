// validToken.ts
import { loginExternalAPI, getTokenData } from "../services/auth.service";

async function validToken(): Promise<string> {
    const { currentToken, tokenExpiry } = getTokenData();
    const now = new Date();
    const buffer = 10 * 1000;

    const user = process.env.USER;
    const password = process.env.PASSWORD;

    if (!user || !password) {
        throw new Error("Las credenciales no están definidas en las variables de entorno");
    }

    console.log("[DEBUG validToken] Token actual:", currentToken ? "Existe" : "No existe");
    console.log("[DEBUG validToken] Expira en:", tokenExpiry ? `${Math.round((tokenExpiry.getTime() - now.getTime()) / 1000)}s` : "N/A");

    if (
        !currentToken ||
        !tokenExpiry ||
        tokenExpiry.getTime() - now.getTime() <= buffer
    ) {
        console.log("[DEBUG validToken] Renovando token...");
        await loginExternalAPI(user, password);
    }

    const finalToken = getTokenData().currentToken as string;
    console.log("[DEBUG validToken] Token final:", finalToken ? `${finalToken.substring(0, 30)}...` : "NULL");

    return finalToken;
}

export default validToken; // ← Cambiar a export default