import { TokenResponse } from "../validator/auth";
import { isTokenResponse } from "../validator/helper";
import { config } from "../../config/config";

let currentToken: string | null = null
let tokenExpiry: Date | null = null

export async function loginExternalAPI(name: string, password: string): Promise<TokenResponse> {

    if (name !== config.credentials.user || password !== config.credentials.password) {
        throw new Error("Usuario o contraseña incorrectos");
    }

export async function loginExternalAPI(name : string, password: string): Promise<TokenResponse> {
    console.log("[DEBUG] Body que se enviará:", { name, password });
    const res = await fetch(`${config.baseUrl}${config.routes.login}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password })
    });

    if (!res.ok) throw new Error(`Error al autenticar: ${res.status} ${res.statusText}`);
    const rawData = await res.json();

    if (!isTokenResponse(rawData)) {
        throw new Error("Respuesta de  Api invalidad");
    }

    const data: TokenResponse = rawData;

    currentToken = data.token.key;
    tokenExpiry = new Date(data.token.dateTill);

    return data;
}


export function getTokenData() {
    return { currentToken, tokenExpiry };
}