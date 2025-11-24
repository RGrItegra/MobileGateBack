import sessionRepository from "../../domain/repositories/sessionRepository.js";
import customerRepository from "../../domain/repositories/customerRepository.js";
import transactionRepository from "../../domain/repositories/transactionRepository.js";
import itemRepository from "../../domain/repositories/itemRepository.js";
import parkingItemRepository from "../../domain/repositories/parkingItemRepository.js";
import paymentRepository from "../../domain/repositories/paymentRepository.js";
import fiscalConfigRepository from "../../domain/repositories/fiscalConfigRepository.js";
import deviceRepository from "../../domain/repositories/deviceRepository.js";
import ticketService from "./ticketService.js";


  async function confirmPayment(req, ticketRateData, ticketStatusData, payment) {
    try {
      const { sesId, usr_id, devId, fisId } = req.user;
      const { ticket, type, userId} = req.body;

      //console.log("[DEBUG paymentService] Datos recibidos:", { sesId, usr_id, ticket, type });

      if (!ticket || !type) {
        throw new Error("Faltan parámetros requeridos: ticket y type");
      }

      //if (!payment) throw new Error("Falta el campo paymentAmount");

      // 1. Verificar sesión en BD
      const session = await sessionRepository.findById(sesId);
      if (!session) throw new Error("Sesión no encontrada");

      const fiscalConfig = await fiscalConfigRepository.findById(session.fisId);
      const device = await deviceRepository.findById(fiscalConfig.devId);

      //console.log("[DEBUG paymentService] Sesión encontrada:", session.sesId);

      const cleanTicket = String(ticket).replace(/^_?LP\\/, "").trim();
      //console.log("[DEBUG paymentService] Ticket limpio:", cleanTicket);

      // 2. Obtener datos del ticket rate (para Item)
      //const ticketRateData = await ticketService.getTicketRate(cleanTicket, type);
      //console.log("[DEBUG paymentService] Datos del ticket rate:", ticketRateData);

      // 3. Obtener datos del status (para ParkingItem)
      //const ticketStatusData = await ticketService.getTicketStatus(cleanTicket, type);
      //console.log("[DEBUG paymentService] Datos del ticket status:", ticketStatusData);

      // 4. Crear Customer
      const customer = await customerRepository.createCustomer({
        externalId: userId || null
      });

   

      //console.log("[DEBUG paymentService] Cliente creado:", customer.cusId);

      // 5. Generar timestamps
      const now = new Date();

      // Restar 5 horas (UTC-5)
      const utcMinus5 = new Date(now.getTime() - 5 * 60 * 60 * 1000);

      // Invoice number (HHmmss)
      const traInvoiceNumber = utcMinus5
        .toISOString()
        .slice(11, 19) // HH:mm:ss
        .replace(/:/g, ""); // HHmmss

      // Reference ID basado en timestamp (fecha completa en hex)
      const traReferenceId = utcMinus5.getTime().toString(16);

      // Timestamp (YYYY-MM-DD HH:mm:ss)
      const timestamp = utcMinus5.toISOString().slice(0, 19).replace("T", " ");
      /*
      console.log("traInvoiceNumber:", traInvoiceNumber);
      console.log("traRefenceId:", traRefenceId);
      console.log("timestamp:", timestamp);*/
      // 6. Crear transacción
      const transaction = await transactionRepository.createTransaction({
        traId : null,
        sesId: session.sesId,
        cusId: customer.cusId,
        fisId: session.fisId,
        traInvoiceNumber,
        traReferenceId,
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

      //console.log("[DEBUG paymentService] Transacción creada:", transaction.traId);

      // 7. Extraer el monto del turnover
      //console.info(payment);
      const iteUnitPrice = payment;

      // 8. Calcular impuestos
      const TAX_PERCENTAGE = parseFloat(process.env.TAX_PERCENTAGE || "19");
      const iteTotalPrice = iteUnitPrice;
      const iteTotalPriceBase = Math.round((iteUnitPrice / (1.0 + TAX_PERCENTAGE / 100.0)) * 100) / 100;
      const iteTotalPriceTax = Math.round((iteUnitPrice - iteTotalPriceBase) * 100) / 100;

      const itemToCreate = {
        traId: transaction.traId,
        iteStrId: ticketStatusData.entryAreaId===0?"7001":"7002",
        iteName: "Aparcamiento limitado",
        iteDescription: "",
        iteQuantity: 1,
        iteQuantityUnit: "Cant.",
        iteUnitPrice: iteUnitPrice,
        iteTotalPrice: iteTotalPrice,
        iteTaxId: 1,
        iteItemType: 1,
        disId: null,
        iteTax: TAX_PERCENTAGE,
        iteTotalPriceBaseTax: iteTotalPriceBase,
        iteTotalPriceTax: iteTotalPriceTax,
        iteTaxName: "IVA"
      };
      //console.info(itemToCreate);

      // 9. Crear Item
      const item = await itemRepository.createItem(itemToCreate);

      //console.log("[DEBUG paymentService] Item creado:", item.iteId);

      // 10. Crear ParkingItem - CORREGIDO CON PREFIJO "ite"
      const parkingItem = await parkingItemRepository.createParkingItem({
        iteId: item.iteId,
        iteEntryAreaId: ticketStatusData.entryAreaId,
        iteEntryAreaName: ticketStatusData.entryAreaName,
        iteEntryDeviceId: ticketStatusData.inDeviceId,
        iteEntryDeviceName: ticketStatusData.inDeviceName,
        iteEntryTime: ticketStatusData.inputDate,
        itePaidUntil: ticketRateData.rateEnd,
        iteTicketId: ticketStatusData.nroTicket,
        iteTicketType: 0,
        iteTariffId: ticketRateData.rateNumber,  
        iteTariffName: ticketRateData.rateName 
      });

      

      const pay = await paymentRepository.createPayment({
        payAmount: iteUnitPrice,
        payChange: 0,
        currId: null,
        payName: "Efectivo",
        payDescription: null,
        payPaymentType: 10,
        traId: transaction.traId
      });

      return {
        invoice:{
          lines:[
            process.env.COMPANY_NAME,
            process.env.COMPANY_NIT,
            process.env.COMPANY_ADDRESS,
            '',
            'Comprobante de Pago',
            'Caja '+device.devName,
            'Fecha '+timestamp,
            'Ticket '+parkingItem.iteTicketId,
            "Inicio servicio "+ticketStatusData.inputDate.replace('T',' ').substring(0,19),
            "Fin servicio "+timestamp,
            "",
            itemToCreate.iteName + " "+itemToCreate.iteQuantityUnit+" "+itemToCreate.iteQuantity,
            "Base $"+itemToCreate.iteTotalPriceBaseTax,
            "IVA "+itemToCreate.iteTax+"% $"+itemToCreate.iteTotalPriceTax,
            "TOTAL $"+itemToCreate.iteTotalPrice,
            "",
            "Cajero "+session.sesCashierName,
            "Operado por "+process.env.COMPANY_OPERATOR
          ]
        }
      };

    } catch (error) {
      console.error("[ERROR paymentService]", error.message);
      throw error;
    }
  }


export default confirmPayment;


