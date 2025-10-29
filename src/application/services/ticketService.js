import validToken from "../middlewares/validToken";
import https from "https";

class TicketService {
  async getTicketRate(ticket, type = "LP") {
    try {
      ticket = String(ticket).trim();
      type = String(type).trim();

      if (!ticket) throw new Error("El parámetro 'ticket' no puede estar vacío");

      const token = await validToken();
      const body = { ticket, type };

      console.log("[DEBUG ticketService] Llamando a ticket/rate con:", body);

      const agent = new https.Agent({ 
        rejectUnauthorized: false 
      });

      const response = await fetch("https://resources.itegra.co:8443/ticket/rate", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "device": process.env.DEVICE_UUID || "b81a1d70-1891-4140-adb6-aa04c7e3961b" // ← AGREGAR
        },
        body: JSON.stringify(body),
        agent: agent
      });

      console.log("[DEBUG ticketService] Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[ERROR ticketService] Respuesta:", errorText);
        throw new Error(`Error en API de tickets: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("[DEBUG ticketService] Respuesta exitosa:", data);

      let iteStrId = "101";
      let iteName = "Aparcamiento limitado";

      if (type === "ULP") {
        iteStrId = "102";
        iteName = "Aparcamiento ilimitado";
      }

      return {
        price: data.price,
        netPrice: data.netPrice,
        turnover: data.turnover,
        netTurnover: data.netTurnover,
        rateNumber: data.rateNumber,
        dateTimeEnd: data.dateTimeEnd,
        rateEnd: data.rateEnd,
        refounds: data.refounds || [],
        iteStrId: iteStrId,
        iteName: iteName,
        iteTariffName: data.rateName 

      };

    } catch (error) {
      console.error("[ERROR ticketService]", error.message);
      throw error;
    }
  }

async getTicketStatus(ticket, type = "LP") {
  try {
    ticket = String(ticket).trim();
    type = String(type).trim();

    if (!ticket) throw new Error("El parámetro 'ticket' no puede estar vacío");

    const token = await validToken();
    const body = { ticket, type };

    console.log("[DEBUG ticketService] Llamando a ticket/status/short con:", body);

    const agent = new https.Agent({ 
      rejectUnauthorized: false 
    });

    const response = await fetch("https://resources.itegra.co:8443/ticket/status/short", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "device": process.env.DEVICE_UUID || "b81a1d70-1891-4140-adb6-aa04c7e3961b"
      },
      body: JSON.stringify(body),
      agent: agent
    });

    console.log("[DEBUG ticketService status] Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[ERROR ticketService status] Respuesta:", errorText);
      throw new Error(`Error en API status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("[DEBUG ticketService status] Respuesta exitosa:", data);

    return {
       entryAreaId: data.entryAreaId ?? null,     // Ya viene directo
      entryAreaName: data.entryAreaName || null,  // Ya viene directo
      entryDeviceId: data.inDeviceId || null,
      entryDeviceName: data.inDeviceName || null,
      entryTime: data.inputDate || null,
      nroTicket: data.nroTicket || null
    };

    } catch (error) {
      console.error("[ERROR ticketService getTicketStatus]", error.message);
      throw error;
    }
  }
}

export default new TicketService();