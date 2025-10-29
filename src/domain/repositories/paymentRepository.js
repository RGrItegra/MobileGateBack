import { Payment } from "../models/index.js";

class PaymentRepository {
    async createPayment(data) {
        return await Payment.create(data);
    }

    async findByTransactionId(traId) {
        return await Payment.findAll({ where: { traId } });
    }
}

export default new PaymentRepository();