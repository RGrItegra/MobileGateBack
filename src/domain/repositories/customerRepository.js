import { Customer } from "../models/index.js";

class CustomerRepository {
  async createCustomer(data) {
    return await Customer.create({
      sesId: data.sesId,
      usrId: data.usrId,
      fisId: data.fisId
    });
  }
}

export default new CustomerRepository();
