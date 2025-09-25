import sessionRepository from "../../domain/repositories/sessionRepository.js";
import customerRepository from "../../domain/repositories/customerRepository.js";
import transactionRepository from "../../domain/repositories/transactionRepository.js";

class PaymentService {
  async confirmPayment(req) {
    const { sesId, usr_id, devId, fisId } = req.user; // lo trae del token decodificado

    // 1. Verificar sesión en BD
    const session = await sessionRepository.findById(sesId);
    if (!session) throw new Error("Sesión no encontrada");

    // 2. Crear Customer
    const customer = await customerRepository.createCustomer({
      sesId,
      usrId: usr_id,
      fisId: session.fisId
    });

   /* // 3. Generar valores para TransactionData
    const now = new Date();
    const traInvoiceNumber = now.toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, ""); // HHmmss
    const traRefenceId = parseInt(traInvoiceNumber).toString(16); // Hexadecimal
    const timestamp = now.toISOString(); // yyyy-MM-dd’T’HH:mm:ss.SSS*/

    const now = new Date();
const utcMinus5 = new Date(now.getTime() - 5 * 60 * 60 * 1000);

// HHmmss
const traInvoiceNumber = utcMinus5
  .toLocaleTimeString("en-GB", { hour12: false })
  .replace(/:/g, "");

// Hexadecimal
const traRefenceId = parseInt(traInvoiceNumber).toString(16);

// ISO con zona horaria ajustada
const timestamp = utcMinus5.toISOString().replace("Z", "-05:00");

//console.log({ traInvoiceNumber, traRefenceId, timestamp });

const transaction = await transactionRepository.createTransaction({
  sesId: session.sesId,          // 👈 importante
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

    return {
      message: "Pago confirmado",
      session: { sesId: session.sesId, fisId: session.fisId },
      customer,
      transaction
    };
  }
}

export default new PaymentService();
