import fetch, { RequestInit } from "node-fetch";
import https from "https";
import { config } from "../../config/config"; 

const agent = new https.Agent({ rejectUnauthorized: false });

export async function fecthProtectedAPI(
    url: string,
    devUuid?: string, // ahora opcional
    options: RequestInit = {}
) {
    try {
        //console.log("[BACK-MW] Request a API externa:", url);

    
        const deviceHeader = devUuid || config.device;

        const debugHeaders = { ...(options.headers || {}), "device": deviceHeader };
        //console.log("[BACK-MW] Headers enviados:", debugHeaders);

        if (options.body) {
            try {
                const parsed = JSON.parse(options.body as string);
                //console.log("[BACK-MW] Body enviado:", parsed);

                const types = Object.fromEntries(
                    Object.entries(parsed).map(([k, v]) => [k, typeof v])
                );
                //console.log("[BACK-MW] Tipos del body:", types);
            } catch {
               // console.log("[BACK-MW] Body enviado (raw):", options.body);
            }
        }

        const res = await fetch(url, {
            ...options,
            headers: debugHeaders,
            agent,
        });

        const rawText = await res.text();
        //console.log(`[BACK-MW] Respuesta HTTP API externa: ${res.status} ${res.statusText}`);
       // console.log("[BACK-MW] Respuesta cruda:", rawText);

        if (!res.ok) {
            throw {
                status: res.status,
                message: "Error al consumir API",
                details: rawText || res.statusText,
            };
        }

        try {
            return JSON.parse(rawText);
        } catch {
            return rawText;
        }
    } catch (err: any) {
        console.error("[ERROR FETCH] fecthProtectedAPI:", err);
        throw err;
    }
}