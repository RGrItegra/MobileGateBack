import { validToken } from "./validToken";
import https from "https";


const fetch = require("node-fetch");


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const agent = new  https.Agent({
  rejectUnauthorized: false, //solo para pruebas
});

/**
 * @param url endpoint externo
 * @param uuid el device enviado por el cliente
 * @param options opciones del fetch
 */



export async function fecthProtectedAPI(url: string, devUuid:string, options: RequestInit = {}) {
    const token = await validToken();

    console.log("Request a api externa:", url)
    console.log("[DEBUG] Opciones enviadas:", {
        
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
            "x-device": devUuid,
        },
    });

    const res = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
            "x-device": devUuid,
        },
        agent,
    });



    if (!res.ok) throw new Error(`Error al consumir API: ${res.status} ${res.statusText}`);

    return await res.json();
}