import { validToken } from "./validToken";
import  htpps from "https";
import { config } from "../../config/config";

const fetch = require("node-fetch");


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const agent = new htpps.Agent({
  rejectUnauthorized: false, //solo para pruebas
});

export async function fecthProtectedAPI(url: string, options: RequestInit = {}) {
    const token = await validToken();

    console.log("Request a api externa:", url)
    console.log("[DEBUG] Opciones enviadas:", {
        
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
            "x-device": config.device,
        },
    });

    const res = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
            "x-device": config.device,
        },
        agent,
    });



    if (!res.ok) throw new Error(`Error al consumir API: ${res.status} ${res.statusText}`);

    return await res.json();
}