import sessionRepository from "../../domain/repositories/sessionRepository.js";
import customerRepository from "../../domain/repositories/customerRepository.js";
import transactionRepository from "../../domain/repositories/transactionRepository.js";
import itemRepository from "../../domain/repositories/itemRepository.js";
import parkingItemRepository from "../../domain/repositories/parkingItemRepository.js";
import ticketService from "./ticketService.js";

class PaymentService {
  async confirmPayment(req) {
    try {
      const { sesId, usr_id, devId, fisId } = req.user;
      const { ticket, type } = req.body;

      console.log("[DEBUG paymentService] Datos recibidos:", { sesId, usr_id, ticket, type });

      if (!ticket || !type) {
        throw new Error("Faltan parámetros requeridos: ticket y type");
      }

      // 1. Verificar sesión en BD
      const session = await sessionRepository.findById(sesId);
      if (!session) throw new Error("Sesión no encontrada");

      console.log("[DEBUG paymentService] Sesión encontrada:", session.sesId);

      // 2. Obtener datos del ticket rate (para Item)
      const ticketRateData = await ticketService.getTicketRate(ticket, type);
      console.log("[DEBUG paymentService] Datos del ticket rate:", ticketRateData);

      // 3. Obtener datos del status (para ParkingItem)
      const ticketStatusData = await ticketService.getTicketStatus(ticket, type);
      console.log("[DEBUG paymentService] Datos del ticket status:", ticketStatusData);

      // 4. Crear Customer
      const customer = await customerRepository.createCustomer({
        sesId,
        usrId: usr_id,
        fisId: session.fisId
      });

      console.log("[DEBUG paymentService] Cliente creado:", customer.cusId);

      // 5. Generar timestamps
      const now = new Date();
      const utcMinus5 = new Date(now.getTime() - 5 * 60 * 60 * 1000);

      const traInvoiceNumber = utcMinus5
        .toLocaleTimeString("en-GB", { hour12: false })
        .replace(/:/g, "");

      const traRefenceId = parseInt(traInvoiceNumber).toString(16);
      const timestamp = utcMinus5.toISOString().slice(0, 19).replace("T", " ");

      // 6. Crear transacción
      const transaction = await transactionRepository.createTransaction({
        sesId: session.sesId,
        cusId: customer.cusId,
        fisId: session.fisId,
        traInvoiceNumber,
        traRefenceId,
        traIsDuplicate: false,
        traTimestamp: timestamp,
        traNIT: process.env.COMPANY_NIT,
        traFiscalName: process.env.COMPANY_NAME,
        traTelephone: process.env.COMPANY_TEL,
        traAddress: process.env.COMPANY_ADDRESS,
        traOperator: process.env.COMPANY_OPERATOR,
        traNroFactura: 0,
        traIsTransmitted: false,
        traCanceled: false,
        traSaveTime: timestamp,
        traCufe: null,
        traAttDate: null,
        traExternalPdf: null
      });

      console.log("[DEBUG paymentService] Transacción creada:", transaction.traId);

      // 7. Extraer el monto del turnover
      const iteUnitPrice = parseFloat(ticketRateData.turnover.amount);

      // 8. Calcular impuestos
      const TAX_PERCENTAGE = parseFloat(process.env.TAX_PERCENTAGE || "19");
      const iteTotalPrice = iteUnitPrice;
      const iteTotalPriceBase = Math.round((iteUnitPrice / (1.0 + TAX_PERCENTAGE / 100.0)) * 100) / 100;
      const iteTotalPriceTax = Math.round((iteUnitPrice - iteTotalPriceBase) * 100) / 100;

      // 9. Crear Item
      const item = await itemRepository.createItem({
        traId: transaction.traId,
        iteStrId: ticketRateData.iteStrId,
        iteName: ticketRateData.iteName,
        iteDescription: "",
        iteQuantity: 1,
        iteQuantityUnit: "Cant.",
        iteUnitPrice: iteUnitPrice,
        iteTotalPrice: iteTotalPrice,
        iteTaxId: 1,
        iteItemType: 1,
        disId: null,
        iteTax: TAX_PERCENTAGE,
        iteTotalPriceBase: iteTotalPriceBase,
        iteTotalPriceTax: iteTotalPriceTax,
        iteTaxName: "IVA"
      });

      console.log("[DEBUG paymentService] Item creado:", item.iteId);

      // 10. Crear ParkingItem
      const parkingItem = await parkingItemRepository.createParkingItem({
        iteId: item.iteId,
        entryAreaId: ticketStatusData.entryAreaId,
        entryAreaName: ticketStatusData.entryAreaName,
        entryDeviceId: ticketStatusData.entryDeviceId,
        entryDeviceName: ticketStatusData.entryDeviceName,
        entryTime: ticketStatusData.entryTime,
        itePaidUntil: ticketRateData.rateEnd,
        iteTicketId: ticketStatusData.nroTicket,
        iteTicketType: 0,
        iteTarifId: ticketRateData.rateNumber,
        iteTariffName: ticketRateData.iteTariffName || "Tarifa estándar"
      });

      console.log("[DEBUG paymentService] ParkingItem creado:", parkingItem.iteId);

      return {
        message: "Pago confirmado",
        session: { sesId: session.sesId, fisId: session.fisId },
        customer,
        transaction,
        item,
        parkingItem,
        ticketRateData,
        ticketStatusData
      };

    } catch (error) {
      console.error("[ERROR paymentService]", error.message);
      throw error;
    }
  }
}

export default new PaymentService();