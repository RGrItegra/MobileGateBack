import { TokenResponse } from "../validator/auth";
import { isTokenResponse } from "../validator/helper";
import { config } from "../../config/config";
import https from "https";
import fetch from "node-fetch";

let currentToken: string | null = null;
let tokenExpiry: Date | null = null ;

export async function loginExternalAPI(name : string, password: string): Promise<TokenResponse> {
   // console.log("[DEBUG] Body que se enviará:", { name, password });

    const agent = new https.Agent({ 
        rejectUnauthorized: false 
    });

    const res = await fetch(`${config.baseUrl}${config.routes.login}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name, password}),
        agent: agent
    });

    if (!res.ok) throw new Error(`Error al autenticar: ${res.status} ${res.statusText}`);
    const rawData = await res.json();

    if (!isTokenResponse(rawData)){
        throw new Error("Respuesta de  Api invalidad");
    }

    const data : TokenResponse = rawData;

    currentToken = data.token.key;
    tokenExpiry = new Date(data.token.dateTill);

    return data;
}


export function getTokenData() {
    return { currentToken, tokenExpiry };
}